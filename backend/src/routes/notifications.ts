import { Router, Response } from 'express';
import Notification from '../models/Notification';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const notifs = await Notification.find({ user: req.user!.id }).sort({ createdAt: -1 }).limit(50);
  res.json(notifs);
});

router.patch('/:id/read', authenticate, async (req: AuthRequest, res: Response) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ message: 'Marked as read' });
});

router.patch('/read-all', authenticate, async (req: AuthRequest, res: Response) => {
  await Notification.updateMany({ user: req.user!.id }, { isRead: true });
  res.json({ message: 'All marked as read' });
});

export default router;
