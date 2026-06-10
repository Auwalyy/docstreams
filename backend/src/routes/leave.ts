import { Router, Response } from 'express';
import ActingOfficer from '../models/ActingOfficer';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { createNotification } from '../utils/notify';

const router = Router();

router.get('/', authenticate, async (_req, res: Response) => {
  const records = await ActingOfficer.find().populate('officer', 'fullName').populate('assignedBy', 'fullName');
  res.json(records);
});

router.post('/', authenticate, authorize('regional_coordinator', 'ict_admin'), async (req: AuthRequest, res: Response) => {
  const record = await ActingOfficer.create({ ...req.body, assignedBy: req.user!.id });
  await createNotification(req.body.officer, 'Acting Officer Assignment', `You have been assigned as acting officer for ${req.body.position}`, 'assignment');
  res.status(201).json(record);
});

router.patch('/:id/approve', authenticate, authorize('regional_coordinator', 'ict_admin'), async (req: AuthRequest, res: Response) => {
  const record = await ActingOfficer.findByIdAndUpdate(req.params.id, { status: 'approved', approvedBy: req.user!.id }, { new: true });
  res.json(record);
});

router.patch('/:id/reject', authenticate, authorize('regional_coordinator', 'ict_admin'), async (req: AuthRequest, res: Response) => {
  const record = await ActingOfficer.findByIdAndUpdate(req.params.id, { status: 'rejected' }, { new: true });
  res.json(record);
});

export default router;
