import jwt from 'jsonwebtoken';
import * as userService from '../services/userService.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';

export const requireAuth = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await userService.findById(payload.sub);
    if (!user) return res.status(401).json({ message: 'Invalid token' });
    req.user = { id: user.id, email: user.email };
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};
