import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, GreenBtn, Input, Modal, Loader } from '../components/UI';

const ROLES = ['staff', 'rom_supervisor', 'cooperate', 'vehicle_officer', 'regional_coordinator', 'supervisor', 'ict'];
const ROLE_LABELS = {
  staff: 'Staff', rom_supervisor: 'ROM Supervisor', cooperate: 'Corporate',
  vehicle_officer: 'Vehicle Officer', regional_coordinator: 'Regional Coordinator',
  supervisor: 'Supervisor', ict: 'ICT',
};

export default function StaffManagement() {
  const [users, setUsers] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ staffId: '', name: '', email: '', department: '', role: 'staff' });
  const [editForm, setEditForm] = useState({});
  const [showSuccess, setShowSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadUsers(); }, []);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/users');
      setUsers(res.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const addStaff = async () => {
    try {
      await axios.post('/api/users', form);
      setShowAdd(false);
      setForm({ staffId: '', name: '', email: '', department: '', role: 'staff' });
      setShowSuccess('Staff added! Default password: password123');
      loadUsers();
    } catch (e) { alert(e.response?.data?.message || 'Error'); }
  };

  const saveEdit = async () => {
    try {
      await axios.put(`/api/users/${editUser._id}`, editForm);
      setEditUser(null);
      loadUsers();
    } catch (e) { alert('Error updating'); }
  };

  const deactivate = async (id) => {
    if (!window.confirm('Deactivate this staff member?')) return;
    try {
      await axios.patch(`/api/users/${id}/deactivate`, {});
      loadUsers();
    } catch (e) { alert('Error'); }
  };

  const resetPassword = async (id) => {
    try {
      await axios.patch(`/api/users/${id}/reset-password`, {});
      setShowSuccess('Password reset to: password123');
    } catch (e) { alert('Error'); }
  };

  const exportCSV = () => {
    const rows = [['Name', 'Department', 'Role', 'Staff ID', 'Status']];
    users.forEach(u => rows.push([u.name, u.department, u.role, u.staffId, u.isActive ? 'Active' : 'Inactive']));
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'staff_list.csv';
    a.click();
  };

  return (
    <Card>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: '700' }}>Staff Management</h3>
        <button onClick={() => setShowAdd(true)} style={{
          padding: '10px 20px', background: '#2d7a2d', color: '#fff',
          border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600',
        }}>Add New Staff</button>
      </div>

      {loading ? <Loader /> : <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa' }}>
              {['Name', 'Department', 'Role', 'Status', '', ''].map((h, i) => (
                <th key={i} style={{
                  padding: '12px 16px', textAlign: 'left',
                  fontSize: '13px', fontWeight: '600', color: '#2d7a2d',
                  borderBottom: '1px solid #eee',
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '14px 16px', fontSize: '14px', color: '#555' }}>{u.name}</td>
                <td style={{ padding: '14px 16px', fontSize: '14px', color: '#555' }}>{u.department}</td>
                <td style={{ padding: '14px 16px', fontSize: '14px', color: '#555' }}>{ROLE_LABELS[u.role]}</td>
                <td style={{ padding: '14px 16px' }}>
                  <span style={{
                    padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
                    background: u.isActive ? '#e8f5e8' : '#ffebee',
                    color: u.isActive ? '#2d7a2d' : '#c62828',
                  }}>{u.isActive ? 'Active' : 'Inactive'}</span>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  <button onClick={() => { setEditUser(u); setEditForm({ name: u.name, department: u.department, role: u.role }); }} style={{
                    background: 'none', border: 'none', cursor: 'pointer', color: '#2d7a2d',
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                </td>
                <td style={{ padding: '14px 16px' }}>
                  {u.isActive && (
                    <button onClick={() => deactivate(u._id)} style={{
                      padding: '6px 14px', background: '#e53935', color: '#fff',
                      border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600',
                    }}>Deactivate Staff</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>}

      {/* Export */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '20px' }}>
        <button onClick={exportCSV} style={{
          padding: '10px 20px', background: '#d4a017', color: '#fff',
          border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
        }}>Export as Excel Sheet</button>
        <button onClick={exportCSV} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2d7a2d" strokeWidth="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </button>
        <button onClick={() => window.print()} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2d7a2d" strokeWidth="2">
            <polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/>
          </svg>
        </button>
      </div>

      {/* Add Staff Modal */}
      {showAdd && (
        <Modal title="Add New Staff" onClose={() => setShowAdd(false)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
            {[['Staff ID', 'staffId'], ['Full Name', 'name'], ['Email', 'email'], ['Department', 'department']].map(([p, k]) => (
              <Input key={k} placeholder={p} value={form[k]} onChange={v => setForm({ ...form, [k]: v })} />
            ))}
            <select
              value={form.role}
              onChange={e => setForm({ ...form, role: e.target.value })}
              style={{ padding: '13px 16px', borderRadius: '10px', border: 'none', background: '#ebebeb', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
            >
              {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
            </select>
            <GreenBtn label="Add Staff" onClick={addStaff} />
            <button onClick={() => setShowAdd(false)} style={{ padding: '12px', background: '#ebebeb', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: '600' }}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* Edit Modal */}
      {editUser && (
        <Modal title={`Edit: ${editUser.name}`} onClose={() => setEditUser(null)}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', textAlign: 'left' }}>
            <Input placeholder="Full Name" value={editForm.name} onChange={v => setEditForm({ ...editForm, name: v })} />
            <Input placeholder="Department" value={editForm.department} onChange={v => setEditForm({ ...editForm, department: v })} />
            <select
              value={editForm.role}
              onChange={e => setEditForm({ ...editForm, role: e.target.value })}
              style={{ padding: '13px 16px', borderRadius: '10px', border: 'none', background: '#ebebeb', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}
            >
              {ROLES.map(r => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
            </select>
            <GreenBtn label="Save Changes" onClick={saveEdit} />
            <button onClick={() => resetPassword(editUser._id)} style={{
              padding: '12px', background: '#ebebeb', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: '600',
            }}>Reset Password</button>
            <button onClick={() => setEditUser(null)} style={{ padding: '12px', background: '#ebebeb', border: 'none', borderRadius: '30px', cursor: 'pointer' }}>Cancel</button>
          </div>
        </Modal>
      )}

      {showSuccess && (
        <Modal title="Success">
          <p style={{ color: '#444', marginBottom: '20px' }}>{showSuccess}</p>
          <GreenBtn label="Okay" onClick={() => setShowSuccess('')} />
        </Modal>
      )}
    </Card>
  );
}
