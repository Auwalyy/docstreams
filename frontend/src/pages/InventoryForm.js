import React, { useState } from 'react';
import axios from 'axios';
import { Card, GreenBtn, Input, Modal } from '../components/UI';
import { useAuth } from '../context/AuthContext';

const defaultChecklist = [
  'Fire Extinguisher', 'Safety Signs', 'First Aid Kit',
  'Emergency Exit', 'CCTV Operational', 'Dispensing Pumps', 'Storage Tanks',
];

export default function InventoryForm() {
  const { user } = useAuth();
  const [facilityName, setFacilityName] = useState('');
  const [items, setItems] = useState([{ name: '', quantity: '', condition: '' }]);
  const [checklist, setChecklist] = useState(defaultChecklist.map(i => ({ item: i, status: false })));
  const [showModal, setShowModal] = useState(false);

  const addItem = () => setItems([...items, { name: '', quantity: '', condition: '' }]);

  const updateItem = (idx, field, val) => {
    const updated = [...items];
    updated[idx][field] = val;
    setItems(updated);
  };

  const toggleCheck = (idx) => {
    const updated = [...checklist];
    updated[idx].status = !updated[idx].status;
    setChecklist(updated);
  };

  const submit = async () => {
    try {
      await axios.post('/api/inventory', { facilityName, items, checklistItems: checklist });
      setShowModal(true);
    } catch (e) { alert('Error submitting form'); }
  };

  return (
    <Card>
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #eee' }}>
        Inventory / Checklist Form
      </h3>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ fontSize: '13px', color: '#666', marginBottom: '6px', display: 'block' }}>Facility Name</label>
        <Input placeholder="Enter facility name" value={facilityName} onChange={setFacilityName} />
      </div>

      <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '14px' }}>Inventory Items</h4>
      {items.map((item, idx) => (
        <div key={idx} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '10px', marginBottom: '10px' }}>
          <Input placeholder="Item name" value={item.name} onChange={v => updateItem(idx, 'name', v)} />
          <Input placeholder="Qty" value={item.quantity} onChange={v => updateItem(idx, 'quantity', v)} />
          <Input placeholder="Condition" value={item.condition} onChange={v => updateItem(idx, 'condition', v)} />
        </div>
      ))}
      <button onClick={addItem} style={{
        padding: '8px 16px', background: 'transparent', border: '1.5px solid #2d7a2d',
        color: '#2d7a2d', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', marginBottom: '24px',
      }}>+ Add Item</button>

      <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '14px' }}>Safety Checklist</h4>
      {checklist.map((c, idx) => (
        <div
          key={idx}
          onClick={() => toggleCheck(idx)}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '12px 16px', borderRadius: '10px', marginBottom: '8px',
            background: c.status ? '#e8f5e8' : '#ebebeb', cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '14px' }}>{c.item}</span>
          <div style={{
            width: '22px', height: '22px', borderRadius: '50%',
            background: c.status ? '#2d7a2d' : '#ccc',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {c.status && (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
          </div>
        </div>
      ))}

      <div style={{ marginTop: '24px', maxWidth: '300px' }}>
        <GreenBtn label="Submit Form" onClick={submit} />
      </div>

      {showModal && (
        <Modal title="Form Submitted">
          <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
            Inventory/checklist form submitted successfully.
          </p>
          <GreenBtn label="Okay" onClick={() => setShowModal(false)} />
        </Modal>
      )}
    </Card>
  );
}
