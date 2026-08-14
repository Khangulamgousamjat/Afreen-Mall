import { Router, Response } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../../prisma.js';
import { authenticateToken, requireSuperAdmin, AuthenticatedRequest } from '../../middleware/auth.js';
import { RoleName } from '@afreen-mall/shared-types';

const router = Router();

// Apply Super Admin requirement to ALL routes in this file
router.use(authenticateToken, requireSuperAdmin);

// GET /api/v1/users - List all staff (passwords never returned!)
router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = await prisma.user.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        staffId: true,
        username: true,
        fullName: true,
        role: true,
        mustChangePassword: true,
        isLocked: true,
        failedAttempts: true,
        createdAt: true,
      },
      orderBy: { staffId: 'asc' },
    });

    return res.json({ users });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// POST /api/v1/users - Create new staff account (Auto-increments Staff ID starting 300000)
router.post('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { username, fullName, role } = req.body;

    if (!username || !fullName || !role) {
      return res.status(400).json({ error: 'Username, Full Name, and Role are required' });
    }

    if (!Object.values(RoleName).includes(role)) {
      return res.status(400).json({ error: `Invalid role name: ${role}` });
    }

    // Check duplicate username
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: `Username '${username}' is already taken.` });
    }

    // Find highest staff ID to compute next 6-digit Staff ID starting at 300000
    const highestUser = await prisma.user.findFirst({
      orderBy: { staffId: 'desc' },
      select: { staffId: true },
    });

    const nextStaffId = highestUser ? Math.max(highestUser.staffId + 1, 300000) : 300000;
    const temporaryPassword = 'Pass@123';
    const passwordHash = await bcrypt.hash(temporaryPassword, 12);

    const newUser = await prisma.user.create({
      data: {
        staffId: nextStaffId,
        username,
        fullName,
        passwordHash,
        role: role as RoleName,
        mustChangePassword: true,
      },
      select: {
        id: true,
        staffId: true,
        username: true,
        fullName: true,
        role: true,
        mustChangePassword: true,
        createdAt: true,
      },
    });

    // Audit log entry
    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        staffId: req.user!.staffId,
        userName: req.user!.fullName,
        userRole: req.user!.role,
        action: 'CREATE_STAFF_USER',
        entityName: 'User',
        entityId: newUser.id,
        afterValue: { staffId: newUser.staffId, username: newUser.username, role: newUser.role },
        reason: 'New staff account created by Super Admin.',
      },
    });

    // ONE-TIME REVEAL OF TEMPORARY PASSWORD in creation response payload
    return res.status(201).json({
      user: newUser,
      oneTimeTemporaryPassword: temporaryPassword,
      message: 'Staff account created successfully. Temporary password is valid for first login only.',
    });
  } catch (err: any) {
    console.error('Error creating staff user:', err);
    return res.status(500).json({ error: 'Failed to create staff account' });
  }
});

// PATCH /api/v1/users/:id/role - Update staff role
router.patch('/:id/role', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !Object.values(RoleName).includes(role)) {
      return res.status(400).json({ error: 'Valid role is required' });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return res.status(404).json({ error: 'Staff user not found' });
    }

    // Prevent revoking Super Admin role from main account
    if (targetUser.staffId === 300000 && role !== RoleName.SUPER_ADMIN) {
      return res.status(400).json({ error: 'Root Super Admin role cannot be modified or revoked.' });
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role: role as RoleName },
      select: { id: true, staffId: true, username: true, fullName: true, role: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        staffId: req.user!.staffId,
        userName: req.user!.fullName,
        userRole: req.user!.role,
        action: 'UPDATE_ROLE',
        entityName: 'User',
        entityId: targetUser.id,
        beforeValue: { role: targetUser.role },
        afterValue: { role: updatedUser.role },
        reason: `Role changed from ${targetUser.role} to ${updatedUser.role} by Super Admin.`,
      },
    });

    return res.json({ user: updatedUser, message: 'Role updated successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update role' });
  }
});

// POST /api/v1/users/:id/unlock - Unlock locked staff account
router.post('/:id/unlock', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.update({
      where: { id },
      data: {
        isLocked: false,
        failedAttempts: 0,
        lockoutUntil: null,
      },
      select: { id: true, staffId: true, username: true, isLocked: true },
    });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        staffId: req.user!.staffId,
        userName: req.user!.fullName,
        userRole: req.user!.role,
        action: 'UNLOCK_USER',
        entityName: 'User',
        entityId: user.id,
        reason: 'Account unlocked by Super Admin.',
      },
    });

    return res.json({ user, message: 'Account unlocked successfully.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to unlock user' });
  }
});

export default router;
