import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, GreenBtn, Input, Modal, StatusBadge, Loader } from '../components/UI';
import { useAuth } from '../context/AuthContext';

export default function RequestItems() {
  const { user } = useAuth();
  const [items, setItems] = useState([{ name: '', quantity: '', reason: '' }]);
  const [showModal, setShowModal] = useState(false);
  const [myRequests, setMyRequests] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const isApprover = ['rom_supervisor', 'supervisor', 'ict'].includes(user?.role);

  useEffect(() => { loadRequests(); }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/items');
      if (isApprover) setAllRequests(res.data);
      else setMyRequests(res.data);
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const addItem = () => setItems([...items, { name: '', quantity: '', reason: '' }]);

  const updateItem = (idx, field, val) => {
    const updated = [...items];
    updated[idx][field] = val;
    setItems(updated);
  };

  const submit = async () => {
    try {
      await axios.post('/api/items', { items });
      setShowModal(true);
      setItems([{ name: '', quantity: '', reason: '' }]);
      loadRequests();
    } catch (e) { alert('Error'); }
  };

  const handleAction = async (id, action) => {
    try {
      await axios.patch(`/api/items/${id}/${action}`, {});
      loadRequests();
    } catch (e) { alert('Error'); }
  };

  if (isApprover) {
    return (
      <Card>
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Item Requests</h3>
        {loading ? <Loader /> : allRequests.length === 0 ? (
          <p style={{ color: '#888' }}>No item requests yet.</p>
        ) : (
          allRequests.map(r => (
            <div key={r._id} style={{
              padding: '16px', borderRadius: '12px', background: '#f9f9f9',
              marginBottom: '12px', border: '1px solid #eee',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontWeight: '600', fontSize: '14px' }}>{r.requesterName}</span>
                <StatusBadge status={r.status} />
              </div>
              {r.items?.map((item, i) => (
                <div key={i} style={{ fontSize: '13px', color: '#555', marginBottom: '4px' }}>
                  • {item.name} × {item.quantity} — {item.reason}
                </div>
              ))}
              {r.status === 'pending' && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                  <button onClick={() => handleAction(r._id, 'approve')} style={{
                    padding: '8px 20px', background: '#2d7a2d', color: '#fff',
                    border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                  }}>Approve</button>
                  <button onClick={() => handleAction(r._id, 'decline')} style={{
                    padding: '8px 20px', background: '#e53935', color: '#fff',
                    border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '13px', fontWeight: '600',
                  }}>Decline</button>
                </div>
              )}
            </div>
          ))
        )}
      </Card>
    );
  }

  return (
    <Card>
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #eee' }}>
        Request Items
      </h3>

      {items.map((item, idx) => (
        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 2fr', gap: '10px', marginBottom: '10px' }}>
          <Input placeholder="Item name" value={item.name} onChange={v => updateItem(idx, 'name', v)} />
          <Input placeholder="Qty" value={item.quantity} onChange={v => updateItem(idx, 'quantity', v)} />
          <Input placeholder="Reason" value={item.reason} onChange={v => updateItem(idx, 'reason', v)} />
        </div>
      ))}

      <button onClick={addItem} style={{
        padding: '8px 16px', background: 'transparent', border: '1.5px solid #2d7a2d',
        color: '#2d7a2d', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', marginBottom: '24px',
      }}>+ Add Item</button>

      <div style={{ maxWidth: '300px' }}>
        <GreenBtn label="Submit Request" onClick={submit} />
      </div>

      {!loading && myRequests.length > 0 && (
        <div style={{ marginTop: '28px' }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>My Requests</h4>
          {myRequests.map(r => (
            <div key={r._id} style={{
              padding: '12px 16px', borderRadius: '10px', background: '#f5f5f5',
              marginBottom: '8px', display: 'flex', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: '13px' }}>{r.items?.map(i => i.name).join(', ')}</span>
              <StatusBadge status={r.status} />
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title="Request Sent">
          <GreenBtn label="Okay" onClick={() => setShowModal(false)} />
        </Modal>
      )}
    </Card>
  );
}
