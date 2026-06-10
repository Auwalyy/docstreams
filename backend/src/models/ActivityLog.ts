import mongoose, { Schema, Document } from 'mongoose';

export interface IActivityLog extends Document {
  user: mongoose.Types.ObjectId;
  staffName: string;
  role: string;
  activity: string;
  ipAddress?: string;
}

const ActivityLogSchema = new Schema<IActivityLog>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    staffName: { type: String, required: true },
    role: { type: String, required: true },
    activity: { type: String, required: true },
    ipAddress: String,
  },
  { timestamps: true }
);

export default mongoose.model<IActivityLog>('ActivityLog', ActivityLogSchema);
