import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, BackBtn, GreenBtn, GoldBtn, Input, ApprovalRow, Modal, IncomingRequestCard, Loader } from '../components/UI';
import { useAuth } from '../context/AuthContext';

export default function RequestVehicle({ isApprover, role }) {
  const { user } = useAuth();
  const [view, setView] = useState('main'); // main | choose | form | status | incoming | review
  const [tripType, setTripType] = useState('');
  const [form, setForm] = useState({
    name: user?.name || '', uniqueId: user?.staffId || '',
    divisionUnit: user?.department || '', vehicleType: '',
    purpose: '', destination: '', durationOfTrip: '',
    dateOfRequisition: '', departureDate: '', dateOfReturn: '',
  });
  const [showModal, setShowModal] = useState(false);
  const [showVehicleModal, setShowVehicleModal] = useState(false);
  const [myRequests, setMyRequests] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/vehicles');
      if (isApprover) {
        // Only show pending or relevant ones
        setIncomingRequests(res.data.filter(r => {
          if (role === 'rom_supervisor' || role === 'supervisor') return r.status === 'pending';
          if (role === 'cooperate') return r.supervisorApproval && !r.cooperateApproval && r.status !== 'declined';
          if (role === 'vehicle_officer') return r.cooperateApproval && !r.vehicleOfficerApproval && r.status !== 'declined';
          if (role === 'regional_coordinator') return r.supervisorApproval && !r.cooperateApproval && r.status !== 'declined';
          return false;
        }));
      } else {
        setMyRequests(res.data.filter(r => r.requesterId === user?.id || r.requesterName === user?.name));
      }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  };

  const submitRequest = async () => {
    try {
      await axios.post('/api/vehicles', { ...form, tripType });
      setShowModal(true);
    } catch (e) { alert('Error submitting request'); }
  };

  const handleApprove = async (id, type, extraData = {}) => {
    try {
      await axios.patch(`/api/vehicles/${id}/${type}-approve`, extraData);
      if (type === 'vehicle') setShowVehicleModal(true);
      loadRequests();
      setView('main');
      setSelectedRequest(null);
    } catch (e) { alert('Error'); }
  };

  const handleDecline = async (id) => {
    try {
      await axios.patch(`/api/vehicles/${id}/decline`, {});
      loadRequests();
      setView('main');
      setSelectedRequest(null);
    } catch (e) { alert('Error'); }
  };

  // Approver view - list of incoming requests
  if (isApprover && view === 'main') {
    const todayRes = incomingRequests;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
          {loading ? <Loader /> : <p style={{ color: '#888', fontSize: '14px' }}>Select a request to review</p>}
        </Card>
        <Card>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>
            Vehicles Requisition - Today
          </h3>
          {loading ? <Loader /> : todayRes.length === 0 ? (
            <p style={{ color: '#888', fontSize: '13px' }}>No pending requests</p>
          ) : (
            todayRes.map(r => (
              <div key={r._id} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '13px' }}>
                  {r.status === 'declined' ? '• Declined Request: ' :
                    r.supervisorApproval ? '• Approved Request: ' : '• Pending Request: '}
                  {r.requesterName}
                </span>
                <span
                  onClick={() => { setSelectedRequest(r); setView('review'); }}
                  style={{ color: '#2d7a2d', fontSize: '13px', fontWeight: '600', cursor: 'pointer' }}
                >
                  More Details
                </span>
              </div>
            ))
          )}
        </Card>

        {selectedRequest && view === 'review' && (
          <div style={{ gridColumn: '1/-1' }}>
            <ReviewRequest
              request={selectedRequest}
              role={role}
              onBack={() => { setView('main'); setSelectedRequest(null); }}
              onApprove={handleApprove}
              onDecline={handleDecline}
            />
          </div>
        )}
      </div>
    );
  }

  if (view === 'review' && selectedRequest) {
    return (
      <ReviewRequest
        request={selectedRequest}
        role={role}
        onBack={() => { setView('main'); setSelectedRequest(null); }}
        onApprove={handleApprove}
        onDecline={handleDecline}
      />
    );
  }

  // Staff - show incoming list for approver or trip type choice
  if (!isApprover && view === 'main') {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <Card style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '260px' }}>
          <div style={{ width: '100%', maxWidth: '300px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <GoldBtn label="Within" onClick={() => { setTripType('Within'); setView('form'); }} />
            <GreenBtn label="Out of Town" onClick={() => { setTripType('Out of Town'); setView('form'); }} />
          </div>
        </Card>
        <Card>
          <h3 style={{ fontSize: '15px', fontWeight: '700', marginBottom: '16px' }}>Vehicles Requisition - Today</h3>
          {loading ? <Loader /> : myRequests.length === 0 ? (
            <p style={{ color: '#888', fontSize: '13px' }}>No requests submitted today</p>
          ) : (
            myRequests.map(r => (
              <div key={r._id} style={{ marginBottom: '8px', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                <span>{r.status === 'vehicle_approved' ? '• Approved' : r.status === 'declined' ? '• Declined' : '• Pending'}: {r.tripType}</span>
                <span
                  onClick={() => {
                    setSelectedRequest(r);
                    if (r.vehicleOfficerApproval) setShowVehicleModal(true);
                    setView('status');
                  }}
                  style={{ color: '#2d7a2d', fontWeight: '600', cursor: 'pointer' }}
                >More Details</span>
              </div>
            ))
          )}
        </Card>
      </div>
    );
  }

  if (view === 'form') {
    return (
      <Card>
        <BackBtn onClick={() => setView('main')} />
        <h3 style={{ fontSize: '15px', fontWeight: '600', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #eee' }}>
          Fill out the form below
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {[
            ['Name', 'name'], ['Unique ID', 'uniqueId'],
            ['Division / Unit', 'divisionUnit'], ['Vehicle Type', 'vehicleType'],
            ['Purpose', 'purpose'], ['Destination', 'destination'],
            ['Duration of Trip', 'durationOfTrip'], ['Date of Requisition', 'dateOfRequisition'],
            ['Departure Date', 'departureDate'], ['Date of Return', 'dateOfReturn'],
          ].map(([label, key]) => (
            <Input
              key={key}
              placeholder={label}
              value={form[key]}
              onChange={v => setForm({ ...form, [key]: v })}
              type={key.includes('Date') || key.includes('date') ? 'date' : 'text'}
            />
          ))}
        </div>
        <div style={{ marginTop: '24px', maxWidth: '340px' }}>
          <GoldBtn label="Request Access" onClick={submitRequest} />
        </div>

        {showModal && (
          <Modal title="Request Sent">
            <GreenBtn label="Okay" onClick={() => { setShowModal(false); setView('status'); }} />
          </Modal>
        )}
      </Card>
    );
  }

  if (view === 'status') {
    const r = selectedRequest || myRequests[0];
    return (
      <Card>
        <BackBtn onClick={() => setView('main')} />
        <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '6px' }}>Request Vehicle</h3>
        <div style={{ borderBottom: '1px solid #eee', marginBottom: '20px' }} />
        <p style={{ textAlign: 'center', color: '#444', marginBottom: '20px', fontSize: '14px' }}>
          Your request have been sent!<br />Kindly wait for approval.
        </p>
        <ApprovalRow label="Supervisor Approval" checked={r?.supervisorApproval} />
        <ApprovalRow label={r?.tripType === 'Out of Town' ? 'Regional Coordinator' : 'Cooperate Approval'} checked={r?.cooperateApproval} />
        <ApprovalRow label="Vehicle officer Approval" checked={r?.vehicleOfficerApproval} />

        {r?.vehicleOfficerApproval && showVehicleModal && (
          <Modal title="Your Vehicle is on the way!">
            <p style={{ color: '#666', fontSize: '14px', marginBottom: '20px' }}>
              Your Vehicle is on its way.<br />Driver: {r?.assignedDriver || 'Assigned'}
            </p>
            <GreenBtn label="Okay" onClick={() => setShowVehicleModal(false)} />
          </Modal>
        )}

        {r?.vehicleOfficerApproval && !showVehicleModal && (
          <p style={{ textAlign: 'center', color: '#2d7a2d', fontWeight: '600', marginTop: '20px', fontSize: '14px' }}>
            ✓ Your vehicle is on its way! Driver: {r?.assignedDriver || 'Assigned'}
          </p>
        )}
      </Card>
    );
  }

  return null;
}

function ReviewRequest({ request, role, onBack, onApprove, onDecline }) {
  const [driverName, setDriverName] = useState('');
  const approveType = role === 'rom_supervisor' || role === 'supervisor' ? 'supervisor'
    : role === 'cooperate' || role === 'regional_coordinator' ? 'cooperate'
    : 'vehicle';

  const fields = [
    ['Requester', request.requesterName],
    ['Staff ID', request.uniqueId],
    ['Division / Unit', request.divisionUnit],
    ['Trip Type', request.tripType],
    ['Vehicle Type', request.vehicleType || '—'],
    ['Purpose', request.purpose || '—'],
    ['Destination', request.destination || '—'],
    ['Duration', request.durationOfTrip || '—'],
    ['Departure Date', request.departureDate ? new Date(request.departureDate).toLocaleDateString() : '—'],
    ['Return Date', request.dateOfReturn ? new Date(request.dateOfReturn).toLocaleDateString() : '—'],
  ];

  const canApprove =
    (role === 'supervisor' || role === 'rom_supervisor') && request.status === 'pending' ? true
    : (role === 'cooperate' || role === 'regional_coordinator') && request.supervisorApproval && !request.cooperateApproval && request.status !== 'declined' ? true
    : role === 'vehicle_officer' && request.cooperateApproval && !request.vehicleOfficerApproval && request.status !== 'declined' ? true
    : false;

  return (
    <Card>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '12px',
        padding: '14px 18px', borderRadius: '12px', background: '#e8f5e8',
        marginBottom: '20px',
      }}>
        <div style={{ width: '34px', height: '34px', background: '#2d7a2d', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M12 2L12 16M12 16L7 11M12 16L17 11"/>
            <rect x="3" y="18" width="18" height="3" rx="1"/>
          </svg>
        </div>
        <div>
          <div style={{ fontWeight: '600', fontSize: '14px' }}>Incoming Request</div>
          <div style={{ fontSize: '12px', color: '#666' }}>From {request.requesterName}</div>
        </div>
      </div>

      <BackBtn onClick={onBack} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px', maxWidth: '440px' }}>
        {fields.map(([label, val]) => (
          <div key={label} style={{ padding: '11px 16px', borderRadius: '10px', background: '#ebebeb', fontSize: '14px' }}>
            <span style={{ fontWeight: '600', color: '#555' }}>{label}:</span> {val}
          </div>
        ))}
        <ApprovalRow label="Supervisor Approval" checked={request.supervisorApproval} />
        <ApprovalRow label="Corporate Approval" checked={request.cooperateApproval} />
        <ApprovalRow label="Vehicle Officer Approval" checked={request.vehicleOfficerApproval} />
      </div>

      {canApprove && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '400px' }}>
          {role === 'vehicle_officer' && (
            <Input
              placeholder="Assign Driver Name"
              value={driverName}
              onChange={v => setDriverName(v)}
            />
          )}
          <GreenBtn
            label="Approve"
            onClick={() => {
              if (role === 'vehicle_officer' && !driverName.trim()) {
                alert('Please enter the driver name before approving.');
                return;
              }
              onApprove(request._id, approveType, role === 'vehicle_officer' ? { assignedDriver: driverName } : {});
            }}
          />
          <button onClick={() => onDecline(request._id)} style={{
            padding: '13px', background: '#e53935', color: '#fff', border: 'none',
            borderRadius: '30px', fontSize: '15px', fontWeight: '600', cursor: 'pointer',
          }}>Decline</button>
        </div>
      )}
    </Card>
  );
}
