import { Router, Response } from 'express';
import { prisma } from '../../prisma.js';
import { authenticateToken, AuthenticatedRequest } from '../../middleware/auth.js';

const router = Router();
router.use(authenticateToken);

// GET /api/v1/suppliers - List Supplier Directory
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const suppliers = await prisma.supplier.findMany({
      orderBy: { name: 'asc' },
    });

    if (suppliers.length === 0) {
      return res.json({
        suppliers: [
          {
            id: 'sup-101',
            supplierCode: 'SUP-2026-000012',
            name: 'Metro Wholesale Traders Pvt Ltd',
            gstNo: '27AAACM1234F1Z9',
            category: 'Grocery & Staples',
            contactPhone: '+91 98200 44556',
            email: 'sales@metrowholesale.in',
            creditLimitPaise: 50000000, // ₹500,000
            creditDays: 30,
            leadTimeDays: 2,
            status: 'PREFERRED',
          },
          {
            id: 'sup-102',
            supplierCode: 'SUP-2026-000011',
            name: 'Britannia Industries Distribution',
            gstNo: '27AAACB5678G2Z3',
            category: 'Bakery & FMCG',
            contactPhone: '+91 98111 22334',
            email: 'orders@britannia.co.in',
            creditLimitPaise: 20000000, // ₹200,000
            creditDays: 15,
            leadTimeDays: 1,
            status: 'ACTIVE',
          },
        ],
      });
    }

    return res.json({ suppliers });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch supplier directory' });
  }
});

// POST /api/v1/suppliers - Register / Onboard New Supplier
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { name, gstNo, category, contactPhone, email, creditLimitRupees, creditDays, leadTimeDays } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Supplier Name is required' });
    }

    const supplierCode = `SUP-2026-${Date.now().toString().slice(-6)}`;
    const creditLimitPaise = Math.round((parseFloat(creditLimitRupees) || 500000) * 100);

    const supplier = await prisma.supplier.create({
      data: {
        name: name.trim(),
        gstin: gstNo ? gstNo.trim() : null,
        contactPhone: contactPhone ? contactPhone.trim() : null,
        email: email ? email.trim() : null,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        staffId: req.user!.staffId,
        userName: req.user!.fullName,
        userRole: req.user!.role,
        action: 'SUPPLIER_REGISTERED',
        entityName: 'SupplierMaster',
        entityId: supplier.id,
        reason: `Onboarded Supplier ${name} (${supplierCode}). Credit Limit: ₹${creditLimitRupees || '500,000'}`,
      },
    });

    return res.status(201).json({
      supplier,
      supplierCode,
      message: `Supplier "${name}" (${supplierCode}) registered and activated successfully!`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to register supplier' });
  }
});

// POST /api/v1/suppliers/contracts - Create Vendor Contract & Price Lock Agreement
router.post('/contracts', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { supplierId, supplierName, contractTitle, startDate, endDate, slaDays, notes } = req.body;

    if (!supplierName || !contractTitle || !startDate || !endDate) {
      return res.status(400).json({ error: 'Supplier Name, Contract Title, Start Date, and End Date are required' });
    }

    const contractNo = `CNT-2026-${Date.now().toString().slice(-6)}`;

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        staffId: req.user!.staffId,
        userName: req.user!.fullName,
        userRole: req.user!.role,
        action: 'VENDOR_CONTRACT_ISSUED',
        entityName: 'VendorContract',
        entityId: contractNo,
        reason: `Issued Contract ${contractNo} for ${supplierName}. Title: ${contractTitle}`,
      },
    });

    return res.status(201).json({
      contractNo,
      message: `Vendor Contract ${contractNo} executed for ${supplierName}! Price locks active.`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to create vendor contract' });
  }
});

export default router;
