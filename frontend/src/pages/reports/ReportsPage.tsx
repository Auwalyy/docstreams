import { useQuery } from '@tanstack/react-query';
import { Download } from 'lucide-react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import api from '../../lib/api';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { formatDate } from '../../lib/utils';

const exportExcel = (data: any[], filename: string) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Report');
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([buf], { type: 'application/octet-stream' }), `${filename}.xlsx`);
};

export default function ReportsPage() {
  const { data: vehicles = [] } = useQuery({ queryKey: ['report-vehicles'], queryFn: () => api.get('/reports/vehicles').then((r) => r.data) });
  const { data: items = [] } = useQuery({ queryKey: ['report-items'], queryFn: () => api.get('/reports/items').then((r) => r.data) });
  const { data: staff = [] } = useQuery({ queryKey: ['report-staff'], queryFn: () => api.get('/reports/staff').then((r) => r.data) });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Reports & Exports</h1>

      <Card title="Vehicle Requests" action={
        <Button size="sm" variant="secondary" onClick={() => exportExcel(vehicles.map((v: any) => ({ Requester: v.requester?.fullName, Department: v.department, Destination: v.destination, VehicleType: v.vehicleType, Status: v.status, Date: formatDate(v.createdAt) })), 'vehicle-requests')}>
          <Download size={14} className="mr-1" />Export
        </Button>
      }>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 text-left text-gray-500 text-xs uppercase">
              <th className="pb-2 pr-4">Requester</th><th className="pb-2 pr-4">Destination</th><th className="pb-2 pr-4">Status</th><th className="pb-2">Date</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {vehicles.slice(0, 10).map((v: any) => (
                <tr key={v._id} className="hover:bg-gray-50">
                  <td className="py-2 pr-4">{v.requester?.fullName}</td>
                  <td className="py-2 pr-4">{v.destination}</td>
                  <td className="py-2 pr-4"><Badge status={v.status} /></td>
                  <td className="py-2 text-gray-500">{formatDate(v.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Item Requests" action={
        <Button size="sm" variant="secondary" onClick={() => exportExcel(items.map((i: any) => ({ Requester: i.requester?.fullName, Department: i.department, Items: i.items.length, Status: i.status, Date: formatDate(i.createdAt) })), 'item-requests')}>
          <Download size={14} className="mr-1" />Export
        </Button>
      }>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 text-left text-gray-500 text-xs uppercase">
              <th className="pb-2 pr-4">Requester</th><th className="pb-2 pr-4">Department</th><th className="pb-2 pr-4">Items</th><th className="pb-2 pr-4">Status</th><th className="pb-2">Date</th>
            </tr></thead>
            <tbody className="divide-y divide-gray-50">
              {items.slice(0, 10).map((i: any) => (
                <tr key={i._id} className="hover:bg-gray-50">
                  <td className="py-2 pr-4">{i.requester?.fullName}</td>
                  <td className="py-2 pr-4">{i.department}</td>
                  <td className="py-2 pr-4">{i.items.length}</td>
                  <td className="py-2 pr-4"><Badge status={i.status} /></td>
                  <td className="py-2 text-gray-500">{formatDate(i.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Staff Directory" action={
        <Button size="sm" variant="secondary" onClick={() => exportExcel(staff.map((s: any) => ({ Name: s.fullName, StaffID: s.staffId, Department: s.department, Role: s.role, Status: s.isActive ? 'Active' : 'Inactive' })), 'staff')}>
          <Download size={14} className="mr-1" />Export
        </Button>
      }>
        <p className="text-sm text-gray-500">{staff.length} staff member(s) total</p>
      </Card>
    </div>
  );
}
