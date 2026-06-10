import { Router, Response } from 'express';
import ActivityLog from '../models/ActivityLog';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, authorize('ict_admin'), async (req: AuthRequest, res: Response) => {
  const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(500).populate('user', 'fullName role');
  res.json(logs);
});

export default router;
