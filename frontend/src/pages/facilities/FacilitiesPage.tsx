import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Search } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { formatDate } from '../../lib/utils';
import type { Facility } from '../../types';

export default function FacilitiesPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: '', address: '', serialNumber: '', takeoverInfo: '' });

  const { data: facilities = [], isLoading } = useQuery<Facility[]>({
    queryKey: ['facilities', search],
    queryFn: () => api.get(`/facilities${search ? `?search=${search}` : ''}`).then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: (data: typeof form) => api.post('/facilities', data),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['facilities'] }); setOpen(false); setForm({ name: '', address: '', serialNumber: '', takeoverInfo: '' }); },
  });

  const canManage = user?.role === 'ict_admin' || user?.role === 'rom_supervisor';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Facilities</h1>
        {canManage && <Button onClick={() => setOpen(true)}><Plus size={16} className="mr-2" />Add Facility</Button>}
      </div>

      <div className="relative max-w-sm">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
          placeholder="Search by name, serial, address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <Card>
        {isLoading ? (
          <p className="text-gray-400 text-sm">Loading...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500 text-xs uppercase">
                  <th className="pb-3 pr-4">Facility Name</th>
                  <th className="pb-3 pr-4">Address</th>
                  <th className="pb-3 pr-4">Serial No.</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Added</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {facilities.map((f) => (
                  <tr key={f._id} className="hover:bg-gray-50">
                    <td className="py-3 pr-4 font-medium text-gray-800">{f.name}</td>
                    <td className="py-3 pr-4 text-gray-600">{f.address}</td>
                    <td className="py-3 pr-4 text-gray-600">{f.serialNumber}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${f.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {f.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-3 text-gray-500">{formatDate(f.createdAt)}</td>
                  </tr>
                ))}
                {facilities.length === 0 && (
                  <tr><td colSpan={5} className="py-8 text-center text-gray-400">No facilities found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Add Facility">
        <form onSubmit={(e) => { e.preventDefault(); createMutation.mutate(form); }} className="space-y-4">
          <Input label="Facility Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <Input label="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required />
          <Input label="Serial Number" value={form.serialNumber} onChange={(e) => setForm({ ...form, serialNumber: e.target.value })} required />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Takeover Info (optional)</label>
            <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" rows={3} value={form.takeoverInfo} onChange={(e) => setForm({ ...form, takeoverInfo: e.target.value })} />
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={createMutation.isPending}>Save</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
