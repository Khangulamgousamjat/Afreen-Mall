import { Router, Response } from 'express';
import { prisma } from '../../index';
import { AuthenticatedRequest } from '../../middleware/auth.middleware';

const router = Router();

// GET /api/v1/customers - Search and list customer profiles
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const q = (req.query.q as string || '').trim();
    let where: any = {};

    if (q) {
      where = {
        OR: [
          { phone: { contains: q } },
          { fullName: { contains: q } },
          { email: { contains: q } },
        ],
      };
    }

    const customers = await prisma.customer.findMany({
      where,
      orderBy: { updatedAt: 'desc' },
      take: 20,
    });

    return res.json({ customers });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch customers' });
  }
});

// GET /api/v1/customers/:phone - Get customer profile by mobile number
router.get('/:phone', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const phone = req.params.phone.trim();
    const customer = await prisma.customer.findUnique({
      where: { phone },
    });

    if (!customer) {
      return res.status(404).json({ error: `Customer with phone ${phone} not found` });
    }

    // Fetch customer's total purchases & invoice count
    const sales = await prisma.sale.findMany({
      where: { customerPhone: phone, status: 'COMPLETED' },
      select: { totalAmount: true, createdAt: true },
    });

    const lifetimeSpend = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalVisits = sales.length;

    return res.json({
      customer: {
        ...customer,
        lifetimeSpend,
        totalVisits,
        availableCreditLimit: customer.tier === 'PLATINUM' ? 5000000 : customer.tier === 'GOLD' ? 2000000 : 500000, // in paise
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to fetch customer profile' });
  }
});

// POST /api/v1/customers - Register new customer profile
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { phone, fullName, email, tier } = req.body;

    if (!phone || !fullName) {
      return res.status(400).json({ error: 'Phone number and Full Name are required' });
    }

    const existing = await prisma.customer.findUnique({ where: { phone: phone.trim() } });
    if (existing) {
      return res.status(400).json({ error: `Customer with phone ${phone} is already registered.` });
    }

    const customer = await prisma.customer.create({
      data: {
        phone: phone.trim(),
        fullName: fullName.trim(),
        email: email ? email.trim() : null,
        tier: tier || 'SILVER',
        loyaltyPoints: 50, // Welcome bonus points
      },
    });

    return res.status(201).json({
      customer,
      message: `Customer ${fullName} registered successfully with 50 Welcome Loyalty Points!`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to register customer' });
  }
});

// POST /api/v1/customers/redeem-points - Redeem customer loyalty points
router.post('/redeem-points', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { phone, pointsToRedeem } = req.body;

    if (!phone || !pointsToRedeem || pointsToRedeem <= 0) {
      return res.status(400).json({ error: 'Phone number and valid points to redeem are required' });
    }

    const customer = await prisma.customer.findUnique({ where: { phone: phone.trim() } });
    if (!customer) {
      return res.status(404).json({ error: 'Customer profile not found' });
    }

    if (customer.loyaltyPoints < pointsToRedeem) {
      return res.status(400).json({
        error: `Insufficient points balance. Customer has ${customer.loyaltyPoints} points, but tried to redeem ${pointsToRedeem} points.`,
      });
    }

    // 1 Point = ₹0.10 (10 paise) discount -> 100 points = ₹10.00
    const discountAmountPaise = pointsToRedeem * 10;

    const updatedCustomer = await prisma.customer.update({
      where: { phone: phone.trim() },
      data: { loyaltyPoints: { decrement: pointsToRedeem } },
    });

    return res.json({
      customer: updatedCustomer,
      pointsRedeemed: pointsToRedeem,
      discountAmountPaise,
      message: `Successfully redeemed ${pointsToRedeem} points for ₹${(discountAmountPaise / 100).toFixed(2)} bill discount!`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to redeem loyalty points' });
  }
});

export default router;
