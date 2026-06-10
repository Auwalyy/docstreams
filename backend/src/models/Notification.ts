import mongoose, { Schema, Document } from 'mongoose';

export interface INotification extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  message: string;
  isRead: boolean;
  type: 'request' | 'approval' | 'rejection' | 'assignment' | 'system';
}

const NotificationSchema = new Schema<INotification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ['request', 'approval', 'rejection', 'assignment', 'system'],
      default: 'system',
    },
  },
  { timestamps: true }
);

export default mongoose.model<INotification>('Notification', NotificationSchema);
