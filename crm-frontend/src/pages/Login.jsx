import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'Agent' });
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const endpoint = isLogin ? 'http://localhost:5001/users/login' : 'http://localhost:5001/users/register';
      const res = await axios.post(endpoint, formData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      window.location.href = '/dashboard';
    } catch (err) {
      setError(err.response?.data?.msg || 'Authentication failed. Make sure the backend is running.');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)' }}>
      <div style={{ position: 'absolute', top: '-10%', left: '-10%', width: '500px', height: '500px', background: 'var(--brand-primary)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.15, zIndex: 0 }}></div>
      <div style={{ position: 'absolute', bottom: '-10%', right: '-10%', width: '400px', height: '400px', background: 'var(--brand-secondary)', borderRadius: '50%', filter: 'blur(150px)', opacity: 0.15, zIndex: 0 }}></div>

      <div className="glass-panel" style={{ width: '100%', maxWidth: '420px', padding: '3rem 2.5rem', position: 'relative', zIndex: 1, border: '1px solid var(--border-light)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 className="text-gradient" style={{ margin: 0, fontSize: '2rem' }}>Elevate CRM</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
            {isLogin ? 'Welcome back. Please sign in.' : 'Create your agent account.'}
          </p>
        </div>

        {error && (
          <div style={{ padding: '0.75rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: 'var(--radius-sm)', marginBottom: '1.5rem', fontSize: '0.9rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" placeholder="Jane Doe" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
          )}
          
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input type="email" className="form-control" placeholder="agent@elevate.com" required value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
          </div>
          
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <label className="form-label">Password</label>
              {isLogin && <a href="#" style={{ color: 'var(--brand-primary)', fontSize: '0.85rem', textDecoration: 'none' }}>Forgot password?</a>}
            </div>
            <input type="password" className="form-control" placeholder="••••••••" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.85rem', fontSize: '1rem' }}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span 
            onClick={() => { setIsLogin(!isLogin); setError(null); }} 
            style={{ color: 'var(--brand-primary)', textDecoration: 'none', fontWeight: 500, cursor: 'pointer' }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
