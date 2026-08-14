import { Router, Response } from 'express';
import { prisma } from '../../prisma.js';
import { authenticateToken, AuthenticatedRequest } from '../../middleware/auth.js';

const router = Router();
router.use(authenticateToken);

// GET /api/v1/inventory - Stock levels with shelf-tag percentages
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const items = await prisma.inventory.findMany({
      include: {
        product: {
          include: { category: true, unit: true },
        },
      },
      orderBy: { product: { name: 'asc' } },
    });

    const formatted = items.map((item: any) => {
      const minStock = item.product.minStockLevel || 10;
      const stockRatio = (item.currentStock / minStock) * 100;
      let gaugeColor = 'green';
      if (stockRatio < 50) gaugeColor = 'red';
      else if (stockRatio < 100) gaugeColor = 'amber';

      return {
        id: item.id,
        productId: item.productId,
        barcode: item.product.barcode,
        name: item.product.name,
        category: item.product.category.name,
        unit: item.product.unit.name,
        currentStock: item.currentStock,
        minStockLevel: minStock,
        stockRatioPercentage: Math.round(stockRatio),
        gaugeColor,
        mrp: item.product.mrp,
        saleRate: item.product.saleRate,
      };
    });

    return res.json({ inventory: formatted });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch inventory' });
  }
});

// POST /api/v1/inventory/adjust - Stock Adjustment with Audit Logging
router.post('/adjust', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { inventoryId, newStock, reason } = req.body;

    if (!inventoryId || newStock === undefined || !reason) {
      return res.status(400).json({ error: 'Inventory ID, new stock level, and reason are required' });
    }

    const inventory = await prisma.inventory.findUnique({
      where: { id: inventoryId },
      include: { product: true },
    });

    if (!inventory) {
      return res.status(404).json({ error: 'Inventory record not found' });
    }

    const difference = newStock - inventory.currentStock;

    const result = await prisma.$transaction(async (tx: any) => {
      const updated = await tx.inventory.update({
        where: { id: inventoryId },
        data: { currentStock: newStock },
      });

      await tx.stockAdjustment.create({
        data: {
          inventoryId,
          oldStock: inventory.currentStock,
          newStock,
          difference,
          reason,
          performedBy: req.user!.fullName,
        },
      });

      await tx.stockMovement.create({
        data: {
          inventoryId,
          type: 'ADJUSTMENT',
          quantity: difference,
          notes: `Stock adjusted by ${req.user!.fullName}: ${reason}`,
        },
      });

      await tx.auditLog.create({
        data: {
          userId: req.user!.id,
          staffId: req.user!.staffId,
          userName: req.user!.fullName,
          userRole: req.user!.role,
          action: 'STOCK_ADJUSTMENT',
          entityName: 'Inventory',
          entityId: inventoryId,
          beforeValue: { stock: inventory.currentStock },
          afterValue: { stock: newStock },
          reason,
        },
      });

      return updated;
    });

    return res.json({ inventory: result, message: 'Stock level updated successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to adjust stock level' });
  }
});

export default router;
