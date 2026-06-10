import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../lib/utils';
import type { VehicleRequest } from '../../types';

export default function VehiclesPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<VehicleRequest | null>(null);
  const [actionModal, setActionModal] = useState(false);
  const [comment, setComment] = useState('');
  const [assignForm, setAssignForm] = useState({ assignedVehicle: '', assignedDriver: '', driverId: '', departureDate: '', returnDate: '' });

  const [form, setForm] = useState({
    department: user?.department ?? '', vehicleType: '', purpose: '', destination: '',
    duration: '', departureDate: '', returnDate: '', isUrgent: false,
  });

  const { data: requests = [], isLoading } = useQuery<VehicleRequest[]>({
    queryKey: ['vehicles'],
    queryFn: () => api.get('/vehicles').then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof form) => api.post('/vehicles', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vehicles'] }); setOpen(false); },
  });

  const approveSupervisor = useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) =>
      api.patch(`/vehicles/${id}/supervisor`, { action, comment }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vehicles'] }); setActionModal(false); setComment(''); },
  });

  const approveCorporate = useMutation({
    mutationFn: ({ id, action }: { id: string; action: string }) =>
      api.patch(`/vehicles/${id}/corporate`, { action, comment }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vehicles'] }); setActionModal(false); setComment(''); },
  });

  const assignMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/vehicles/${id}/assign`, assignForm),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vehicles'] }); setActionModal(false); },
  });

  const dispatchMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/vehicles/${id}/dispatch`, {}),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['vehicles'] }); setActionModal(false); },
  });

  const role = user?.role;
  const canCreate = role === 'staff' || role === 'ict_admin';
  const canSupervisorAction = role === 'supervisor' || role === 'regional_coordinator';
  const canCorporateAction = role === 'corporate_services' || role === 'regional_coordinator';
  const canAssign = role === 'vehicle_officer' || role === 'regional_coordinator';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Vehicle Requests</h1>
        {canCreate && <Button onClick={() => setOpen(true)}><Plus size={16} className="mr-2" />New Request</Button>}
      </div>

      <Card>
        {isLoading ? <p className="text-gray-400 text-sm">Loading...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500 text-xs uppercase">
                  <th className="pb-3 pr-4">Requester</th>
                  <th className="pb-3 pr-4">Destination</th>
                  <th className="pb-3 pr-4">Vehicle Type</th>
                  <th className="pb-3 pr-4">Departure</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {requests.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="py-3 pr-4 font-medium text-gray-800">{r.requester?.fullName ?? r.staffId}</td>
                    <td className="py-3 pr-4 text-gray-600">{r.destination}</td>
                    <td className="py-3 pr-4 text-gray-600">{r.vehicleType}</td>
                    <td className="py-3 pr-4 text-gray-500">{formatDate(r.departureDate)}</td>
                    <td className="py-3 pr-4"><Badge status={r.status} /></td>
                    <td className="py-3">
                      <button onClick={() => { setSelected(r); setActionModal(true); }} className="text-green-600 hover:underline text-xs font-medium">
                        View
                      </button>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-gray-400">No requests</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Create Modal */}
      <Modal isOpen={open} onClose={() => setOpen(false)} title="New Vehicle Request">
        <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form); }} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.vehicleType} onChange={(e) => setForm({ ...form, vehicleType: e.target.value })} required />
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
              <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required />
            </div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Purpose</label>
            <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" rows={2} value={form.purpose} onChange={(e) => setForm({ ...form, purpose: e.target.value })} required />
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Destination</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required />
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Departure Date</label>
              <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.departureDate} onChange={(e) => setForm({ ...form, departureDate: e.target.value })} required />
            </div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
              <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.returnDate} onChange={(e) => setForm({ ...form, returnDate: e.target.value })} required />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isUrgent} onChange={(e) => setForm({ ...form, isUrgent: e.target.checked })} className="rounded" />
            Mark as Urgent
          </label>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={createMutation.isPending}>Submit</Button>
          </div>
        </form>
      </Modal>

      {/* Action / View Modal */}
      {selected && (
        <Modal isOpen={actionModal} onClose={() => { setActionModal(false); setSelected(null); }} title="Request Details">
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div><span className="text-gray-500">Requester:</span> <span className="font-medium">{selected.requester?.fullName}</span></div>
              <div><span className="text-gray-500">Department:</span> <span className="font-medium">{selected.department}</span></div>
              <div><span className="text-gray-500">Vehicle Type:</span> <span className="font-medium">{selected.vehicleType}</span></div>
              <div><span className="text-gray-500">Destination:</span> <span className="font-medium">{selected.destination}</span></div>
              <div><span className="text-gray-500">Departure:</span> <span className="font-medium">{formatDate(selected.departureDate)}</span></div>
              <div><span className="text-gray-500">Return:</span> <span className="font-medium">{formatDate(selected.returnDate)}</span></div>
            </div>
            <div><span className="text-gray-500">Purpose:</span> <p className="mt-1">{selected.purpose}</p></div>
            <div><span className="text-gray-500">Status:</span> <Badge status={selected.status} /></div>
            {selected.supervisorComment && <div><span className="text-gray-500">Supervisor Comment:</span> <p>{selected.supervisorComment}</p></div>}
            {selected.corporateComment && <div><span className="text-gray-500">Corporate Comment:</span> <p>{selected.corporateComment}</p></div>}
            {selected.assignedVehicle && <div><span className="text-gray-500">Vehicle:</span> <span className="font-medium">{selected.assignedVehicle}</span></div>}
            {selected.assignedDriver && <div><span className="text-gray-500">Driver:</span> <span className="font-medium">{selected.assignedDriver}</span></div>}

            {canSupervisorAction && selected.status === 'pending' && (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={2} placeholder="Comment (optional)" value={comment} onChange={(e) => setComment(e.target.value)} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => approveSupervisor.mutate({ id: selected._id, action: 'approve' })} isLoading={approveSupervisor.isPending}>Approve</Button>
                  <Button size="sm" variant="danger" onClick={() => approveSupervisor.mutate({ id: selected._id, action: 'reject' })}>Reject</Button>
                </div>
              </div>
            )}

            {canCorporateAction && selected.status === 'supervisor_approved' && (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={2} placeholder="Comment (optional)" value={comment} onChange={(e) => setComment(e.target.value)} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => approveCorporate.mutate({ id: selected._id, action: 'approve' })} isLoading={approveCorporate.isPending}>Approve</Button>
                  <Button size="sm" variant="danger" onClick={() => approveCorporate.mutate({ id: selected._id, action: 'reject' })}>Reject</Button>
                </div>
              </div>
            )}

            {canAssign && selected.status === 'corporate_approved' && (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <div className="grid grid-cols-2 gap-2">
                  <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Vehicle (e.g. Toyota Hilux)" value={assignForm.assignedVehicle} onChange={(e) => setAssignForm({ ...assignForm, assignedVehicle: e.target.value })} />
                  <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Driver Name" value={assignForm.assignedDriver} onChange={(e) => setAssignForm({ ...assignForm, assignedDriver: e.target.value })} />
                  <input className="border border-gray-300 rounded-lg px-3 py-2 text-sm" placeholder="Driver ID" value={assignForm.driverId} onChange={(e) => setAssignForm({ ...assignForm, driverId: e.target.value })} />
                  <input type="date" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" value={assignForm.departureDate} onChange={(e) => setAssignForm({ ...assignForm, departureDate: e.target.value })} />
                  <input type="date" className="border border-gray-300 rounded-lg px-3 py-2 text-sm" value={assignForm.returnDate} onChange={(e) => setAssignForm({ ...assignForm, returnDate: e.target.value })} />
                </div>
                <Button size="sm" onClick={() => assignMutation.mutate(selected._id)} isLoading={assignMutation.isPending}>Assign Vehicle</Button>
              </div>
            )}

            {canAssign && selected.status === 'vehicle_assigned' && (
              <div className="pt-2 border-t border-gray-100">
                <Button size="sm" onClick={() => dispatchMutation.mutate(selected._id)} isLoading={dispatchMutation.isPending}>Dispatch Vehicle</Button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
