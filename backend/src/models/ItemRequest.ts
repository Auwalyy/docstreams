import mongoose, { Schema, Document } from 'mongoose';

interface IRequestItem {
  description: string;
  unit: string;
  quantity: number;
  allocation: string;
}

export interface IItemRequest extends Document {
  requester: mongoose.Types.ObjectId;
  staffId: string;
  department: string;
  items: IRequestItem[];
  attachmentUrl?: string;
  status: 'pending' | 'supervisor_approved' | 'coordinator_approved' | 'rejected';
  supervisorComment?: string;
  coordinatorComment?: string;
}

const ItemRequestSchema = new Schema<IItemRequest>(
  {
    requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    staffId: { type: String, required: true },
    department: { type: String, required: true },
    items: [
      {
        description: { type: String, required: true },
        unit: { type: String, required: true },
        quantity: { type: Number, required: true },
        allocation: { type: String, required: true },
      },
    ],
    attachmentUrl: String,
    status: {
      type: String,
      enum: ['pending', 'supervisor_approved', 'coordinator_approved', 'rejected'],
      default: 'pending',
    },
    supervisorComment: String,
    coordinatorComment: String,
  },
  { timestamps: true }
);

export default mongoose.model<IItemRequest>('ItemRequest', ItemRequestSchema);
