import { Router, Response } from 'express';
import VehicleRequest from '../models/VehicleRequest';
import ItemRequest from '../models/ItemRequest';
import InventoryReport from '../models/InventoryReport';
import User from '../models/User';
import ActivityLog from '../models/ActivityLog';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/summary', authenticate, authorize('ict_admin', 'regional_coordinator'), async (_req, res: Response) => {
  const [vehicles, items, inventory, users, logs] = await Promise.all([
    VehicleRequest.countDocuments(),
    ItemRequest.countDocuments(),
    InventoryReport.countDocuments(),
    User.countDocuments(),
    ActivityLog.countDocuments(),
  ]);
  const vehicleByStatus = await VehicleRequest.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  const itemByStatus = await ItemRequest.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]);
  res.json({ vehicles, items, inventory, users, logs, vehicleByStatus, itemByStatus });
});

router.get('/vehicles', authenticate, authorize('ict_admin', 'regional_coordinator', 'vehicle_officer'), async (_req, res: Response) => {
  const data = await VehicleRequest.find().populate('requester', 'fullName department');
  res.json(data);
});

router.get('/items', authenticate, authorize('ict_admin', 'regional_coordinator'), async (_req, res: Response) => {
  const data = await ItemRequest.find().populate('requester', 'fullName department');
  res.json(data);
});

router.get('/staff', authenticate, authorize('ict_admin'), async (_req, res: Response) => {
  const data = await User.find().select('-password -refreshToken');
  res.json(data);
});

router.get('/activity', authenticate, authorize('ict_admin'), async (_req, res: Response) => {
  const data = await ActivityLog.find().sort({ createdAt: -1 }).limit(1000);
  res.json(data);
});

export default router;
