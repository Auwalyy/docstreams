import { Router, Response } from 'express';
import VehicleRequest from '../models/VehicleRequest';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { createNotification } from '../utils/notify';

const router = Router();

// Create request
router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const request = await VehicleRequest.create({ ...req.body, requester: req.user!.id, staffId: req.body.staffId || req.user!.id });
  res.status(201).json(request);
});

// Get requests (filtered by role)
router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { role, id } = req.user!;
  let query: any = {};
  if (role === 'staff') query.requester = id;
  else if (role === 'supervisor') query.status = 'pending';
  else if (role === 'corporate_services') query.status = 'supervisor_approved';
  else if (role === 'vehicle_officer') query.status = { $in: ['corporate_approved', 'vehicle_assigned', 'dispatched'] };
  const requests = await VehicleRequest.find(query).populate('requester', 'fullName department');
  res.json(requests);
});

// Get single request
router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const request = await VehicleRequest.findById(req.params.id).populate('requester', 'fullName department staffId');
  if (!request) return res.status(404).json({ message: 'Not found' });
  res.json(request);
});

// Supervisor approve/reject
router.patch('/:id/supervisor', authenticate, authorize('supervisor', 'regional_coordinator'), async (req: AuthRequest, res: Response) => {
  const { action, comment } = req.body;
  const request = await VehicleRequest.findByIdAndUpdate(
    req.params.id,
    {
      status: action === 'approve' ? 'supervisor_approved' : 'rejected',
      supervisorComment: comment,
      approvedBySupervisor: req.user!.id,
    },
    { new: true }
  );
  if (request) await createNotification(String(request.requester), 'Vehicle Request Update', `Your request was ${action}d by supervisor`, action === 'approve' ? 'approval' : 'rejection');
  res.json(request);
});

// Corporate approve/reject
router.patch('/:id/corporate', authenticate, authorize('corporate_services', 'regional_coordinator'), async (req: AuthRequest, res: Response) => {
  const { action, comment } = req.body;
  const request = await VehicleRequest.findByIdAndUpdate(
    req.params.id,
    {
      status: action === 'approve' ? 'corporate_approved' : 'rejected',
      corporateComment: comment,
      approvedByCorporate: req.user!.id,
    },
    { new: true }
  );
  if (request) await createNotification(String(request.requester), 'Vehicle Request Update', `Your request was ${action}d by corporate services`, action === 'approve' ? 'approval' : 'rejection');
  res.json(request);
});

// Vehicle officer assign & dispatch
router.patch('/:id/assign', authenticate, authorize('vehicle_officer', 'regional_coordinator'), async (req: AuthRequest, res: Response) => {
  const { assignedVehicle, assignedDriver, driverId, departureDate, returnDate } = req.body;
  const request = await VehicleRequest.findByIdAndUpdate(
    req.params.id,
    { status: 'vehicle_assigned', assignedVehicle, assignedDriver, driverId, departureDate, returnDate, assignedBy: req.user!.id },
    { new: true }
  );
  if (request) await createNotification(String(request.requester), 'Vehicle Assigned', `Vehicle ${assignedVehicle} and driver ${assignedDriver} have been assigned`, 'assignment');
  res.json(request);
});

router.patch('/:id/dispatch', authenticate, authorize('vehicle_officer', 'regional_coordinator'), async (req: AuthRequest, res: Response) => {
  const request = await VehicleRequest.findByIdAndUpdate(req.params.id, { status: 'dispatched' }, { new: true });
  res.json(request);
});

router.patch('/:id/complete', authenticate, authorize('vehicle_officer', 'ict_admin'), async (req: AuthRequest, res: Response) => {
  const request = await VehicleRequest.findByIdAndUpdate(req.params.id, { status: 'completed' }, { new: true });
  res.json(request);
});

export default router;
