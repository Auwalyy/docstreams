import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import { authenticate, AuthRequest, logActivity } from '../middleware/auth';
import { sendEmail, passwordResetEmail } from '../utils/email';

const router = Router();

const signTokens = (user: { id: string; role: string; fullName: string }) => {
  const accessToken = jwt.sign(user, process.env.JWT_SECRET!, { expiresIn: '15m' });
  const refreshToken = jwt.sign(user, process.env.JWT_REFRESH_SECRET!, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

// Login
router.post('/login', async (req, res: Response) => {
  try {
    const { staffId, email, password } = req.body;
    const user = await User.findOne({ $or: [{ staffId }, { email }] });
    if (!user || !user.isActive) return res.status(401).json({ message: 'Invalid credentials or account inactive' });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

    const { accessToken, refreshToken } = signTokens({ id: user.id, role: user.role, fullName: user.fullName });
    user.refreshToken = refreshToken;
    await user.save();

    res.json({ accessToken, refreshToken, user: { id: user.id, fullName: user.fullName, role: user.role, department: user.department, staffId: user.staffId, email: user.email } });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Refresh token
router.post('/refresh', async (req, res: Response) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(401).json({ message: 'No token' });
  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { id: string; role: string; fullName: string };
    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) return res.status(403).json({ message: 'Invalid token' });
    const tokens = signTokens({ id: user.id, role: user.role, fullName: user.fullName });
    user.refreshToken = tokens.refreshToken;
    await user.save();
    res.json(tokens);
  } catch {
    res.status(403).json({ message: 'Invalid token' });
  }
});

// Logout
router.post('/logout', authenticate, logActivity('Logout'), async (req: AuthRequest, res: Response) => {
  await User.findByIdAndUpdate(req.user!.id, { refreshToken: null });
  res.json({ message: 'Logged out' });
});

// Forgot password
router.post('/forgot-password', async (req, res: Response) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.json({ message: 'If that email exists, a reset link was sent.' });

  const token = crypto.randomBytes(32).toString('hex');
  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${token}&id=${user.id}`;
  const { subject, html } = passwordResetEmail(user.fullName, resetLink);
  await sendEmail(email, subject, html).catch(() => {});
  res.json({ message: 'If that email exists, a reset link was sent.' });
});

// Reset password
router.post('/reset-password', async (req, res: Response) => {
  const { userId, password } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: 'User not found' });
  user.password = password;
  await user.save();
  res.json({ message: 'Password reset successful' });
});

// Me
router.get('/me', authenticate, async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user!.id).select('-password -refreshToken');
  res.json(user);
});

export default router;
