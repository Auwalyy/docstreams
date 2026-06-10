import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import api from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import type { User } from '../../types';

const ROLES = [
  { value: 'staff', label: 'Staff' },
  { value: 'supervisor', label: 'Supervisor' },
  { value: 'corporate_services', label: 'Corporate Services' },
  { value: 'vehicle_officer', label: 'Vehicle Officer' },
  { value: 'regional_coordinator', label: 'Regional Coordinator' },
  { value: 'rom_supervisor', label: 'ROM Supervisor' },
  { value: 'ict_admin', label: 'ICT Admin' },
];

export default function StaffPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ fullName: '', staffId: '', email: '', department: '', role: 'staff' });

  const { data: staff = [], isLoading } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof form) => api.post('/users', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['users'] }); setOpen(false); setForm({ fullName: '', staffId: '', email: '', department: '', role: 'staff' }); },
  });

  const deactivateMutation = useMutation({
    mutationFn: (id: string) => api.put(`/users/${id}`, { isActive: false }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/users/${id}/reset-password`, {}),
    onSuccess: () => alert('Password reset and sent to user\'s email.'),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Staff Management</h1>
        <Button onClick={() => setOpen(true)}><Plus size={16} className="mr-2" />Create Staff</Button>
      </div>

      <Card>
        {isLoading ? <p className="text-gray-400 text-sm">Loading...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500 text-xs uppercase">
                  <th className="pb-3 pr-4">Name</th>
                  <th className="pb-3 pr-4">Staff ID</th>
                  <th className="pb-3 pr-4">Department</th>
                  <th className="pb-3 pr-4">Role</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {staff.map((s) => (
                  <tr key={s.id} className="hover:bg-gray-50">
                    <td className="py-3 pr-4 font-medium text-gray-800">{s.fullName}</td>
                    <td className="py-3 pr-4 text-gray-600">{s.staffId}</td>
                    <td className="py-3 pr-4 text-gray-600">{s.department}</td>
                    <td className="py-3 pr-4 text-gray-600 capitalize">{s.role.replace(/_/g, ' ')}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${s.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {s.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 flex gap-2">
                      {s.isActive && (
                        <button onClick={() => deactivateMutation.mutate(s.id)} className="text-xs text-red-500 hover:underline">Deactivate</button>
                      )}
                      <button onClick={() => resetPasswordMutation.mutate(s.id)} className="text-xs text-green-600 hover:underline">Reset Pwd</button>
                    </td>
                  </tr>
                ))}
                {staff.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-gray-400">No staff found</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Create Staff Account">
        <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form); }} className="space-y-4">
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Full Name" value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} required />
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Staff ID" value={form.staffId} onChange={(e) => setForm({ ...form, staffId: e.target.value })} required />
          <input type="email" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} required />
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
            {ROLES.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={createMutation.isPending}>Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
