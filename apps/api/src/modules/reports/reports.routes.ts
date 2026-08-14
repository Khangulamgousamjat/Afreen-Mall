import { Router, Response } from 'express';
import { prisma } from '../../prisma.js';
import { authenticateToken, AuthenticatedRequest } from '../../middleware/auth.js';

const router = Router();
router.use(authenticateToken);

// GET /api/v1/reports/dashboard - Key performance metrics for Dashboard
router.get('/dashboard', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const todayStr = new Date().toISOString().slice(0, 10);

    const todaySales = await prisma.sale.aggregate({
      where: {
        createdAt: { gte: new Date(`${todayStr}T00:00:00.000Z`) },
        status: 'COMPLETED',
      },
      _sum: { totalAmount: true },
      _count: { id: true },
    });

    const lowStockCount = await prisma.inventory.count({
      where: { currentStock: { lte: 25 } },
    });

    const pendingCashReports = await prisma.managerCashReport.count({
      where: { accountantApproved: false },
    });

    return res.json({
      todayRevenue: todaySales._sum.totalAmount || 0, // paise
      todayTransactionCount: todaySales._count.id || 0,
      lowStockCount,
      pendingCashReports,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to generate dashboard metrics' });
  }
});

// GET /api/v1/reports/gst - GST Summary report
router.get('/gst', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const sales = await prisma.sale.findMany({
      where: { status: 'COMPLETED' },
      include: { items: true },
    });

    let totalTaxableValue = 0;
    let totalCGST = 0;
    let totalSGST = 0;

    for (const s of sales) {
      for (const item of s.items) {
        const itemTaxable = item.netRate * item.qty;
        totalTaxableValue += itemTaxable;
        const taxAmt = Math.round(itemTaxable * (item.gstPct / 100));
        totalCGST += Math.round(taxAmt / 2);
        totalSGST += Math.round(taxAmt / 2);
      }
    }

    return res.json({
      totalTaxableValue,
      totalCGST,
      totalSGST,
      totalGST: totalCGST + totalSGST,
    });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to generate GST report' });
  }
});

// GET /api/v1/reports/audit - Audit logs
router.get('/audit', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
    return res.json({ logs });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch audit logs' });
  }
});

export default router;
