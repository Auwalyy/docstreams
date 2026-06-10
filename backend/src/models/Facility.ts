import mongoose, { Schema, Document } from 'mongoose';

export interface IFacility extends Document {
  name: string;
  address: string;
  serialNumber: string;
  isActive: boolean;
  takeoverInfo?: string;
  createdBy: mongoose.Types.ObjectId;
}

const FacilitySchema = new Schema<IFacility>(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    serialNumber: { type: String, required: true, unique: true },
    isActive: { type: Boolean, default: true },
    takeoverInfo: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IFacility>('Facility', FacilitySchema);
