import { Router, Response } from 'express';
import ItemRequest from '../models/ItemRequest';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';
import { createNotification } from '../utils/notify';

const router = Router();

router.post('/', authenticate, async (req: AuthRequest, res: Response) => {
  const request = await ItemRequest.create({ ...req.body, requester: req.user!.id });
  res.status(201).json(request);
});

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { role, id } = req.user!;
  let query: any = {};
  if (role === 'staff') query.requester = id;
  else if (role === 'supervisor') query.status = 'pending';
  else if (role === 'regional_coordinator') query.status = 'supervisor_approved';
  const requests = await ItemRequest.find(query).populate('requester', 'fullName department');
  res.json(requests);
});

router.get('/:id', authenticate, async (req: AuthRequest, res: Response) => {
  const request = await ItemRequest.findById(req.params.id).populate('requester', 'fullName department staffId');
  if (!request) return res.status(404).json({ message: 'Not found' });
  res.json(request);
});

router.patch('/:id/supervisor', authenticate, authorize('supervisor'), async (req: AuthRequest, res: Response) => {
  const { action, comment } = req.body;
  const request = await ItemRequest.findByIdAndUpdate(
    req.params.id,
    { status: action === 'approve' ? 'supervisor_approved' : 'rejected', supervisorComment: comment },
    { new: true }
  );
  if (request) await createNotification(String(request.requester), 'Item Request Update', `Your item request was ${action}d by supervisor`, action === 'approve' ? 'approval' : 'rejection');
  res.json(request);
});

router.patch('/:id/coordinator', authenticate, authorize('regional_coordinator'), async (req: AuthRequest, res: Response) => {
  const { action, comment } = req.body;
  const request = await ItemRequest.findByIdAndUpdate(
    req.params.id,
    { status: action === 'approve' ? 'coordinator_approved' : 'rejected', coordinatorComment: comment },
    { new: true }
  );
  if (request) await createNotification(String(request.requester), 'Item Request Approved', `Your item request was ${action}d by coordinator`, action === 'approve' ? 'approval' : 'rejection');
  res.json(request);
});

export default router;
