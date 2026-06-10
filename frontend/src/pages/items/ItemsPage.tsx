import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2 } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../lib/utils';
import type { ItemRequest } from '../../types';

const emptyItem = { description: '', unit: '', quantity: 1, allocation: '' };

export default function ItemsPage() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ItemRequest | null>(null);
  const [actionModal, setActionModal] = useState(false);
  const [comment, setComment] = useState('');
  const [items, setItems] = useState([{ ...emptyItem }]);
  const [department, setDepartment] = useState(user?.department ?? '');

  const { data: requests = [], isLoading } = useQuery<ItemRequest[]>({
    queryKey: ['item-requests'],
    queryFn: () => api.get('/item-requests').then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: () => api.post('/item-requests', { department, items }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['item-requests'] }); setOpen(false); setItems([{ ...emptyItem }]); },
  });

  const supervisorMutation = useMutation({
    mutationFn: ({ action }: { action: string }) => api.patch(`/item-requests/${selected!._id}/supervisor`, { action, comment }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['item-requests'] }); setActionModal(false); setComment(''); },
  });

  const coordinatorMutation = useMutation({
    mutationFn: ({ action }: { action: string }) => api.patch(`/item-requests/${selected!._id}/coordinator`, { action, comment }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['item-requests'] }); setActionModal(false); setComment(''); },
  });

  const role = user?.role;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Item Requests</h1>
        {(role === 'staff' || role === 'ict_admin') && (
          <Button onClick={() => setOpen(true)}><Plus size={16} className="mr-2" />New Request</Button>
        )}
      </div>

      <Card>
        {isLoading ? <p className="text-gray-400 text-sm">Loading...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500 text-xs uppercase">
                  <th className="pb-3 pr-4">Requester</th>
                  <th className="pb-3 pr-4">Department</th>
                  <th className="pb-3 pr-4">Items</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {requests.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="py-3 pr-4 font-medium text-gray-800">{r.requester?.fullName ?? r.staffId}</td>
                    <td className="py-3 pr-4 text-gray-600">{r.department}</td>
                    <td className="py-3 pr-4 text-gray-600">{r.items.length} item(s)</td>
                    <td className="py-3 pr-4 text-gray-500">{formatDate(r.createdAt)}</td>
                    <td className="py-3 pr-4"><Badge status={r.status} /></td>
                    <td className="py-3">
                      <button onClick={() => { setSelected(r); setActionModal(true); }} className="text-green-600 hover:underline text-xs font-medium">View</button>
                    </td>
                  </tr>
                ))}
                {requests.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-gray-400">No requests</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="New Item Request">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
            <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" value={department} onChange={(e) => setDepartment(e.target.value)} required />
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Items</label>
              <button onClick={() => setItems([...items, { ...emptyItem }])} className="text-green-600 text-xs hover:underline flex items-center gap-1"><Plus size={12} />Add Row</button>
            </div>
            <div className="space-y-2">
              {items.map((item, i) => (
                <div key={i} className="grid grid-cols-5 gap-2 items-center">
                  <input className="col-span-2 border border-gray-300 rounded-lg px-2 py-1.5 text-xs" placeholder="Description" value={item.description} onChange={(e) => { const n = [...items]; n[i].description = e.target.value; setItems(n); }} />
                  <input className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs" placeholder="Unit" value={item.unit} onChange={(e) => { const n = [...items]; n[i].unit = e.target.value; setItems(n); }} />
                  <input type="number" className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs" placeholder="Qty" value={item.quantity} onChange={(e) => { const n = [...items]; n[i].quantity = Number(e.target.value); setItems(n); }} />
                  <button onClick={() => setItems(items.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate()} isLoading={createMutation.isPending}>Submit</Button>
          </div>
        </div>
      </Modal>

      {selected && (
        <Modal isOpen={actionModal} onClose={() => { setActionModal(false); setSelected(null); }} title="Item Request Details">
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-2">
              <div><span className="text-gray-500">Requester:</span> <span className="font-medium">{selected.requester?.fullName}</span></div>
              <div><span className="text-gray-500">Department:</span> <span className="font-medium">{selected.department}</span></div>
            </div>
            <table className="w-full text-xs border border-gray-100 rounded-lg overflow-hidden">
              <thead className="bg-gray-50"><tr><th className="px-3 py-2 text-left">Description</th><th className="px-3 py-2">Unit</th><th className="px-3 py-2">Qty</th><th className="px-3 py-2">Allocation</th></tr></thead>
              <tbody>
                {selected.items.map((it, i) => (
                  <tr key={i} className="border-t border-gray-100">
                    <td className="px-3 py-2">{it.description}</td>
                    <td className="px-3 py-2 text-center">{it.unit}</td>
                    <td className="px-3 py-2 text-center">{it.quantity}</td>
                    <td className="px-3 py-2">{it.allocation}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div><span className="text-gray-500">Status:</span> <Badge status={selected.status} /></div>

            {role === 'supervisor' && selected.status === 'pending' && (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={2} placeholder="Comment" value={comment} onChange={(e) => setComment(e.target.value)} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => supervisorMutation.mutate({ action: 'approve' })}>Approve</Button>
                  <Button size="sm" variant="danger" onClick={() => supervisorMutation.mutate({ action: 'reject' })}>Reject</Button>
                </div>
              </div>
            )}

            {role === 'regional_coordinator' && selected.status === 'supervisor_approved' && (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <textarea className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm" rows={2} placeholder="Comment" value={comment} onChange={(e) => setComment(e.target.value)} />
                <div className="flex gap-2">
                  <Button size="sm" onClick={() => coordinatorMutation.mutate({ action: 'approve' })}>Approve</Button>
                  <Button size="sm" variant="danger" onClick={() => coordinatorMutation.mutate({ action: 'reject' })}>Reject</Button>
                </div>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}
