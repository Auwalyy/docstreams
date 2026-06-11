import React from 'react';

export function Modal({ title, children, onClose }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000,
    }}>
      <div style={{
        background: '#fff', borderRadius: '16px', padding: '32px',
        minWidth: '320px', maxWidth: '480px', width: '90%',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        textAlign: 'center',
      }}>
        {title && <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px' }}>{title}</h3>}
        {children}
      </div>
    </div>
  );
}

export function GreenBtn({ label, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      padding: '13px 24px', background: '#2d7a2d', color: '#fff',
      border: 'none', borderRadius: '30px', fontSize: '15px', fontWeight: '600',
      cursor: 'pointer', fontFamily: 'Inter, sans-serif', width: '100%', ...style,
    }}>{label}</button>
  );
}

export function GoldBtn({ label, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      padding: '13px 24px', background: '#d4a017', color: '#fff',
      border: 'none', borderRadius: '30px', fontSize: '15px', fontWeight: '600',
      cursor: 'pointer', fontFamily: 'Inter, sans-serif', width: '100%', ...style,
    }}>{label}</button>
  );
}

export function RedBtn({ label, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      padding: '13px 24px', background: '#e53935', color: '#fff',
      border: 'none', borderRadius: '30px', fontSize: '15px', fontWeight: '600',
      cursor: 'pointer', fontFamily: 'Inter, sans-serif', width: '100%', ...style,
    }}>{label}</button>
  );
}

export function OutlineBtn({ label, onClick, style = {} }) {
  return (
    <button onClick={onClick} style={{
      padding: '13px 24px', background: 'transparent', color: '#2d7a2d',
      border: '1.5px solid #2d7a2d', borderRadius: '30px', fontSize: '15px', fontWeight: '600',
      cursor: 'pointer', fontFamily: 'Inter, sans-serif', width: '100%', ...style,
    }}>{label}</button>
  );
}

export function Input({ placeholder, value, onChange, type = 'text', style = {} }) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{
        width: '100%', padding: '13px 16px', borderRadius: '10px',
        border: 'none', background: '#ebebeb', fontSize: '14px',
        color: '#333', outline: 'none', fontFamily: 'Inter, sans-serif', ...style,
      }}
    />
  );
}

export function Card({ children, style = {} }) {
  return (
    <div style={{
      background: '#fff', borderRadius: '14px', padding: '28px',
      boxShadow: '0 2px 12px rgba(0,0,0,0.06)', ...style,
    }}>
      {children}
    </div>
  );
}

export function BackBtn({ onClick }) {
  return (
    <button onClick={onClick} style={{
      width: '34px', height: '34px', borderRadius: '50%',
      border: '1.5px solid #ccc', background: '#fff',
      cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
      marginBottom: '16px',
    }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2.5">
        <polyline points="15 18 9 12 15 6"/>
      </svg>
    </button>
  );
}

export function InfoField({ label, value, highlight }) {
  return (
    <div style={{ marginBottom: '12px' }}>
      {label && <div style={{ fontSize: '12px', color: '#888', marginBottom: '4px' }}>{label}</div>}
      <div style={{
        padding: '13px 16px', borderRadius: '10px',
        background: highlight ? '#2d7a2d' : '#ebebeb',
        color: highlight ? '#fff' : '#333', fontSize: '14px',
      }}>{value || '—'}</div>
    </div>
  );
}

export function StatusBadge({ status }) {
  const map = {
    pending: { bg: '#fff3e0', color: '#e65100', label: 'Pending' },
    supervisor_approved: { bg: '#e8f5e9', color: '#2e7d32', label: 'Supervisor Approved' },
    cooperate_approved: { bg: '#e8f5e9', color: '#2e7d32', label: 'Corporate Approved' },
    vehicle_approved: { bg: '#e8f5e9', color: '#2e7d32', label: 'Fully Approved' },
    declined: { bg: '#ffebee', color: '#c62828', label: 'Declined' },
    completed: { bg: '#e8f5e9', color: '#2e7d32', label: 'Completed' },
    approved: { bg: '#e8f5e9', color: '#2e7d32', label: 'Approved' },
  };
  const s = map[status] || { bg: '#f0f0f0', color: '#666', label: status };
  return (
    <span style={{
      padding: '4px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '600',
      background: s.bg, color: s.color,
    }}>{s.label}</span>
  );
}

export function ApprovalRow({ label, checked }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 18px', borderRadius: '10px', marginBottom: '10px',
      background: checked ? '#2d7a2d' : '#ebebeb',
      color: checked ? '#fff' : '#333',
    }}>
      <span style={{ fontWeight: '500', fontSize: '14px' }}>{label}</span>
      <div style={{
        width: '26px', height: '26px', borderRadius: '50%',
        background: checked ? '#1a5c1a' : '#aaa',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      </div>
    </div>
  );
}

export function Loader() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 0', gap: '14px' }}>
      <div style={{
        width: '38px', height: '38px',
        border: '3px solid #e0e0e0',
        borderTop: '3px solid #2d7a2d',
        borderRadius: '50%',
        animation: 'spin 0.75s linear infinite',
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <span style={{ fontSize: '13px', color: '#888', fontWeight: '500' }}>Loading...</span>
    </div>
  );
}

export function IncomingRequestCard({ from, onClick }) {
  return (
    <div onClick={onClick} style={{
      display: 'flex', alignItems: 'center', gap: '14px',
      padding: '16px 20px', borderRadius: '12px', background: '#e8f5e8',
      marginBottom: '12px', cursor: 'pointer',
      transition: 'box-shadow 0.15s',
    }}>
      <div style={{
        width: '38px', height: '38px', background: '#2d7a2d', borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
          <path d="M12 2L12 16M12 16L7 11M12 16L17 11"/>
          <rect x="3" y="18" width="18" height="3" rx="1"/>
        </svg>
      </div>
      <div>
        <div style={{ fontWeight: '600', fontSize: '14px' }}>Incoming Request</div>
        <div style={{ fontSize: '12px', color: '#666' }}>From {from}</div>
      </div>
    </div>
  );
}
