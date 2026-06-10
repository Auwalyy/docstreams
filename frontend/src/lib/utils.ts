import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatDate = (date: string | Date) =>
  new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

export const statusColor: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  supervisor_approved: 'bg-blue-100 text-blue-800',
  corporate_approved: 'bg-indigo-100 text-indigo-800',
  coordinator_approved: 'bg-indigo-100 text-indigo-800',
  vehicle_assigned: 'bg-purple-100 text-purple-800',
  dispatched: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  approved: 'bg-green-100 text-green-800',
};

export const statusLabel: Record<string, string> = {
  pending: 'Pending',
  supervisor_approved: 'Supervisor Approved',
  corporate_approved: 'Corporate Approved',
  coordinator_approved: 'Coordinator Approved',
  vehicle_assigned: 'Vehicle Assigned',
  dispatched: 'Dispatched',
  completed: 'Completed',
  rejected: 'Rejected',
  approved: 'Approved',
};
