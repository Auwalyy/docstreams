import { useQuery } from '@tanstack/react-query';
import api from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { formatDate } from '../../lib/utils';
import type { ActivityLog } from '../../types';

export default function ActivityPage() {
  const { data: logs = [], isLoading } = useQuery<ActivityLog[]>({
    queryKey: ['activity-logs'],
    queryFn: () => api.get('/activity').then((r) => r.data),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Activity Log</h1>

      <Card>
        {isLoading ? <p className="text-gray-400 text-sm">Loading...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500 text-xs uppercase">
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Staff Name</th>
                  <th className="pb-3 pr-4">Role</th>
                  <th className="pb-3 pr-4">Activity</th>
                  <th className="pb-3">IP Address</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {logs.map((l) => (
                  <tr key={l._id} className="hover:bg-gray-50">
                    <td className="py-3 pr-4 text-gray-500">{formatDate(l.createdAt)}</td>
                    <td className="py-3 pr-4 font-medium text-gray-800">{l.staffName}</td>
                    <td className="py-3 pr-4 text-gray-600 capitalize">{l.role?.replace(/_/g, ' ')}</td>
                    <td className="py-3 pr-4 text-gray-700">{l.activity}</td>
                    <td className="py-3 text-gray-400 text-xs">{l.ipAddress ?? '—'}</td>
                  </tr>
                ))}
                {logs.length === 0 && <tr><td colSpan={5} className="py-8 text-center text-gray-400">No activity logs</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
