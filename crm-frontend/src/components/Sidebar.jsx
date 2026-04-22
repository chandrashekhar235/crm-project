import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Home, Briefcase, Contact, LogOut } from 'lucide-react';

const Sidebar = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Leads', path: '/leads', icon: <Users size={20} /> },
    { name: 'Properties', path: '/properties', icon: <Home size={20} /> },
    { name: 'Deals', path: '/deals', icon: <Briefcase size={20} /> },
    { name: 'Clients', path: '/clients', icon: <Contact size={20} /> },
  ];

  const handleLinkClick = () => {
    if (setIsOpen) setIsOpen(false);
  };

  return (
    <aside className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-header" style={{ marginBottom: '2rem', padding: '0 1rem' }}>
        <h2 className="text-gradient" style={{ margin: 0 }}>Elevate CRM</h2>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Real Estate Module</p>
      </div>
      
      <nav style={{ flex: 1 }}>
        <ul style={{ listStyle: 'none' }}>
          {navItems.map((item) => (
            <li key={item.path} style={{ marginBottom: '0.5rem' }}>
              <Link 
                to={item.path} 
                onClick={handleLinkClick}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  textDecoration: 'none',
                  color: location.pathname === item.path ? 'var(--brand-primary)' : 'var(--text-muted)',
                  backgroundColor: location.pathname === item.path ? 'rgba(59, 130, 246, 0.1)' : 'transparent',
                  transition: 'var(--transition)',
                  fontWeight: location.pathname === item.path ? '600' : '400'
                }}
              >
                {item.icon}
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div 
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }}
        style={{ padding: '1rem', borderTop: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', color: 'var(--text-muted)' }}
      >
        <LogOut size={20} />
        <span>Logout</span>
      </div>
    </aside>
  );
};

export default Sidebar;
