import { Router, Response } from 'express';
import InventoryReport from '../models/InventoryReport';
import { authenticate, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (_req, res: Response) => {
  const reports = await InventoryReport.find().populate('createdBy', 'fullName');
  res.json(reports);
});

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const report = await InventoryReport.create({ ...req.body, createdBy: req.user!.id });
  res.status(201).json(report);
});

router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const report = await InventoryReport.findById(req.params.id).populate('createdBy', 'fullName');
  if (!report) return res.status(404).json({ message: 'Not found' });
  res.json(report);
});

export default router;
