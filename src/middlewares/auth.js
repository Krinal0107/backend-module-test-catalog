import { verifyJwt } from '../utils/jwt.js';

export function requireAuth(req, res, next) {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : '';
  if (!token) return res.status(401).json({ ok: false, message: 'Unauthorized' });
  try {
    const payload = verifyJwt(token);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ ok: false, message: 'Invalid token' });
  }
}

export function requireOwnerOrAdmin(resolveOwnerId) {
  return async (req, res, next) => {
    if (!req.user) return res.status(401).json({ ok: false, message: 'Unauthorized' });
    const ownerId = await resolveOwnerId(req);
    if (req.user.role === 'admin' || (ownerId && ownerId === req.user.userId)) {
      return next();
    }
    return res.status(403).json({ ok: false, message: 'Forbidden' });
  };
}


