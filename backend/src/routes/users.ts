import { Router, Response } from 'express';
import crypto from 'crypto';
import User from '../models/User';
import { authenticate, authorize, logActivity, AuthRequest } from '../middleware/auth';
import { sendEmail, accountCreatedEmail } from '../utils/email';

const router = Router();

// Get all users (admin only)
router.get('/', authenticate, authorize('ict_admin'), async (_req, res: Response) => {
  const users = await User.find().select('-password -refreshToken');
  res.json(users);
});

// Create user
router.post('/', authenticate, authorize('ict_admin'), logActivity('Created staff account'), async (req: AuthRequest, res: Response) => {
  try {
    const { fullName, staffId, email, department, role } = req.body;
    const tempPassword = crypto.randomBytes(8).toString('hex');
    const user = await User.create({ fullName, staffId, email, department, role, password: tempPassword });
    const { subject, html } = accountCreatedEmail(fullName, email, tempPassword);
    await sendEmail(email, subject, html).catch(() => {});
    res.status(201).json({ message: 'User created', userId: user.id });
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

// Update user
router.put('/:id', authenticate, authorize('ict_admin'), logActivity('Updated staff account'), async (req: AuthRequest, res: Response) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password -refreshToken');
  res.json(user);
});

// Deactivate user
router.patch('/:id/deactivate', authenticate, authorize('ict_admin'), logActivity('Deactivated staff account'), async (_req, res: Response) => {
  // handled via update route but kept for explicit semantics
  res.json({ message: 'Use PUT /:id with isActive: false' });
});

// Reset password by admin
router.patch('/:id/reset-password', authenticate, authorize('ict_admin'), logActivity('Reset staff password'), async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  const tempPassword = crypto.randomBytes(8).toString('hex');
  user.password = tempPassword;
  await user.save();
  await sendEmail(user.email, 'DocStream - Password Reset by Admin', `<p>Your new temporary password is: <strong>${tempPassword}</strong></p>`).catch(() => {});
  res.json({ message: 'Password reset and emailed to user' });
});

export default router;
