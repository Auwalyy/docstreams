import { Router, Response } from 'express';
import Facility from '../models/Facility';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { search } = req.query;
  const query = search
    ? { $or: [{ name: new RegExp(String(search), 'i') }, { serialNumber: new RegExp(String(search), 'i') }, { address: new RegExp(String(search), 'i') }] }
    : {};
  const facilities = await Facility.find(query).populate('createdBy', 'fullName');
  res.json(facilities);
});

router.post('/', authenticate, authorize('ict_admin', 'rom_supervisor'), async (req: AuthRequest, res: Response) => {
  try {
    const facility = await Facility.create({ ...req.body, createdBy: req.user!.id });
    res.status(201).json(facility);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', authenticate, authorize('ict_admin', 'rom_supervisor'), async (req: AuthRequest, res: Response) => {
  const facility = await Facility.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(facility);
});

router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const facility = await Facility.findById(req.params.id).populate('createdBy', 'fullName');
  if (!facility) return res.status(404).json({ message: 'Facility not found' });
  res.json(facility);
});

export default router;
