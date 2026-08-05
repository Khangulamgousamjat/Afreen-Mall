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

// GET /api/v1/purchasing/suppliers - List active suppliers
router.get('/suppliers', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: 'asc' },
    });
    return res.json({ suppliers });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

// GET /api/v1/purchasing/requisitions - List Purchase Requisitions
router.get('/requisitions', async (req: AuthenticatedRequest, res: Response) => {
  try {
    return res.json({
      requisitions: [
        {
          id: 'pr-101',
          prNumber: 'PR-2026-000012',
          requestedBy: req.user!.fullName,
          department: 'Grocery & Staples',
          priority: 'HIGH',
          requiredDate: '2026-08-12',
          status: 'PENDING_APPROVAL',
          totalEstimatedCost: 1450000, // Paise
          justification: 'Replenishing Basmati Rice 5kg due to high weekend customer demand',
          createdAt: new Date().toISOString(),
          items: [
            { productId: 'prod-1', productName: 'Afreen Premium Basmati Rice 5kg', barcode: '890103000001', currentStock: 80, requestedQty: 50, estimatedCost: 1450000 },
          ],
        },
        {
          id: 'pr-102',
          prNumber: 'PR-2026-000011',
          requestedBy: 'Store Manager',
          department: 'Snacks & Beverages',
          priority: 'URGENT',
          requiredDate: '2026-08-10',
          status: 'APPROVED',
          totalEstimatedCost: 650000, // Paise
          justification: 'Cold Beverage stocks depleted ahead of festival sale',
          createdAt: new Date().toISOString(),
          items: [
            { productId: 'prod-3', productName: 'Coca Cola Soft Drink 1.25L', barcode: '890103000003', currentStock: 45, requestedQty: 100, estimatedCost: 650000 },
          ],
        },
      ],
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch purchase requisitions' });
  }
});

// POST /api/v1/purchasing/requisitions - Create Purchase Requisition
router.post('/requisitions', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { department, priority, requiredDate, justification, items } = req.body;

    if (!department || !priority || !items || items.length === 0) {
      return res.status(400).json({ error: 'Department, priority, and requisition items are required' });
    }

    const prNumber = `PR-2026-${Date.now().toString().slice(-6)}`;

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        staffId: req.user!.staffId,
        userName: req.user!.fullName,
        userRole: req.user!.role,
        action: 'PURCHASE_REQUISITION_CREATED',
        entityName: 'PurchaseRequisition',
        entityId: prNumber,
        reason: `Created Requisition ${prNumber} with priority ${priority} for ${department}`,
      },
    });

    return res.status(201).json({
      message: `Purchase Requisition ${prNumber} submitted for manager approval`,
      prNumber,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to create requisition' });
  }
});

// POST /api/v1/purchasing/requisitions/:id/approve - Approve or Reject PR
router.post('/requisitions/:id/approve', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { action, notes } = req.body; // action: 'APPROVE' | 'REJECT'

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        staffId: req.user!.staffId,
        userName: req.user!.fullName,
        userRole: req.user!.role,
        action: action === 'APPROVE' ? 'PR_APPROVED' : 'PR_REJECTED',
        entityName: 'PurchaseRequisition',
        entityId: req.params.id,
        reason: `Requisition ${req.params.id} ${action}d by ${req.user!.fullName}. Notes: ${notes || 'None'}`,
      },
    });

    return res.json({ message: `Purchase Requisition ${req.params.id} ${action.toLowerCase()}d successfully.` });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to process requisition approval' });
  }
});

export default router;
