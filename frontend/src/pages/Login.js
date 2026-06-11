import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.jpeg';

export default function Login() {
  const [form, setForm] = useState({ staffId: '', department: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      await login(form.staffId, form.email, form.password);
      navigate('/');
    } catch (e) {
      setError(e.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Left side - building image */}
      <div style={styles.leftPanel}>
        <div style={styles.overlay} />
      </div>

      {/* Right side - login form */}
      <div style={styles.rightPanel}>
        {/* Logo */}
        <div style={styles.logoArea}>
          <img src={logo} alt="NMDPRA Logo" style={{ width: '56px', height: '56px', objectFit: 'contain', borderRadius: '6px' }} />
          <div>
            <div style={styles.logoTextTop}>NMDPRA</div>
            <div style={styles.logoTextBottom}>DocStream</div>
          </div>
        </div>

        <h2 style={styles.title}>Login</h2>
        <p style={styles.subtitle}>Add your details to login</p>

        {error && <div style={styles.error}>{error}</div>}

        <input
          style={styles.input}
          placeholder="Staff ID"
          value={form.staffId}
          onChange={e => setForm({ ...form, staffId: e.target.value })}
        />
        <input
          style={styles.input}
          placeholder="Department/Role"
          value={form.department}
          onChange={e => setForm({ ...form, department: e.target.value })}
        />
        <input
          style={styles.input}
          placeholder="Staff Email"
          type="email"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
        />
        <input
          style={styles.input}
          placeholder="Password"
          type="password"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />

        <button style={{ ...styles.loginBtn, opacity: loading ? 0.7 : 1 }} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <p style={styles.forgotLink}>Forget Password?</p>

        <div style={styles.hint}>
          <p style={{ color: '#888', fontSize: '12px', marginTop: '24px' }}>Demo credentials:</p>
          <p style={{ color: '#888', fontSize: '11px' }}>Staff: STF001 / abdullahi@nmdpra.gov.ng / password123</p>
          <p style={{ color: '#888', fontSize: '11px' }}>ICT: ICT001 / ict@nmdpra.gov.ng / password123</p>
          <p style={{ color: '#888', fontSize: '11px' }}>Supervisor: SUP001 / mansur@nmdpra.gov.ng / password123</p>
          <p style={{ color: '#888', fontSize: '11px' }}>Corporate: COP001 / bello@nmdpra.gov.ng / password123</p>
          <p style={{ color: '#888', fontSize: '11px' }}>Vehicle Officer: VEH001 / hassan@nmdpra.gov.ng / password123</p>
          <p style={{ color: '#888', fontSize: '11px' }}>Regional Coord: REG001 / ali@nmdpra.gov.ng / password123</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    height: '100vh',
    width: '100vw',
  },
  leftPanel: {
    flex: 1,
    background: `linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.45)), 
      url('https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800') center/cover no-repeat`,
    position: 'relative',
  },
  overlay: {
    position: 'absolute', inset: 0,
  },
  rightPanel: {
    width: '480px',
    minWidth: '480px',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px 56px',
    overflowY: 'auto',
  },
  logoArea: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '36px',
  },
  logoIcon: { display: 'flex', alignItems: 'center' },
  logoTextTop: {
    fontSize: '22px',
    fontWeight: '800',
    color: '#1a1a1a',
    lineHeight: 1.1,
  },
  logoTextBottom: {
    fontSize: '22px',
    fontWeight: '400',
    color: '#1a1a1a',
    lineHeight: 1.1,
  },
  title: {
    fontSize: '28px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '6px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '28px',
  },
  error: {
    background: '#ffebee',
    color: '#c62828',
    padding: '10px 16px',
    borderRadius: '8px',
    fontSize: '13px',
    width: '100%',
    marginBottom: '12px',
  },
  input: {
    width: '100%',
    padding: '14px 18px',
    borderRadius: '10px',
    border: 'none',
    background: '#ebebeb',
    fontSize: '14px',
    color: '#333',
    marginBottom: '14px',
    outline: 'none',
    fontFamily: 'Inter, sans-serif',
  },
  loginBtn: {
    width: '100%',
    padding: '15px',
    borderRadius: '30px',
    border: 'none',
    background: '#2d7a2d',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '8px',
    fontFamily: 'Inter, sans-serif',
    transition: 'background 0.2s',
  },
  forgotLink: {
    color: '#d4a017',
    fontSize: '14px',
    fontWeight: '600',
    marginTop: '16px',
    cursor: 'pointer',
  },
  hint: { width: '100%', textAlign: 'center' },
};
