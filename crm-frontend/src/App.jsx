import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Properties from './pages/Properties';
import Deals from './pages/Deals';
import Clients from './pages/Clients';
import Login from './pages/Login';

function App() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {isAuthenticated ? (
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<Leads />} />
            <Route path="/properties" element={<Properties />} />
            <Route path="/deals" element={<Deals />} />
            <Route path="/clients" element={<Clients />} />
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
