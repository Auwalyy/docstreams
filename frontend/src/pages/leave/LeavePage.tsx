import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus } from 'lucide-react';
import api from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../lib/utils';
import type { ActingOfficer, User } from '../../types';

export default function LeavePage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ officer: '', position: '', startDate: '', endDate: '' });

  const { data: records = [], isLoading } = useQuery<ActingOfficer[]>({
    queryKey: ['leave'],
    queryFn: () => api.get('/leave').then((r) => r.data),
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ['users'],
    queryFn: () => api.get('/users').then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof form) => api.post('/leave', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['leave'] }); setOpen(false); },
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/leave/${id}/approve`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leave'] }),
  });

  const rejectMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/leave/${id}/reject`, {}),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['leave'] }),
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Leave & Acting Officer</h1>
        <Button onClick={() => setOpen(true)}><Plus size={16} className="mr-2" />Assign Officer</Button>
      </div>

      <Card>
        {isLoading ? <p className="text-gray-400 text-sm">Loading...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500 text-xs uppercase">
                  <th className="pb-3 pr-4">Officer</th>
                  <th className="pb-3 pr-4">Position</th>
                  <th className="pb-3 pr-4">Start</th>
                  <th className="pb-3 pr-4">End</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {records.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="py-3 pr-4 font-medium text-gray-800">{r.officer?.fullName}</td>
                    <td className="py-3 pr-4 text-gray-600">{r.position}</td>
                    <td className="py-3 pr-4 text-gray-500">{formatDate(r.startDate)}</td>
                    <td className="py-3 pr-4 text-gray-500">{formatDate(r.endDate)}</td>
                    <td className="py-3 pr-4"><Badge status={r.status} /></td>
                    <td className="py-3 flex gap-2">
                      {r.status === 'pending' && (
                        <>
                          <button onClick={() => approveMutation.mutate(r._id)} className="text-xs text-green-600 hover:underline">Approve</button>
                          <button onClick={() => rejectMutation.mutate(r._id)} className="text-xs text-red-500 hover:underline">Reject</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {records.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-gray-400">No records</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Assign Acting Officer">
        <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Officer</label>
            <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" value={form.officer} onChange={(e) => setForm({ ...form, officer: e.target.value })} required>
              <option value="">Select officer...</option>
              {users.map((u) => <option key={u.id} value={u.id}>{u.fullName}</option>)}
            </select>
          </div>
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Position / Role" value={form.position} onChange={(e) => setForm({ ...form, position: e.target.value })} required />
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
              <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
              <input type="date" className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} required />
            </div>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={createMutation.isPending}>Assign</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
