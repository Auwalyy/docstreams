import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Bell, CheckCheck } from 'lucide-react';
import api from '../lib/api';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatDate } from '../lib/utils';
import type { Notification } from '../types';

const typeColor: Record<string, string> = {
  approval: 'bg-green-100 text-green-700',
  rejection: 'bg-red-100 text-red-700',
  assignment: 'bg-blue-100 text-blue-700',
  request: 'bg-yellow-100 text-yellow-700',
  system: 'bg-gray-100 text-gray-700',
};

export default function NotificationsPage() {
  const qc = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: () => api.get('/notifications').then((r: any) => r.data),
  });

  const readAllMutation = useMutation({
    mutationFn: () => api.patch('/notifications/read-all', {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/notifications/${id}/read`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  });

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Notifications</h1>
          {unreadCount > 0 && <p className="text-sm text-gray-500">{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && (
          <Button variant="secondary" size="sm" onClick={() => readAllMutation.mutate()} isLoading={readAllMutation.isPending}>
            <CheckCheck size={14} className="mr-2" />Mark all read
          </Button>
        )}
      </div>

      <Card>
        {isLoading ? <p className="text-gray-400 text-sm">Loading...</p> : (
          <div className="space-y-1">
            {notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => !n.isRead && markReadMutation.mutate(n._id)}
                className={`flex gap-4 p-4 rounded-lg cursor-pointer transition-colors ${n.isRead ? 'hover:bg-gray-50' : 'bg-green-50 hover:bg-green-100'}`}
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 ${typeColor[n.type] ?? 'bg-gray-100'}`}>
                  <Bell size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${n.isRead ? 'text-gray-700' : 'text-gray-900'}`}>{n.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{n.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatDate(n.createdAt)}</p>
                </div>
                {!n.isRead && <div className="w-2 h-2 rounded-full bg-green-500 mt-2 flex-shrink-0" />}
              </div>
            ))}
            {notifications.length === 0 && (
              <div className="py-12 text-center">
                <Bell size={32} className="mx-auto text-gray-300 mb-2" />
                <p className="text-gray-400 text-sm">No notifications</p>
              </div>
            )}
          </div>
        )}
      </Card>
    </div>
  );
}
