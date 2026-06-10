import mongoose, { Schema, Document } from 'mongoose';

export interface IActingOfficer extends Document {
  officer: mongoose.Types.ObjectId;
  position: string;
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'approved' | 'rejected';
  assignedBy: mongoose.Types.ObjectId;
  approvedBy?: mongoose.Types.ObjectId;
}

const ActingOfficerSchema = new Schema<IActingOfficer>(
  {
    officer: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    position: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    approvedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model<IActingOfficer>('ActingOfficer', ActingOfficerSchema);
