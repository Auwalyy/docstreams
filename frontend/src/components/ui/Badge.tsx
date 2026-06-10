import { statusColor, statusLabel } from '../../lib/utils';

export const Badge = ({ status }: { status: string }) => (
  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColor[status] ?? 'bg-gray-100 text-gray-800'}`}>
    {statusLabel[status] ?? status}
  </span>
);
