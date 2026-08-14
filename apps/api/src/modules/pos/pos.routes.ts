import { Router, Response } from 'express';
import { prisma } from '../../prisma.js';
import { authenticateToken, AuthenticatedRequest } from '../../middleware/auth.js';
import { PaymentMode, SaleType } from '@afreen-mall/shared-types';

const router = Router();
router.use(authenticateToken);

// GET /api/v1/pos/registers - Get available registers
router.get('/registers', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const registers = await prisma.register.findMany({
      where: { isActive: true },
      orderBy: { posNumber: 'asc' },
    });
    return res.json({ registers });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch registers' });
  }
});

// GET /api/v1/pos/product/:barcode - Fast barcode scan lookup
router.get('/product/:barcode', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { barcode } = req.params;

    const product = await prisma.product.findUnique({
      where: { barcode },
      include: {
        category: true,
        unit: true,
        taxRate: true,
        hsnCode: true,
        inventory: true,
      },
    });

    if (!product) {
      return res.status(404).json({ error: `No product found with barcode '${barcode}'` });
    }

    // Convert values to paise representation & calculate net rate
    const mrp = product.mrp; // paise
    const rate = product.saleRate; // paise
    const discountAmt = Math.round(mrp * (product.discountPct / 100));
    const gstPct = product.taxRate.rate;
    const netRate = Math.round(rate * (1 + gstPct / 100));

    return res.json({
      product: {
        id: product.id,
        barcode: product.barcode,
        name: product.name,
        description: product.description,
        mrp,
        rate,
        discountPercent: product.discountPct,
        discountAmount: discountAmt,
        gstPercent: gstPct,
        netRate,
        value: netRate,
        unit: product.unit.name,
        hsnCode: product.hsnCode?.code || '1905',
        stock: product.inventory?.currentStock || 0,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Error looking up barcode' });
  }
});

// POST /api/v1/pos/invoice - Save Invoice / Sale Return inside DB transaction
router.post('/invoice', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      registerId,
      saleType,
      paymentMode,
      items,
      paidCash = 0,
      paidCard = 0,
      paidUPI = 0,
      customerPhone,
      customerName,
      isReturn = false,
    } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Invoice must contain at least one item' });
    }

    const register = await prisma.register.findUnique({ where: { id: registerId || 'reg-01' } });
    const regId = register ? register.id : (await prisma.register.findFirst())?.id;

    if (!regId) {
      return res.status(400).json({ error: 'Invalid POS register' });
    }

    // Calculate total quantity, total discount, and total bill amount
    let totalQty = 0;
    let totalDiscount = 0;
    let totalAmount = 0;

    for (const item of items) {
      totalQty += item.qty;
      totalDiscount += (item.discountAmount || 0) * item.qty;
      totalAmount += (item.netRate || item.rate) * item.qty;
    }

    const totalPaid = paidCash + paidCard + paidUPI;
    const changeDue = totalPaid > totalAmount ? totalPaid - totalAmount : 0;

    // Run inside database transaction for stock atomicity
    const result = await prisma.$transaction(async (tx: any) => {
      // Generate sequential invoice number: INV-YYYYMMDD-XXXX
      const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
      const countToday = await tx.sale.count();
      const invoiceNo = `INV-${dateStr}-${(countToday + 1).toString().padStart(4, '0')}`;

      // Create Sale Record
      const sale = await tx.sale.create({
        data: {
          invoiceNo,
          registerId: regId,
          saleType: (saleType as SaleType) || SaleType.RETAIL,
          cashierStaffId: req.user!.staffId,
          cashierName: req.user!.fullName,
          paymentMode: (paymentMode as PaymentMode) || PaymentMode.CASH,
          totalQty,
          totalDiscount,
          totalAmount,
          paidCash,
          paidCard,
          paidUPI,
          changeDue,
          customerPhone,
          customerName,
          status: isReturn ? 'RETURNED' : 'COMPLETED',
          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              qty: item.qty,
              mrp: item.mrp,
              rate: item.rate,
              discountPct: item.discountPercent || 0,
              discountAmt: item.discountAmount || 0,
              gstPct: item.gstPercent || 0,
              netRate: item.netRate || item.rate,
              totalValue: (item.netRate || item.rate) * item.qty,
            })),
          },
        },
        include: { items: { include: { product: true } } },
      });

      // Update Inventory & Record StockMovement
      for (const item of items) {
        const inventory = await tx.inventory.findUnique({ where: { productId: item.id } });
        if (inventory) {
          const qtyChange = isReturn ? item.qty : -item.qty;
          await tx.inventory.update({
            where: { id: inventory.id },
            data: { currentStock: { increment: qtyChange } },
          });

          await tx.stockMovement.create({
            data: {
              inventoryId: inventory.id,
              type: isReturn ? 'SALE_RETURN' : 'SALE',
              quantity: qtyChange,
              referenceId: sale.id,
              notes: `POS Invoice ${invoiceNo}`,
            },
          });
        }
      }

      // If customer phone exists, add loyalty points (1 point per ₹100 spent)
      if (customerPhone) {
        const pointsEarned = Math.floor(totalAmount / 10000); // 10000 paise = ₹100
        await tx.customer.upsert({
          where: { phone: customerPhone },
          update: {
            loyaltyPoints: { increment: pointsEarned },
            lastVisit: new Date(),
          },
          create: {
            phone: customerPhone,
            fullName: customerName || 'Valued Shopper',
            loyaltyPoints: pointsEarned,
          },
        });
      }

      return sale;
    });

    // Generate formatted thermal receipt string with embedded barcode string
    const formattedReceipt = `
========================================
             AFREEN MALL
     City Center, Sector 4, Main Hub
         GSTIN: 27AAAAA0000A1Z5
========================================
Invoice No : ${result.invoiceNo}
Date       : ${new Date(result.createdAt).toLocaleString()}
Cashier    : ${result.cashierName} (ID: ${result.cashierStaffId})
Type       : ${result.saleType}
----------------------------------------
${result.items
  .map(
    (i: any) =>
      `${i.product.name.slice(0, 20).padEnd(20)} x${i.qty}  ₹${(i.totalValue / 100).toFixed(2)}`
  )
  .join('\n')}
----------------------------------------
Total Qty  : ${result.totalQty} pcs
Total Disc : ₹${(result.totalDiscount / 100).toFixed(2)}
TOTAL BILL : ₹${(result.totalAmount / 100).toFixed(2)}
Paid Cash  : ₹${(result.paidCash / 100).toFixed(2)}
Paid Card  : ₹${(result.paidCard / 100).toFixed(2)}
Paid UPI   : ₹${(result.paidUPI / 100).toFixed(2)}
Change Due : ₹${(result.changeDue / 100).toFixed(2)}
========================================
[ BARCODE: *${result.invoiceNo}* ]
Software by Gous Khan · Mobile: 8625076618
gousk2004@gmail.com
========================================
    `;

    return res.status(201).json({
      invoice: result,
      receiptPrintContent: formattedReceipt,
      message: 'Invoice processed successfully',
    });
  } catch (err: any) {
    console.error('Invoice error:', err);
    return res.status(500).json({ error: 'Failed to save invoice' });
  }
});

// GET /api/v1/pos/invoices - Recent sales history
router.get('/invoices', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const sales = await prisma.sale.findMany({
      take: 20,
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } } },
    });
    return res.json({ sales });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch invoices' });
  }
});

// GET /api/v1/pos/next-invoice-number - Sequential invoice number for next sale
router.get('/next-invoice-number', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const count = await prisma.sale.count();
    const nextNum = (count + 1).toString().padStart(6, '0');
    return res.json({ invoice_number: `INV-${nextNum}` });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to generate invoice number' });
  }
});

// GET /api/v1/pos/last-invoice - Most recent completed sale for this cashier
router.get('/last-invoice', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const last = await prisma.sale.findFirst({
      where: { cashierStaffId: req.user!.staffId, status: 'COMPLETED' },
      orderBy: { createdAt: 'desc' },
      select: { invoiceNo: true, totalAmount: true },
    });
    if (!last) return res.json(null);
    return res.json({ invoice_number: last.invoiceNo, total_paise: last.totalAmount });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch last invoice' });
  }
});

export default router;

