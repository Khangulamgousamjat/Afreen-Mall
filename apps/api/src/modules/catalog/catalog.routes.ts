import { Router, Response } from 'express';
import { prisma } from '../../prisma.js';
import { authenticateToken, AuthenticatedRequest } from '../../middleware/auth.js';

const router = Router();
router.use(authenticateToken);

// GET /api/v1/catalog/products - List products
router.get('/products', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const products = await prisma.product.findMany({
      where: { deletedAt: null },
      include: {
        category: true,
        unit: true,
        taxRate: true,
        hsnCode: true,
        inventory: true,
      },
      orderBy: { name: 'asc' },
    });
    return res.json({ products });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch catalog' });
  }
});

// GET /api/v1/catalog/categories - List categories
router.get('/categories', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: { name: 'asc' },
    });
    return res.json({ categories });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch categories' });
  }
});

export default router;
