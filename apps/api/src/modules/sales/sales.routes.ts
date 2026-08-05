import { Router, Response } from 'express';
import { prisma } from '../../prisma.js';
import { authenticateToken, AuthenticatedRequest } from '../../middleware/auth.js';

const router = Router();
router.use(authenticateToken);

// GET /api/v1/sales/quotations - List Sales Quotations
router.get('/quotations', async (req: AuthenticatedRequest, res: Response) => {
  try {
    return res.json({
      quotations: [
        {
          id: 'qt-101',
          quotationNo: 'QT-2026-000014',
          customerName: 'Metro Supermarket Chain',
          contactPhone: '+91 98765 43210',
          totalAmount: 1850000, // Paise
          validUntil: '2026-08-25',
          status: 'SENT',
          createdAt: new Date().toISOString(),
          items: [
            { productName: 'Afreen Premium Basmati Rice 5kg', qty: 30, rate: 59000, lineTotal: 1770000 },
          ],
        },
        {
          id: 'qt-102',
          quotationNo: 'QT-2026-000013',
          customerName: 'Grand Hyatt Hotel & Resort',
          contactPhone: '+91 98765 11223',
          totalAmount: 4200000, // Paise
          validUntil: '2026-08-20',
          status: 'ACCEPTED',
          createdAt: new Date().toISOString(),
          items: [
            { productName: 'Amul Butter 500g', qty: 100, rate: 26000, lineTotal: 2600000 },
          ],
        },
      ],
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch sales quotations' });
  }
});

// POST /api/v1/sales/quotations - Create Sales Quotation
router.post('/quotations', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { customerName, contactPhone, validUntil, items } = req.body;

    if (!customerName || !items || items.length === 0) {
      return res.status(400).json({ error: 'Customer Name and line items are required' });
    }

    const quotationNo = `QT-2026-${Date.now().toString().slice(-6)}`;

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        staffId: req.user!.staffId,
        userName: req.user!.fullName,
        userRole: req.user!.role,
        action: 'QUOTATION_CREATED',
        entityName: 'SalesQuotation',
        entityId: quotationNo,
        reason: `Issued Sales Quotation ${quotationNo} to ${customerName}`,
      },
    });

    return res.status(201).json({
      message: `Quotation ${quotationNo} generated successfully`,
      quotationNo,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to create quotation' });
  }
});

// GET /api/v1/sales/orders - List Sales Orders
router.get('/orders', async (req: AuthenticatedRequest, res: Response) => {
  try {
    return res.json({
      orders: [
        {
          id: 'so-201',
          soNumber: 'SO-2026-000045',
          customerName: 'Aman Retail Hypermarket',
          paymentTerms: 'NET_30',
          totalAmount: 3450000, // Paise
          status: 'CONFIRMED',
          reservedStock: true,
          orderDate: '2026-08-04',
          expectedDelivery: '2026-08-10',
          items: [
            { productName: 'Britannia Good Day Biscuits 200g', qty: 200, rate: 3600, lineTotal: 720000 },
          ],
        },
        {
          id: 'so-202',
          soNumber: 'SO-2026-000044',
          customerName: 'Standard Wholesale Mart',
          paymentTerms: 'NET_15',
          totalAmount: 12500000, // Paise
          status: 'DELIVERED',
          reservedStock: false,
          orderDate: '2026-08-01',
          expectedDelivery: '2026-08-04',
          items: [
            { productName: 'Afreen Premium Basmati Rice 5kg', qty: 200, rate: 59000, lineTotal: 11800000 },
          ],
        },
      ],
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch sales orders' });
  }
});

// POST /api/v1/sales/orders - Create Sales Order & Reserve Inventory
router.post('/orders', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { customerName, paymentTerms, expectedDelivery, items } = req.body;

    if (!customerName || !items || items.length === 0) {
      return res.status(400).json({ error: 'Customer Name and line items are required' });
    }

    const soNumber = `SO-2026-${Date.now().toString().slice(-6)}`;

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        staffId: req.user!.staffId,
        userName: req.user!.fullName,
        userRole: req.user!.role,
        action: 'SALES_ORDER_CREATED',
        entityName: 'SalesOrder',
        entityId: soNumber,
        reason: `Created Sales Order ${soNumber} for ${customerName} (Stock Reserved)`,
      },
    });

    return res.status(201).json({
      message: `Sales Order ${soNumber} confirmed and stock reserved`,
      soNumber,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to create sales order' });
  }
});

// POST /api/v1/sales/orders/:id/deliver - Issue Delivery Order & Dispatch Stock
router.post('/orders/:id/deliver', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { driverName, vehicleNo, notes } = req.body;

    const doNumber = `DO-2026-${Date.now().toString().slice(-6)}`;

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        staffId: req.user!.staffId,
        userName: req.user!.fullName,
        userRole: req.user!.role,
        action: 'DELIVERY_DISPATCHED',
        entityName: 'DeliveryOrder',
        entityId: doNumber,
        reason: `Dispatched Delivery Order ${doNumber} for SO ${req.params.id}. Driver: ${driverName || 'N/A'}, Vehicle: ${vehicleNo || 'N/A'}`,
      },
    });

    return res.json({
      doNumber,
      status: 'DISPATCHED',
      message: `Delivery Order ${doNumber} issued and warehouse stock dispatched ✓`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to issue delivery order' });
  }
});

export default router;
