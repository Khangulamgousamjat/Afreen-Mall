import { Router, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../prisma.js';
import { authenticateToken, AuthenticatedRequest } from '../../middleware/auth.js';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'afreen_mall_super_secure_jwt_secret_key_2026';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'afreen_mall_refresh_secret_key_2026';

// Public Staff Directory listing (for Login Screen directory search)
router.get('/directory', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { deletedAt: null, isDeactivated: false },
      select: {
        staffId: true,
        username: true,
        fullName: true,
        role: true,
      },
      orderBy: { staffId: 'asc' },
    });
    return res.json({ users });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch directory' });
  }
});

// Staff Login: Accepts 6-digit Staff ID (or username) + password
router.post('/login', async (req, res) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({ error: 'Staff ID / Username and Password are required' });
    }

    const cleanIdentifier = String(identifier).trim();
    const cleanPassword = String(password).trim();

    // SQL Injection vector check on auth payloads
    const sqliRegex = /('|"|--|\/\*|\*\/|;|\bOR\b|\bUNION\b|\bSELECT\b)/i;
    if (sqliRegex.test(cleanIdentifier) || sqliRegex.test(cleanPassword)) {
      return res.status(403).json({
        error: 'Security Threat Intercepted: SQL Injection payload detected. Authentication attempt blocked.',
        blocked: true,
      });
    }

    // Try finding user by numeric staffId or string username
    const numericStaffId = parseInt(cleanIdentifier, 10);
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          ...(isNaN(numericStaffId) ? [] : [{ staffId: numericStaffId }]),
          { username: cleanIdentifier },
        ],
      },
    });

    if (!user) {
      await prisma.loginHistory.create({
        data: {
          username: cleanIdentifier,
          success: false,
          ipAddress: req.ip || '127.0.0.1',
          userAgent: req.get('user-agent'),
        },
      });
      return res.status(401).json({ error: 'Invalid Staff ID or Password' });
    }

    // Check 7-Day Inactivity Auto-Deactivation
    const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
    const isInactiveOver7Days = user.lastLoginAt && (Date.now() - new Date(user.lastLoginAt).getTime() > SEVEN_DAYS_MS);

    if (user.isDeactivated || isInactiveOver7Days) {
      if (!user.isDeactivated && isInactiveOver7Days) {
        await prisma.user.update({
          where: { id: user.id },
          data: { isDeactivated: true },
        });
      }
      return res.status(403).json({
        error: 'Account Deactivated: Inactive for more than 7 days. Please contact Manager or Super Admin to reactivate.',
        isDeactivated: true,
      });
    }

    // Check account lockout
    if (user.isLocked) {
      if (user.lockoutUntil && user.lockoutUntil > new Date()) {
        return res.status(423).json({
          error: `Account is locked due to repeated failed login attempts. Please try again after ${user.lockoutUntil.toLocaleTimeString()} or contact Super Admin.`,
        });
      } else {
        // Unlock after expiry
        await prisma.user.update({
          where: { id: user.id },
          data: { isLocked: false, failedAttempts: 0, lockoutUntil: null },
        });
      }
    }

    // Password check
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      const newFailedAttempts = user.failedAttempts + 1;
      const shouldLock = newFailedAttempts >= 5;
      const lockoutUntil = shouldLock ? new Date(Date.now() + 15 * 60 * 1000) : null; // 15 min lock

      await prisma.user.update({
        where: { id: user.id },
        data: {
          failedAttempts: newFailedAttempts,
          isLocked: shouldLock,
          lockoutUntil: lockoutUntil,
        },
      });

      await prisma.loginHistory.create({
        data: {
          userId: user.id,
          staffId: user.staffId,
          username: user.username,
          success: false,
          ipAddress: req.ip || '127.0.0.1',
          userAgent: req.get('user-agent'),
        },
      });

      if (shouldLock) {
        return res.status(423).json({
          error: 'Account locked due to 5 consecutive failed attempts. Contact Super Admin or wait 15 minutes.',
        });
      }

      return res.status(401).json({
        error: `Invalid password. ${5 - newFailedAttempts} attempt(s) remaining before lockout.`,
      });
    }

    // Successful login: reset failed attempts
    await prisma.user.update({
      where: { id: user.id },
      data: { failedAttempts: 0, isLocked: false, lockoutUntil: null },
    });

    await prisma.loginHistory.create({
      data: {
        userId: user.id,
        staffId: user.staffId,
        username: user.username,
        success: true,
        ipAddress: req.ip || '127.0.0.1',
        userAgent: req.get('user-agent'),
      },
    });

    const payload = {
      id: user.id,
      staffId: user.staffId,
      username: user.username,
      fullName: user.fullName,
      role: user.role,
      mustChangePassword: user.mustChangePassword,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });
    const refreshToken = jwt.sign({ id: user.id }, JWT_REFRESH_SECRET, { expiresIn: '7d' });

    // Store session
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        refreshToken,
        expiresAt: new Date(Date.now() + 12 * 3600 * 1000),
      },
    });

    return res.json({
      token,
      refreshToken,
      user: payload,
    });
  } catch (err: any) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Internal server error during login' });
  }
});

// Force / Change Password
router.post('/change-password', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters long' });
    }

    const userId = req.user!.id;
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // If current password provided, verify it
    if (currentPassword) {
      const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
      if (!isValid) {
        return res.status(400).json({ error: 'Current password is incorrect' });
      }
    }

    const newPasswordHash = await bcrypt.hash(newPassword, 12);

    await prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash: newPasswordHash,
        mustChangePassword: false,
      },
    });

    // Invalidate all active sessions for this user on password change
    await prisma.session.deleteMany({
      where: { userId },
    });

    // Log audit event
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        staffId: user.staffId,
        userName: user.fullName,
        userRole: user.role,
        action: 'CHANGE_PASSWORD',
        entityName: 'User',
        entityId: user.id,
        reason: 'Password updated by staff member. Active sessions invalidated.',
      },
    });

    return res.json({ message: 'Password updated successfully. Please log in again.' });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to update password' });
  }
});

// Get current session
router.get('/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  return res.json({ user: req.user });
});

export default router;
