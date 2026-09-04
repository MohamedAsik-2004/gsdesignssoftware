import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { db } from '../mockDatabase';
import { UserRole } from '../types';

export const authRouter = Router();

const JWT_SECRET = process.env.JWT_SECRET || 'gs_designs_secret_key_2026';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    name: string;
    role: UserRole;
  };
}

// Authentication Middleware
export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Missing or invalid token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; name: string; role: UserRole };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Forbidden: Invalid or expired token' });
  }
};

// Role Permission Middleware
export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ success: false, message: `Access denied: Requires role ${allowedRoles.join(' or ')}` });
    }
    next();
  };
};

// Desk Login Route
authRouter.post('/login', (req: Request, res: Response) => {
  const { role, pin } = req.body;

  if (!role) {
    return res.status(400).json({ success: false, message: 'Role parameter is required' });
  }

  const users = db.getUsers();
  let user = users.find(u => u.role === role);

  // If specific user pin provided, check against user pin
  if (pin) {
    const pinMatch = users.find(u => u.role === role && u.pin === pin);
    if (pinMatch) {
      user = pinMatch;
    }
  }

  if (!user) {
    return res.status(404).json({ success: false, message: `No active desk found for role ${role}` });
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, role: user.role },
    JWT_SECRET,
    { expiresIn: '24h' }
  );

  return res.json({
    success: true,
    message: `Desk authenticated as ${user.name} (${user.role})`,
    token,
    user
  });
});

// GET Current User Profile
authRouter.get('/me', authenticateJWT, (req: AuthRequest, res: Response) => {
  if (!req.user) return res.status(401).json({ success: false, message: 'Not authenticated' });
  const user = db.getUserById(req.user.id);
  return res.json({ success: true, user });
});

// GET All Active Desk Users
authRouter.get('/users', (req: Request, res: Response) => {
  return res.json({ success: true, users: db.getUsers() });
});
