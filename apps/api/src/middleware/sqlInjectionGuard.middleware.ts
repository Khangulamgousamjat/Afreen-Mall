import { Request, Response, NextFunction } from 'express';

/**
 * Military & Bank-Grade SQL Injection (SQLi) Defense Middleware
 * Inspects all incoming request bodies, queries, and route parameters for SQL injection vectors.
 * Immediately rejects malicious attack vectors with HTTP 403 Forbidden.
 */

// Known SQL Injection attack patterns
const SQLI_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|TRUNCATE|DECLARE|GRANT|REVOKE)\b)/i,
  /((\bOR\b|\bAND\b)\s+(['"]?\s*[\d\w]+\s*=\s*['"]?[\d\w]+|['"]?1['"]?\s*=\s*['"]?1['"]?))/i,
  /(--|\/\*|\*\/|;|@@|char\(|nchar\(|exec\(|concat\()/i,
  /('|\"|\b)\s*1\s*=\s*1/i,
  /('|\"|\b)\s*or\s*['"]?1['"]?\s*=\s*['"]?1/i,
  /('|\"|\b)\s*or\s*true/i,
];

function isMaliciousValue(val: any): boolean {
  if (typeof val === 'string') {
    const trimmed = val.trim();
    for (const pattern of SQLI_PATTERNS) {
      if (pattern.test(trimmed)) {
        return true;
      }
    }
  } else if (typeof val === 'object' && val !== null) {
    for (const key of Object.keys(val)) {
      if (isMaliciousValue(key) || isMaliciousValue(val[key])) {
        return true;
      }
    }
  }
  return false;
}

export const sqlInjectionGuard = (req: Request, res: Response, next: NextFunction) => {
  try {
    const isMaliciousBody = req.body && isMaliciousValue(req.body);
    const isMaliciousQuery = req.query && isMaliciousValue(req.query);
    const isMaliciousParams = req.params && isMaliciousValue(req.params);

    if (isMaliciousBody || isMaliciousQuery || isMaliciousParams) {
      console.warn(`[SECURITY FIREWALL BLOCKED] SQL Injection attack attempt intercepted from IP: ${req.ip} path: ${req.originalUrl}`);
      return res.status(403).json({
        error: 'Security Threat Intercepted: Malicious SQL Injection payload detected. Attempt logged.',
        blocked: true,
      });
    }

    next();
  } catch {
    next();
  }
};
