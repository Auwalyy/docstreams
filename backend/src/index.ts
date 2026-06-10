import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import facilityRoutes from './routes/facilities';
import documentRoutes from './routes/documents';
import vehicleRoutes from './routes/vehicles';
import itemRequestRoutes from './routes/itemRequests';
import inventoryRoutes from './routes/inventory';
import leaveRoutes from './routes/leave';
import activityRoutes from './routes/activity';
import notificationRoutes from './routes/notifications';
import reportRoutes from './routes/reports';

dotenv.config();

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/item-requests', itemRequestRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/leave', leaveRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI!)
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));

export default app;
