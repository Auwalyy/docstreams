import { useQuery } from '@tanstack/react-query';
import { Car, Package, Users, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import { Card } from '../components/ui/Card';

const StatCard = ({ icon: Icon, label, value, color }: { icon: React.ElementType; label: string; value: number; color: string }) => (
  <div className={`bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex items-center gap-4`}>
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

export default function DashboardPage() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ict_admin' || user?.role === 'regional_coordinator';

  const { data: summary } = useQuery({
    queryKey: ['reports-summary'],
    queryFn: () => api.get('/reports/summary').then((r: any) => r.data),
    enabled: isAdmin,
  });

  const { data: myVehicles } = useQuery({
    queryKey: ['my-vehicles'],
    queryFn: () => api.get('/vehicles').then((r: any) => r.data),
    enabled: !isAdmin,
  });

  const { data: myItems } = useQuery({
    queryKey: ['my-items'],
    queryFn: () => api.get('/item-requests').then((r: any) => r.data),
    enabled: !isAdmin,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, {user?.fullName}</p>
      </div>

      {isAdmin && summary && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard icon={Car} label="Vehicle Requests" value={summary.vehicles} color="bg-blue-500" />
          <StatCard icon={Package} label="Item Requests" value={summary.items} color="bg-purple-500" />
          <StatCard icon={ClipboardList} label="Inventory Reports" value={summary.inventory} color="bg-orange-500" />
          <StatCard icon={Users} label="Staff" value={summary.users} color="bg-green-600" />
        </div>
      )}

      {isAdmin && summary?.vehicleByStatus && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="Vehicle Requests by Status">
            <div className="space-y-2">
              {summary.vehicleByStatus.map((s: { _id: string; count: number }) => (
                <div key={s._id} className="flex justify-between text-sm">
                  <span className="capitalize text-gray-600">{s._id?.replace('_', ' ')}</span>
                  <span className="font-semibold">{s.count}</span>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Item Requests by Status">
            <div className="space-y-2">
              {summary.itemByStatus.map((s: { _id: string; count: number }) => (
                <div key={s._id} className="flex justify-between text-sm">
                  <span className="capitalize text-gray-600">{s._id?.replace('_', ' ')}</span>
                  <span className="font-semibold">{s.count}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}

      {!isAdmin && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card title="My Vehicle Requests">
            {myVehicles?.length === 0 && <p className="text-gray-400 text-sm">No requests yet.</p>}
            <div className="space-y-2">
              {myVehicles?.slice(0, 5).map((r: any) => (
                <div key={r._id} className="flex justify-between items-center text-sm py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-700">{r.destination}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.status === 'completed' ? 'bg-green-100 text-green-700' : r.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
          <Card title="My Item Requests">
            {myItems?.length === 0 && <p className="text-gray-400 text-sm">No requests yet.</p>}
            <div className="space-y-2">
              {myItems?.slice(0, 5).map((r: any) => (
                <div key={r._id} className="flex justify-between items-center text-sm py-2 border-b border-gray-50 last:border-0">
                  <span className="text-gray-700">{r.items?.[0]?.description ?? '—'}</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${r.status === 'coordinator_approved' ? 'bg-green-100 text-green-700' : r.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'}`}>
                    {r.status}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
