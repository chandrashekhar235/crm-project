import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

const Layout = () => {
  return (
    <div className="app-container">
      <Sidebar />
      <main className="main-content">
        <header style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <p style={{ margin: 0, fontWeight: 600 }}>Agent Carter</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>Admin</p>
            </div>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--brand-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              AC
            </div>
          </div>
        </header>
        <div className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
