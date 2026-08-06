import { Request, Response, NextFunction } from 'express';

/**
 * Enterprise SQL Injection Audit & Defense Middleware
 * Primary Security Layer: Prisma ORM Query Parameterization ($1, $2, $3).
 * Secondary Security Layer: Threat detection logging for destructive SQL command injection sequences.
 */

// Destructive command injection sequences (e.g. ; DROP TABLE, UNION SELECT NULL)
const DESTRUCTIVE_SQLI_PATTERNS = [
  /;\s*(DROP|ALTER|TRUNCATE|DELETE\s+FROM)\b/i,
  /\bUNION\s+ALL\s+SELECT\b/i,
  /\bUNION\s+SELECT\b/i,
  /\bEXEC(\s+|\()sp_/i,
];

function containsDestructiveSqli(val: any): boolean {
  if (typeof val === 'string') {
    for (const pattern of DESTRUCTIVE_SQLI_PATTERNS) {
      if (pattern.test(val)) {
        return true;
      }
    }
  } else if (typeof val === 'object' && val !== null) {
    for (const key of Object.keys(val)) {
      if (containsDestructiveSqli(key) || containsDestructiveSqli(val[key])) {
        return true;
      }
    }
  }
  return false;
}

export const sqlInjectionGuard = (req: Request, res: Response, next: NextFunction) => {
  try {
    const isMaliciousBody = req.body && containsDestructiveSqli(req.body);
    const isMaliciousQuery = req.query && containsDestructiveSqli(req.query);
    const isMaliciousParams = req.params && containsDestructiveSqli(req.params);

    if (isMaliciousBody || isMaliciousQuery || isMaliciousParams) {
      console.warn(`[SECURITY FIREWALL ALERT] Destructive SQL Injection attempt intercepted from IP: ${req.ip} path: ${req.originalUrl}`);
      return res.status(403).json({
        error: 'Security Threat Intercepted: Malicious SQL Command sequence detected. Security incident logged.',
        blocked: true,
      });
    }

    next();
  } catch {
    next();
  }
};
