import { Router, Response } from 'express';
import { prisma } from '../../prisma.js';
import { authenticateToken, AuthenticatedRequest } from '../../middleware/auth.js';

const router = Router();
router.use(authenticateToken);

// GET /api/v1/customers - Search customer loyalty record by phone or name
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { phone } = req.query;

    if (phone) {
      const customer = await prisma.customer.findUnique({
        where: { phone: String(phone) },
      });
      return res.json({ customer });
    }

    const customers = await prisma.customer.findMany({
      orderBy: { updatedAt: 'desc' },
      take: 50,
    });
    return res.json({ customers });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch customer loyalty records' });
  }
});

export default router;
