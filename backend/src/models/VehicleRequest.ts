import mongoose, { Schema, Document } from 'mongoose';

export type VehicleRequestStatus =
  | 'pending'
  | 'supervisor_approved'
  | 'corporate_approved'
  | 'vehicle_assigned'
  | 'dispatched'
  | 'completed'
  | 'rejected';

export interface IVehicleRequest extends Document {
  requester: mongoose.Types.ObjectId;
  staffId: string;
  department: string;
  vehicleType: string;
  purpose: string;
  destination: string;
  duration: string;
  departureDate: Date;
  returnDate: Date;
  status: VehicleRequestStatus;
  isUrgent: boolean;
  supervisorComment?: string;
  corporateComment?: string;
  vehicleOfficerComment?: string;
  assignedVehicle?: string;
  assignedDriver?: string;
  driverId?: string;
  approvedBySupervisor?: mongoose.Types.ObjectId;
  approvedByCorporate?: mongoose.Types.ObjectId;
  assignedBy?: mongoose.Types.ObjectId;
}

const VehicleRequestSchema = new Schema<IVehicleRequest>(
  {
    requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    staffId: { type: String, required: true },
    department: { type: String, required: true },
    vehicleType: { type: String, required: true },
    purpose: { type: String, required: true },
    destination: { type: String, required: true },
    duration: { type: String, required: true },
    departureDate: { type: Date, required: true },
    returnDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ['pending', 'supervisor_approved', 'corporate_approved', 'vehicle_assigned', 'dispatched', 'completed', 'rejected'],
      default: 'pending',
    },
    isUrgent: { type: Boolean, default: false },
    supervisorComment: String,
    corporateComment: String,
    vehicleOfficerComment: String,
    assignedVehicle: String,
    assignedDriver: String,
    driverId: String,
    approvedBySupervisor: { type: Schema.Types.ObjectId, ref: 'User' },
    approvedByCorporate: { type: Schema.Types.ObjectId, ref: 'User' },
    assignedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model<IVehicleRequest>('VehicleRequest', VehicleRequestSchema);
