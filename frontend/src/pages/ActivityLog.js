import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Card, BackBtn, Loader } from '../components/UI';

export default function ActivityLog() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/activity').then(res => setLogs(res.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const ROLE_LABELS = {
    staff: 'Staff', rom_supervisor: 'ROM Supervisor', cooperate: 'Corporate',
    vehicle_officer: 'Vehicle Officer', regional_coordinator: 'Regional Coordinator',
    supervisor: 'Supervisor', ict: 'ICT',
  };

  return (
    <Card>
      <h3 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #eee' }}>
        Activity Log
      </h3>

      {loading ? <Loader /> : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                {['Date', 'Staff Name', 'Role', 'Changes Made'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left',
                    fontSize: '13px', fontWeight: '600', color: '#2d7a2d',
                    borderBottom: '1px solid #eee',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={log._id || i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#555' }}>
                    {new Date(log.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long' })}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#555' }}>{log.staffName}</td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#555' }}>
                    {ROLE_LABELS[log.role] || log.role}
                  </td>
                  <td style={{ padding: '14px 16px', fontSize: '13px', color: '#555' }}>{log.changesMade}</td>
                </tr>
              ))}
              {logs.length === 0 && (
                <tr>
                  <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: '#888' }}>No activity logged yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
