import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import api from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { formatDate } from '../../lib/utils';
import type { InventoryReport } from '../../types';

const emptyEntry = { outletName: '', outletAddress: '', openingPmsStock: 0, productReceived: 0, pumpPrice: 0, pumpDispensingLevel: 0 };

export default function InventoryPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [entries, setEntries] = useState([{ ...emptyEntry }]);

  const { data: reports = [], isLoading } = useQuery<InventoryReport[]>({
    queryKey: ['inventory'],
    queryFn: () => api.get('/inventory').then((r) => r.data),
  });

  const createMutation = useMutation({
    mutationFn: () => api.post('/inventory', { entries }),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['inventory'] }); setOpen(false); setEntries([{ ...emptyEntry }]); },
  });

  const exportToExcel = (report: InventoryReport) => {
    const ws = XLSX.utils.json_to_sheet(report.entries);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Inventory');
    const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([buf], { type: 'application/octet-stream' }), `inventory-${report._id}.xlsx`);
  };

  const updateEntry = (i: number, field: string, value: string | number) => {
    const n = [...entries];
    (n[i] as any)[field] = value;
    setEntries(n);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Inventory Reports</h1>
        <Button onClick={() => setOpen(true)}><Plus size={16} className="mr-2" />New Report</Button>
      </div>

      <Card>
        {isLoading ? <p className="text-gray-400 text-sm">Loading...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500 text-xs uppercase">
                  <th className="pb-3 pr-4">Created By</th>
                  <th className="pb-3 pr-4">Entries</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3">Export</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {reports.map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50">
                    <td className="py-3 pr-4 font-medium text-gray-800">{r.createdBy?.fullName}</td>
                    <td className="py-3 pr-4 text-gray-600">{r.entries.length} outlet(s)</td>
                    <td className="py-3 pr-4 text-gray-500">{formatDate(r.createdAt)}</td>
                    <td className="py-3">
                      <button onClick={() => exportToExcel(r)} className="text-green-600 hover:underline text-xs flex items-center gap-1"><Download size={12} />Excel</button>
                    </td>
                  </tr>
                ))}
                {reports.length === 0 && <tr><td colSpan={4} className="py-8 text-center text-gray-400">No reports</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="New Inventory Report">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-700">Outlets</p>
            <button onClick={() => setEntries([...entries, { ...emptyEntry }])} className="text-green-600 text-xs hover:underline flex items-center gap-1"><Plus size={12} />Add Outlet</button>
          </div>
          {entries.map((e, i) => (
            <div key={i} className="border border-gray-100 rounded-lg p-3 space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium text-gray-600">Outlet {i + 1}</span>
                {i > 0 && <button onClick={() => setEntries(entries.filter((_, j) => j !== i))}><Trash2 size={14} className="text-red-400" /></button>}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <input className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs" placeholder="Outlet Name" value={e.outletName} onChange={(ev) => updateEntry(i, 'outletName', ev.target.value)} />
                <input className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs" placeholder="Outlet Address" value={e.outletAddress} onChange={(ev) => updateEntry(i, 'outletAddress', ev.target.value)} />
                <input type="number" className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs" placeholder="Opening PMS Stock" value={e.openingPmsStock} onChange={(ev) => updateEntry(i, 'openingPmsStock', Number(ev.target.value))} />
                <input type="number" className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs" placeholder="Product Received" value={e.productReceived} onChange={(ev) => updateEntry(i, 'productReceived', Number(ev.target.value))} />
                <input type="number" className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs" placeholder="Pump Price" value={e.pumpPrice} onChange={(ev) => updateEntry(i, 'pumpPrice', Number(ev.target.value))} />
                <input type="number" className="border border-gray-300 rounded-lg px-2 py-1.5 text-xs" placeholder="Dispensing Level" value={e.pumpDispensingLevel} onChange={(ev) => updateEntry(i, 'pumpDispensingLevel', Number(ev.target.value))} />
              </div>
            </div>
          ))}
          <div className="flex gap-3 justify-end pt-2">
            <Button variant="secondary" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button onClick={() => createMutation.mutate()} isLoading={createMutation.isPending}>Save Report</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
