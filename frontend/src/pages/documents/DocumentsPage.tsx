import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Download, FileText } from 'lucide-react';
import api from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { formatDate } from '../../lib/utils';
import type { Facility } from '../../types';

interface DocRecord { _id: string; title: string; fileUrl: string; fileType: string; category: string; facility: { name: string }; uploadedBy: { fullName: string }; createdAt: string; }

export default function DocumentsPage() {
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [form, setForm] = useState({ title: '', category: 'general', facility: '' });

  const { data: docs = [], isLoading } = useQuery<DocRecord[]>({
    queryKey: ['documents'],
    queryFn: () => api.get('/documents').then((r) => r.data),
  });

  const { data: facilities = [] } = useQuery<Facility[]>({
    queryKey: ['facilities'],
    queryFn: () => api.get('/facilities').then((r) => r.data),
  });

  const uploadMutation = useMutation({
    mutationFn: () => {
      const fd = new FormData();
      fd.append('file', file!);
      fd.append('title', form.title);
      fd.append('category', form.category);
      fd.append('facility', form.facility);
      return api.post('/documents', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['documents'] }); setOpen(false); setFile(null); setForm({ title: '', category: 'general', facility: '' }); },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Documents</h1>
        <Button onClick={() => setOpen(true)}><Plus size={16} className="mr-2" />Upload</Button>
      </div>

      <Card>
        {isLoading ? <p className="text-gray-400 text-sm">Loading...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500 text-xs uppercase">
                  <th className="pb-3 pr-4">Title</th>
                  <th className="pb-3 pr-4">Facility</th>
                  <th className="pb-3 pr-4">Category</th>
                  <th className="pb-3 pr-4">Uploaded By</th>
                  <th className="pb-3 pr-4">Date</th>
                  <th className="pb-3">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {docs.map((d) => (
                  <tr key={d._id} className="hover:bg-gray-50">
                    <td className="py-3 pr-4 font-medium text-gray-800 flex items-center gap-2"><FileText size={14} className="text-green-500" />{d.title}</td>
                    <td className="py-3 pr-4 text-gray-600">{d.facility?.name}</td>
                    <td className="py-3 pr-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${d.category === 'takeover' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>{d.category}</span>
                    </td>
                    <td className="py-3 pr-4 text-gray-600">{d.uploadedBy?.fullName}</td>
                    <td className="py-3 pr-4 text-gray-500">{formatDate(d.createdAt)}</td>
                    <td className="py-3">
                      <a href={d.fileUrl} target="_blank" rel="noreferrer" className="text-green-600 hover:underline text-xs flex items-center gap-1"><Download size={12} />View</a>
                    </td>
                  </tr>
                ))}
                {docs.length === 0 && <tr><td colSpan={6} className="py-8 text-center text-gray-400">No documents</td></tr>}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal isOpen={open} onClose={() => setOpen(false)} title="Upload Document">
        <form onSubmit={(e) => { e.preventDefault(); uploadMutation.mutate(); }} className="space-y-4">
          <input className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500" placeholder="Document Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
            <option value="general">General</option>
            <option value="takeover">Takeover</option>
          </select>
          <select className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white" value={form.facility} onChange={(e) => setForm({ ...form, facility: e.target.value })} required>
            <option value="">Select facility...</option>
            {facilities.map((f) => <option key={f._id} value={f._id}>{f.name}</option>)}
          </select>
          <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
            <input type="file" className="hidden" id="file-input" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
            <label htmlFor="file-input" className="cursor-pointer text-sm text-green-600 hover:underline">
              {file ? file.name : 'Click to select file (PDF, Excel, Word, Image)'}
            </label>
          </div>
          <div className="flex gap-3 justify-end">
            <Button variant="secondary" type="button" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" isLoading={uploadMutation.isPending} disabled={!file}>Upload</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
