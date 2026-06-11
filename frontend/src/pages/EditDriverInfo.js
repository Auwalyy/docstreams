import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, GreenBtn, BackBtn, Input, Loader } from '../components/UI';

export default function EditDriverInfo() {
  const [requests, setRequests] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editField, setEditField] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/vehicles').then(res => {
      setRequests(res.data.filter(r => r.vehicleOfficerApproval));
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const saveEdit = async () => {
    try {
      await axios.patch(`/api/vehicles/${selected._id}/edit`, { [editField]: editValue });
      setEditField(null);
      setEditValue('');
    } catch (e) { alert('Error saving'); }
  };

  if (!selected) {
    return (
      <Card>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Approved Vehicle Requests</h3>
        {loading ? <Loader /> : requests.length === 0 ? (
          <p style={{ color: '#888' }}>No approved requests yet.</p>
        ) : (
          requests.map(r => (
            <div
              key={r._id}
              onClick={() => setSelected(r)}
              style={{
                padding: '14px 18px', borderRadius: '10px', background: '#f5f5f5',
                marginBottom: '10px', cursor: 'pointer',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: '500' }}>{r.requesterName}</span>
              <span style={{ fontSize: '12px', color: '#888' }}>
                {new Date(r.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          ))
        )}
      </Card>
    );
  }

  return (
    <Card>
      <BackBtn onClick={() => setSelected(null)} />
      <p style={{ color: '#2d7a2d', fontWeight: '600', fontSize: '14px', marginBottom: '20px' }}>
        Date Requested: {new Date(selected.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
      </p>

      {[
        { label: 'Name & ID of Assigned Driver', field: 'assignedDriver', value: selected.assignedDriver || 'Not assigned' },
        { label: 'Destination', field: 'destination', value: selected.destination || selected.tripType },
        { label: 'Duration', field: 'durationOfTrip', value: selected.durationOfTrip || '—' },
      ].map(({ label, field, value }) => (
        <div key={field} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 18px', borderRadius: '10px', background: '#ebebeb',
          marginBottom: '10px',
        }}>
          <span style={{ fontSize: '14px' }}>{label}: {value}</span>
          <button onClick={() => { setEditField(field); setEditValue(value); }} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: '#2d7a2d',
          }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
        </div>
      ))}

      {editField && (
        <div style={{ marginTop: '20px', maxWidth: '400px' }}>
          <label style={{ fontSize: '13px', color: '#666', marginBottom: '6px', display: 'block' }}>
            Editing: {editField}
          </label>
          <Input placeholder="New value" value={editValue} onChange={setEditValue} />
          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <GreenBtn label="Save" onClick={saveEdit} />
            <button onClick={() => setEditField(null)} style={{
              padding: '13px', flex: 1, background: '#ebebeb', border: 'none',
              borderRadius: '30px', cursor: 'pointer', fontWeight: '600',
            }}>Cancel</button>
          </div>
        </div>
      )}
    </Card>
  );
}
