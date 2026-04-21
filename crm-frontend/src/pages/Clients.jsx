import React, { useState, useEffect } from 'react';
import { Search, Mail, Phone, ExternalLink, Plus, X } from 'lucide-react';
import axios from 'axios';

const Clients = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);
  
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', type: 'Buyer', preferences: '' });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await axios.get('http://localhost:5001/clients');
      setClients(res.data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5001/clients', formData);
      setShowModal(false);
      setFormData({ name: '', email: '', phone: '', type: 'Buyer', preferences: '' });
      fetchClients();
    } catch (error) {
      console.error('Error adding client:', error);
    }
  };

  const filteredClients = clients.filter(client => 
    client.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.email?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.phone?.includes(searchTerm)
  );

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Client Directory</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage your active and past clients.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Client
        </button>
      </div>

      <div className="card">
        <div style={{ position: 'relative', marginBottom: '1.5rem', maxWidth: '400px' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search clients..." 
            style={{ paddingLeft: '2.5rem' }} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {filteredClients.map(client => (
            <div key={client._id} style={{ padding: '1.5rem', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', background: 'var(--bg-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.2rem' }}>
                    {client.name ? client.name.charAt(0).toUpperCase() : '?'}
                  </div>
                  <div>
                    <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.1rem' }}>{client.name}</h3>
                    <span className="badge badge-info">Client</span>
                  </div>
                </div>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <Mail size={16} /> {client.email || 'N/A'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <Phone size={16} /> {client.phone || 'N/A'}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ padding: '0.3rem 0.6rem' }}
                  onClick={() => setSelectedClient(client)}
                ><ExternalLink size={16} /> View Profile</button>
              </div>
            </div>
          ))}
          {filteredClients.length === 0 && (
            <div style={{ padding: '2rem', color: 'var(--text-muted)', textAlign: 'center', gridColumn: '1 / -1' }}>
              No clients found matching your search.
            </div>
          )}
        </div>
      </div>

      {/* Selected Client Modal */}
      {selectedClient && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '400px', maxWidth: '90%' }}>
             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Client Profile</h3>
              <X size={20} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setSelectedClient(null)} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--brand-primary), var(--brand-secondary))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.5rem' }}>
                {selectedClient.name ? selectedClient.name.charAt(0).toUpperCase() : '?'}
              </div>
              <h2 style={{ margin: 0 }}>{selectedClient.name}</h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div><strong style={{ color: 'var(--text-muted)' }}>Email:</strong> <br/>{selectedClient.email || 'N/A'}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Phone:</strong> <br/>{selectedClient.phone || 'N/A'}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Type:</strong> <br/><span className="badge badge-info">{selectedClient.type || 'Buyer'}</span></div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Preferences:</strong> <br/>{selectedClient.preferences || 'None'}</div>
              
              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-light)', paddingTop: '1rem' }}>
                <strong style={{ color: 'var(--text-muted)' }}>Interactions Timeline:</strong>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {selectedClient.interactions && selectedClient.interactions.length > 0 ? (
                    selectedClient.interactions.map((interaction, i) => (
                      <div key={i} style={{ padding: '0.5rem', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '0.9rem' }}>
                        <strong>{interaction.type}</strong> - {new Date(interaction.date).toLocaleDateString()}<br/>
                        <span style={{ color: 'var(--text-muted)' }}>{interaction.notes}</span>
                      </div>
                    ))
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No interactions logged yet.</span>
                  )}
                </div>
              </div>

              <div><strong style={{ color: 'var(--text-muted)' }}>Database Built ID:</strong> <br/><span style={{ fontSize: '0.85rem' }}>{selectedClient._id}</span></div>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setSelectedClient(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Add Model */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '400px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Add New Client</h3>
              <X size={20} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowModal(false)} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Name</label>
                <input required type="text" className="form-control" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input required type="email" className="form-control" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input type="text" className="form-control" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Client Type</label>
                <select className="form-control" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                  <option value="Buyer">Buyer</option>
                  <option value="Seller">Seller</option>
                  <option value="Both">Both</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Preferences</label>
                <textarea className="form-control" rows="2" value={formData.preferences} onChange={e => setFormData({...formData, preferences: e.target.value})}></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Client</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Clients;
