import { validationResult } from 'express-validator';
import { User } from '../models/User.js';
import { hashPassword, comparePassword } from '../utils/password.js';
import { signJwt } from '../utils/jwt.js';

export async function register(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ ok: false, errors: errors.array() });

  const { name, email, password } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ ok: false, message: 'Email already registered' });

  const user = await User.create({
    name,
    email,
    passwordHash: await hashPassword(password),
  });

  const token = signJwt({ userId: user._id.toString(), email: user.email, role: user.role });
  res.status(201).json({ ok: true, data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
}

export async function login(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ ok: false, errors: errors.array() });

  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ ok: false, message: 'Invalid credentials' });

  const ok = await comparePassword(password, user.passwordHash);
  if (!ok) return res.status(401).json({ ok: false, message: 'Invalid credentials' });

  const token = signJwt({ userId: user._id.toString(), email: user.email, role: user.role });
  res.json({ ok: true, data: { token, user: { id: user._id, name: user.name, email: user.email, role: user.role } } });
}


