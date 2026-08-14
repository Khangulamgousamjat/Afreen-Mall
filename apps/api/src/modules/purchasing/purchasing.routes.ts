import { Router, Response } from 'express';
import { prisma } from '../../prisma.js';
import { authenticateToken, AuthenticatedRequest } from '../../middleware/auth.js';
import { PurchaseOrderStatus } from '@afreen-mall/shared-types';

const router = Router();
router.use(authenticateToken);

// GET /api/v1/purchasing/orders - List POs
router.get('/orders', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const orders = await prisma.purchaseOrder.findMany({
      include: { supplier: true, lineItems: { include: { product: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.json({ orders });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch purchase orders' });
  }
});

// POST /api/v1/purchasing/orders - Create Purchase Order
router.post('/orders', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { supplierId, items } = req.body; // items: [{ productId, qty, unitCost }]

    if (!supplierId || !items || items.length === 0) {
      return res.status(400).json({ error: 'Supplier and line items are required' });
    }

    const count = await prisma.purchaseOrder.count();
    const poNumber = `PO-2026-${(count + 1).toString().padStart(4, '0')}`;

    let totalAmount = 0;
    for (const item of items) {
      totalAmount += item.qty * item.unitCost;
    }

    const po = await prisma.purchaseOrder.create({
      data: {
        poNumber,
        supplierId,
        status: PurchaseOrderStatus.APPROVED, // Auto approve for demo workflow
        totalAmount,
        lineItems: {
          create: items.map((i: any) => ({
            productId: i.productId,
            orderedQty: i.qty,
            unitCost: i.unitCost,
            totalCost: i.qty * i.unitCost,
          })),
        },
      },
      include: { supplier: true, lineItems: { include: { product: true } } },
    });

    return res.status(201).json({ po, message: 'Purchase Order created and approved' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to create purchase order' });
  }
});

// POST /api/v1/purchasing/grn - Receive Goods (GRN) & increment inventory
router.post('/grn', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { purchaseOrderId, notes } = req.body;

    const po = await prisma.purchaseOrder.findUnique({
      where: { id: purchaseOrderId },
      include: { lineItems: true },
    });

    if (!po) {
      return res.status(404).json({ error: 'Purchase Order not found' });
    }

    const countGRN = await prisma.gRN.count();
    const grnNumber = `GRN-2026-${(countGRN + 1).toString().padStart(4, '0')}`;

    const result = await prisma.$transaction(async (tx: any) => {
      const grn = await tx.gRN.create({
        data: {
          grnNumber,
          purchaseOrderId,
          receivedBy: req.user!.fullName,
          notes,
        },
      });

      // Update PO status to COMPLETED
      await tx.purchaseOrder.update({
        where: { id: purchaseOrderId },
        data: { status: PurchaseOrderStatus.COMPLETED },
      });

      // Increment inventory for each received item
      for (const item of po.lineItems) {
        const inv = await tx.inventory.findUnique({ where: { productId: item.productId } });
        if (inv) {
          await tx.inventory.update({
            where: { id: inv.id },
            data: { currentStock: { increment: item.orderedQty } },
          });

          await tx.stockMovement.create({
            data: {
              inventoryId: inv.id,
              type: 'PURCHASE_GRN',
              quantity: item.orderedQty,
              referenceId: grn.id,
              notes: `GRN ${grnNumber} received from supplier`,
            },
          });
        }
      }

      return grn;
    });

    return res.status(201).json({ grn: result, message: 'GRN processed and inventory updated.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to process GRN' });
  }
});

export default router;
