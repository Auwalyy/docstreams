export type UserRole =
  | 'ict_admin'
  | 'staff'
  | 'supervisor'
  | 'corporate_services'
  | 'vehicle_officer'
  | 'regional_coordinator'
  | 'rom_supervisor';

export interface User {
  id: string;
  fullName: string;
  staffId: string;
  email: string;
  department: string;
  role: UserRole;
  isActive: boolean;
  createdAt: string;
}

export interface Facility {
  _id: string;
  name: string;
  address: string;
  serialNumber: string;
  isActive: boolean;
  takeoverInfo?: string;
  createdBy: { fullName: string };
  createdAt: string;
}

export interface VehicleRequest {
  _id: string;
  requester: { fullName: string; department: string; staffId: string };
  staffId: string;
  department: string;
  vehicleType: string;
  purpose: string;
  destination: string;
  duration: string;
  departureDate: string;
  returnDate: string;
  status: string;
  isUrgent: boolean;
  supervisorComment?: string;
  corporateComment?: string;
  assignedVehicle?: string;
  assignedDriver?: string;
  driverId?: string;
  createdAt: string;
}

export interface ItemRequest {
  _id: string;
  requester: { fullName: string; department: string; staffId: string };
  staffId: string;
  department: string;
  items: { description: string; unit: string; quantity: number; allocation: string }[];
  status: string;
  supervisorComment?: string;
  coordinatorComment?: string;
  createdAt: string;
}

export interface InventoryReport {
  _id: string;
  createdBy: { fullName: string };
  entries: {
    outletName: string;
    outletAddress: string;
    openingPmsStock: number;
    productReceived: number;
    pumpPrice: number;
    pumpDispensingLevel: number;
  }[];
  createdAt: string;
}

export interface ActingOfficer {
  _id: string;
  officer: { fullName: string };
  position: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  assignedBy: { fullName: string };
  createdAt: string;
}

export interface Notification {
  _id: string;
  title: string;
  message: string;
  isRead: boolean;
  type: string;
  createdAt: string;
}

export interface ActivityLog {
  _id: string;
  staffName: string;
  role: string;
  activity: string;
  ipAddress?: string;
  createdAt: string;
}
