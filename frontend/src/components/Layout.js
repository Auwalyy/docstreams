import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.jpeg';

const ROLE_LABELS = {
  staff: 'Staff Dashboard',
  rom_supervisor: 'ROM Supervisor Dashboard',
  cooperate: 'Cooperate Dashboard',
  vehicle_officer: 'Vehicle Officer Dashboard',
  regional_coordinator: 'Regional Coordinator',
  supervisor: 'Supervisor Dashboard',
  ict: 'ICT Dashboard',
};

const Logo = () => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '24px 20px 28px', borderBottom: '1px solid #eee' }}>
    <img src={logo} alt="NMDPRA Logo" style={{ width: '48px', height: '48px', objectFit: 'contain', borderRadius: '6px' }} />
    <div>
      <div style={{ fontSize: '17px', fontWeight: '800', lineHeight: 1.2 }}>NMDPRA</div>
      <div style={{ fontSize: '17px', fontWeight: '400', lineHeight: 1.2 }}>DocStream</div>
    </div>
  </div>
);

export function NavButton({ label, active, onClick }) {
  return (
    <button onClick={onClick} style={{
      display: 'block',
      width: '100%',
      padding: '13px 18px',
      borderRadius: '10px',
      border: active ? 'none' : '1.5px solid #2d7a2d',
      background: active ? '#2d7a2d' : 'transparent',
      color: active ? '#fff' : '#1a1a1a',
      fontWeight: '600',
      fontSize: '14px',
      cursor: 'pointer',
      marginBottom: '10px',
      textAlign: 'center',
      fontFamily: 'Inter, sans-serif',
      transition: 'all 0.15s',
    }}>
      {label}
    </button>
  );
}

export default function Layout({ children, activeNav, navItems, onNav }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const notifRef = useRef(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) setShowNotifs(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/vehicles/notifications');
      setNotifications(res.data);
    } catch (e) {}
  };

  const handleBellClick = async () => {
    setShowNotifs(v => !v);
    if (!showNotifs && notifications.length > 0) {
      try {
        await axios.patch('/api/vehicles/notifications/mark-seen', {});
        setNotifications([]);
      } catch (e) {}
    }
  };

  const statusLabel = (status) => {
    if (status === 'supervisor_approved') return 'approved by Supervisor';
    if (status === 'cooperate_approved') return 'approved by Corporate';
    if (status === 'vehicle_approved') return 'fully approved — your vehicle is on its way!';
    if (status === 'declined') return 'declined';
    return status;
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f5f5f5' }}>
      {/* Sidebar */}
      <div style={{
        width: '270px', minWidth: '270px',
        background: '#fff',
        boxShadow: '2px 0 8px rgba(0,0,0,0.06)',
        display: 'flex', flexDirection: 'column',
        zIndex: 10,
      }}>
        <Logo />
        <div style={{ padding: '20px 16px', flex: 1 }}>
          {navItems.map(item => (
            <NavButton
              key={item.key}
              label={item.label}
              active={activeNav === item.key}
              onClick={() => onNav(item.key)}
            />
          ))}
        </div>
      </div>

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Top bar */}
        <div style={{
          background: '#fff',
          padding: '0 28px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
          zIndex: 9,
        }}>
          <h1 style={{ fontSize: '20px', fontWeight: '700' }}>
            {ROLE_LABELS[user?.role] || 'Dashboard'}
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Active toggle */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              background: '#2d7a2d', borderRadius: '20px',
              padding: '6px 14px', color: '#fff', fontSize: '13px', fontWeight: '600',
            }}>
              Active
              <div style={{
                width: '28px', height: '16px', background: '#fff', borderRadius: '8px',
                position: 'relative',
              }}>
                <div style={{
                  width: '12px', height: '12px', background: '#2d7a2d', borderRadius: '50%',
                  position: 'absolute', right: '2px', top: '2px',
                }}/>
              </div>
            </div>

            {/* Notification bell */}
            <div ref={notifRef} style={{ position: 'relative', cursor: 'pointer' }}>
              <div onClick={handleBellClick} style={{
                width: '38px', height: '38px', background: '#2d7a2d', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
              </div>
              {notifications.length > 0 && (
                <div style={{
                  position: 'absolute', top: '-4px', right: '-4px',
                  background: '#e53935', color: '#fff', borderRadius: '50%',
                  width: '18px', height: '18px', fontSize: '10px', fontWeight: '700',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>{notifications.length}</div>
              )}
              {showNotifs && (
                <div style={{
                  position: 'absolute', right: 0, top: '46px',
                  background: '#fff', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  minWidth: '280px', zIndex: 100, overflow: 'hidden',
                }}>
                  <div style={{ padding: '10px 14px', fontWeight: '700', fontSize: '13px', borderBottom: '1px solid #eee' }}>Notifications</div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: '14px', fontSize: '13px', color: '#888' }}>No new notifications</div>
                  ) : (
                    notifications.map(n => (
                      <div key={n._id} style={{ padding: '10px 14px', borderBottom: '1px solid #f0f0f0', fontSize: '13px' }}>
                        <span style={{ fontWeight: '600' }}>Vehicle Request</span> ({n.tripType}) was {statusLabel(n.status)}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {/* User avatar + menu */}
            <div style={{ position: 'relative' }}>
              <div
                onClick={() => setShowMenu(!showMenu)}
                style={{
                  width: '38px', height: '38px', background: '#e0e0e0', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              {showMenu && (
                <div style={{
                  position: 'absolute', right: 0, top: '46px',
                  background: '#fff', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                  padding: '8px', minWidth: '160px', zIndex: 100,
                }}>
                  <div style={{ padding: '8px 12px', fontSize: '13px', color: '#666', borderBottom: '1px solid #eee', marginBottom: '4px' }}>
                    <div style={{ fontWeight: '600', color: '#1a1a1a' }}>{user?.name}</div>
                    <div>{user?.role}</div>
                  </div>
                  <button onClick={handleLogout} style={{
                    width: '100%', padding: '8px 12px', background: 'none',
                    border: 'none', color: '#e53935', fontSize: '13px', fontWeight: '600',
                    cursor: 'pointer', textAlign: 'left', borderRadius: '6px',
                  }}>Logout</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
