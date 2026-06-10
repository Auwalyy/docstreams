import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

export type UserRole =
  | 'ict_admin'
  | 'staff'
  | 'supervisor'
  | 'corporate_services'
  | 'vehicle_officer'
  | 'regional_coordinator'
  | 'rom_supervisor';

export interface IUser extends Document {
  fullName: string;
  staffId: string;
  email: string;
  password: string;
  department: string;
  role: UserRole;
  isActive: boolean;
  refreshToken?: string;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true },
    staffId: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    department: { type: String, required: true },
    role: {
      type: String,
      enum: ['ict_admin', 'staff', 'supervisor', 'corporate_services', 'vehicle_officer', 'regional_coordinator', 'rom_supervisor'],
      default: 'staff',
    },
    isActive: { type: Boolean, default: true },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.methods.comparePassword = function (candidate: string) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model<IUser>('User', UserSchema);
