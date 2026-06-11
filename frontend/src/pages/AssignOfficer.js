import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, GreenBtn, BackBtn, Loader } from '../components/UI';

export default function AssignOfficer() {
  const [officers, setOfficers] = useState([]);
  const [assigned, setAssigned] = useState(null);
  const [view, setView] = useState('list');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/users/eligible')
      .then(res => setOfficers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAssign = async (officer) => {
    try {
      await axios.patch(`/api/users/${officer._id}`, { role: 'regional_coordinator' });
      setAssigned(officer);
      setView('done');
    } catch (e) { alert('Error assigning'); }
  };

  if (view === 'done') {
    return (
      <Card>
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
          <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '8px' }}>Officer Assigned</h3>
          <p style={{ color: '#666', marginBottom: '24px' }}>
            {assigned?.name} is now acting as Regional Coordinator
          </p>
          <div style={{ maxWidth: '200px', margin: '0 auto' }}>
            <GreenBtn label="Back" onClick={() => setView('list')} />
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #eee' }}>
        List of Eligible Officers
      </h3>
      {loading ? <Loader /> : officers.length === 0 ? (
        <p style={{ color: '#888' }}>No eligible officers found.</p>
      ) : (
        officers.map(o => (
          <div key={o._id} style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 140px 100px',
            alignItems: 'center', gap: '16px',
            padding: '16px 0', borderBottom: '1px solid #f0f0f0',
          }}>
            <span style={{ fontSize: '14px' }}>{o.name}</span>
            <span style={{ fontSize: '13px', color: '#666' }}>Senior Manager</span>
            <div style={{
              padding: '6px 14px', borderRadius: '20px',
              background: o.isActive ? '#e8f5e8' : '#ffebee',
              color: o.isActive ? '#2d7a2d' : '#c62828',
              fontSize: '13px', fontWeight: '600', textAlign: 'center',
            }}>
              {o.isActive ? 'Active' : 'On Leave'}
            </div>
            <button
              onClick={() => o.isActive && handleAssign(o)}
              disabled={!o.isActive}
              style={{
                padding: '8px 16px', background: o.isActive ? '#2d7a2d' : '#ccc',
                color: '#fff', border: 'none', borderRadius: '8px',
                cursor: o.isActive ? 'pointer' : 'not-allowed',
                fontSize: '13px', fontWeight: '600',
              }}
            >Assign</button>
          </div>
        ))
      )}
    </Card>
  );
}
