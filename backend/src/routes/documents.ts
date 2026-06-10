import { Router, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Document from '../models/Document';
import { authenticate, authorize, AuthRequest } from '../middleware/auth';

const router = Router();

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage, limits: { fileSize: 20 * 1024 * 1024 } });

router.get('/', authenticate, async (req: AuthRequest, res: Response) => {
  const { facility, category } = req.query;
  const query: any = {};
  if (facility) query.facility = facility;
  if (category) query.category = category;
  const docs = await Document.find(query).populate('uploadedBy', 'fullName').populate('facility', 'name');
  res.json(docs);
});

router.post('/', authenticate, authorize('ict_admin', 'rom_supervisor'), upload.single('file'), async (req: AuthRequest, res: Response) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const doc = await Document.create({
    title: req.body.title,
    fileUrl: `/uploads/${req.file.filename}`,
    fileType: req.file.mimetype,
    category: req.body.category,
    facility: req.body.facility,
    uploadedBy: req.user!.id,
  });
  res.status(201).json(doc);
});

router.delete('/:id', authenticate, authorize('ict_admin'), async (req: AuthRequest, res: Response) => {
  await Document.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

export default router;
