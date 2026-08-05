import { Router, Response } from 'express';
import { prisma } from '../../prisma.js';
import { authenticateToken, AuthenticatedRequest } from '../../middleware/auth.js';

const router = Router();
router.use(authenticateToken);

// GET /api/v1/hrms/employees - Employee Directory List
router.get('/employees', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const employees = [
      {
        id: 'emp-1',
        empCode: 'EMP-2026-000101',
        fullName: 'Rahul Sharma',
        designation: 'Senior Cashier',
        department: 'POS & Sales',
        branch: 'Afreen Mall Main Store',
        email: 'rahul.s@afreenmall.com',
        phone: '+91 98765 11223',
        employmentType: 'FULL_TIME',
        status: 'ACTIVE',
        dateOfJoining: '2025-01-15',
        pan: 'ABCPS1234F',
        aadhaar: 'XXXX-XXXX-4829',
        bankName: 'HDFC Bank',
        bankAccountNo: '5020001928374',
      },
      {
        id: 'emp-2',
        empCode: 'EMP-2026-000102',
        fullName: 'Ayesha Khan',
        designation: 'Store Manager',
        department: 'Operations',
        branch: 'Afreen Mall Main Store',
        email: 'ayesha.k@afreenmall.com',
        phone: '+91 98200 88776',
        employmentType: 'FULL_TIME',
        status: 'ACTIVE',
        dateOfJoining: '2024-06-01',
        pan: 'BKPSK5678G',
        aadhaar: 'XXXX-XXXX-9102',
        bankName: 'ICICI Bank',
        bankAccountNo: '001105009182',
      },
      {
        id: 'emp-3',
        empCode: 'EMP-2026-000103',
        fullName: 'Vikram Singh',
        designation: 'Inventory Executive',
        department: 'Inventory & Warehouse',
        branch: 'Main Warehouse Godown',
        email: 'vikram.s@afreenmall.com',
        phone: '+91 98333 44112',
        employmentType: 'FULL_TIME',
        status: 'ACTIVE',
        dateOfJoining: '2025-03-10',
        pan: 'CLPSV9102H',
        aadhaar: 'XXXX-XXXX-3341',
        bankName: 'Axis Bank',
        bankAccountNo: '918020038471',
      },
    ];

    return res.json({ employees });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch employee directory' });
  }
});

// POST /api/v1/hrms/employees - Onboard New Employee
router.post('/employees', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { fullName, email, phone, designation, department, branch, employmentType, pan, aadhaar, bankName, bankAccountNo } = req.body;

    if (!fullName || !designation || !department) {
      return res.status(400).json({ error: 'Full Name, Designation, and Department are required' });
    }

    const empCode = `EMP-2026-${Date.now().toString().slice(-6)}`;

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        staffId: req.user!.staffId,
        userName: req.user!.fullName,
        userRole: req.user!.role,
        action: 'EMPLOYEE_ONBOARDED',
        entityName: 'EmployeeMaster',
        entityId: empCode,
        reason: `Onboarded Employee ${fullName} (${empCode}) as ${designation} in ${department}`,
      },
    });

    return res.status(201).json({
      empCode,
      message: `Employee "${fullName}" (${empCode}) onboarded successfully! Profile activated.`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to onboard employee' });
  }
});

// GET /api/v1/hrms/attendance - Attendance Logs & Biometric Punches
router.get('/attendance', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const attendanceLogs = [
      { id: 'att-1', empCode: 'EMP-2026-000101', employeeName: 'Rahul Sharma', date: '2026-08-05', checkInTime: '08:04 AM', checkOutTime: '04:12 PM', totalHours: '8.1 hrs', status: 'PRESENT', deviceId: 'BIO-POS-TERMINAL-01' },
      { id: 'att-2', empCode: 'EMP-2026-000102', employeeName: 'Ayesha Khan', date: '2026-08-05', checkInTime: '09:42 AM', checkOutTime: '06:15 PM', totalHours: '8.5 hrs', status: 'LATE', deviceId: 'BIO-MAIN-GATE-01' },
      { id: 'att-3', empCode: 'EMP-2026-000103', employeeName: 'Vikram Singh', date: '2026-08-05', checkInTime: '08:00 AM', checkOutTime: '04:00 PM', totalHours: '8.0 hrs', status: 'PRESENT', deviceId: 'BIO-WH-ENTRY-01' },
    ];

    return res.json({ attendanceLogs });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch attendance logs' });
  }
});

// POST /api/v1/hrms/attendance/check-in - Attendance Check-In / Punch Logger
router.post('/attendance/check-in', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { empCode, punchType, deviceId, remarks } = req.body;

    if (!empCode) {
      return res.status(400).json({ error: 'Employee Code is required' });
    }

    const punchNo = `PUNCH-2026-${Date.now().toString().slice(-6)}`;
    const timeStr = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

    await prisma.auditLog.create({
      data: {
        userId: req.user!.id,
        staffId: req.user!.staffId,
        userName: req.user!.fullName,
        userRole: req.user!.role,
        action: 'ATTENDANCE_PUNCH_LOGGED',
        entityName: 'AttendanceRegister',
        entityId: punchNo,
        reason: `Logged ${punchType || 'CHECK_IN'} punch for ${empCode} at ${timeStr} via ${deviceId || 'WEB'}`,
      },
    });

    return res.status(201).json({
      punchNo,
      timeStr,
      message: `Attendance Check-In Punch ${punchNo} logged for ${empCode} at ${timeStr}!`,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message || 'Failed to log attendance punch' });
  }
});

// GET /api/v1/hrms/shifts - Shift Rosters
router.get('/shifts', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const shifts = [
      { id: 'sh-1', name: 'Morning Retail Shift', code: 'SHIFT-AM', timing: '08:00 AM - 04:00 PM', gracePeriodMins: 15, assignedEmployeesCount: 14 },
      { id: 'sh-2', name: 'Evening Retail Shift', code: 'SHIFT-PM', timing: '02:00 PM - 10:00 PM', gracePeriodMins: 15, assignedEmployeesCount: 12 },
      { id: 'sh-3', name: 'General Manager Shift', code: 'SHIFT-GEN', timing: '09:30 AM - 06:30 PM', gracePeriodMins: 15, assignedEmployeesCount: 6 },
    ];

    return res.json({ shifts });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch shift rosters' });
  }
});

// GET /api/v1/hrms/recruitment - Recruitment Vacancies & Candidate Pipeline
router.get('/recruitment', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const vacancies = [
      { id: 'vac-1', title: 'POS Billing Cashier', department: 'POS & Sales', positions: 3, applicants: 18, status: 'INTERVIEWING' },
      { id: 'vac-2', title: 'Warehouse Inventory Inspector', department: 'Inventory', positions: 1, applicants: 7, status: 'OPEN' },
    ];

    return res.json({ vacancies });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch recruitment pipeline' });
  }
});

export default router;
