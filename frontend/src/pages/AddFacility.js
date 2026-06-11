import React, { useState } from 'react';
import axios from 'axios';
import { Card, GreenBtn, GoldBtn, Input, Modal, BackBtn } from '../components/UI';

export default function AddFacility() {
  const [view, setView] = useState('choose'); // choose | general | takeover
  const [form, setForm] = useState({ name: '', address: '', serialNo: '' });
  const [showModal, setShowModal] = useState(false);

  // For file uploads (General / Takeover)
  const [fileForm, setFileForm] = useState({ facilityName: '', description: '', fileName: '' });

  const submitFacility = async () => {
    try {
      await axios.post('/api/facilities', form);
      setShowModal(true);
    } catch (e) { alert('Error'); }
  };

  const submitFile = async (fileType) => {
    try {
      await axios.post('/api/files', { ...fileForm, fileType });
      setShowModal(true);
    } catch (e) { alert('Error'); }
  };

  if (view === 'choose') {
    return (
      <Card style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px', gap: '16px' }}>
        <div style={{ width: '100%', maxWidth: '340px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <GoldBtn label="General File" onClick={() => setView('general')} />
          <GreenBtn label="Take Over File" onClick={() => setView('takeover')} />
          <div style={{ borderTop: '1px solid #eee', paddingTop: '14px' }}>
            <GreenBtn label="Add New Facility" onClick={() => setView('add')} style={{ background: '#1e5c1e' }} />
          </div>
        </div>
      </Card>
    );
  }

  if (view === 'add') {
    return (
      <Card>
        <BackBtn onClick={() => setView('choose')} />
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>Add a Facility</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
          <Input placeholder="Name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
          <Input placeholder="Address" value={form.address} onChange={v => setForm({ ...form, address: v })} />
          <Input placeholder="Serial No." value={form.serialNo} onChange={v => setForm({ ...form, serialNo: v })} />
          <GreenBtn label="Add +" onClick={submitFacility} />
        </div>
        {showModal && (
          <Modal title="Facility Added">
            <GreenBtn label="Okay" onClick={() => { setShowModal(false); setView('choose'); setForm({ name: '', address: '', serialNo: '' }); }} />
          </Modal>
        )}
      </Card>
    );
  }

  if (view === 'general' || view === 'takeover') {
    return (
      <Card>
        <BackBtn onClick={() => setView('choose')} />
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px' }}>
          {view === 'general' ? 'Upload General File' : 'Upload Take Over File'}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '400px' }}>
          <Input placeholder="Facility Name" value={fileForm.facilityName} onChange={v => setFileForm({ ...fileForm, facilityName: v })} />
          <Input placeholder="File Name / Reference" value={fileForm.fileName} onChange={v => setFileForm({ ...fileForm, fileName: v })} />
          <Input placeholder="Description" value={fileForm.description} onChange={v => setFileForm({ ...fileForm, description: v })} />
          <div style={{
            padding: '24px', border: '2px dashed #ccc', borderRadius: '12px',
            textAlign: 'center', color: '#888', fontSize: '14px', cursor: 'pointer',
          }}>
            📎 Click to attach file
          </div>
          <GreenBtn label="Upload File" onClick={() => submitFile(view === 'general' ? 'general' : 'takeover')} />
        </div>
        {showModal && (
          <Modal title="File Uploaded">
            <GreenBtn label="Okay" onClick={() => { setShowModal(false); setView('choose'); }} />
          </Modal>
        )}
      </Card>
    );
  }

  return null;
}
