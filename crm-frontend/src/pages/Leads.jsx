import React, { useState, useEffect } from 'react';
import { Search, Plus, X } from 'lucide-react';
import axios from 'axios';

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  
  const [showModal, setShowModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', budget: '', status: 'New', source: 'Website', preferences: '', followUpReminder: ''
  });

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/leads');
      setLeads(res.data);
    } catch (error) {
      console.error('Error fetching leads', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        budget: formData.budget ? Number(formData.budget.toString().replace(/[^0-9.-]+/g,"")) : 0,
      };
      await axios.post(import.meta.env.VITE_API_URL + '/leads', payload);
      setShowModal(false);
      setFormData({ name: '', email: '', phone: '', budget: '', status: 'New', source: 'Website', preferences: '', followUpReminder: '' });
      fetchLeads();
    } catch (error) {
      console.error('Error adding lead', error);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = (lead.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           lead.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           lead.phone?.includes(searchTerm));
    const matchesStatus = filterStatus === 'All' || lead.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Leads Management</h1>
          <p style={{ color: 'var(--text-muted)' }}>Track and convert your potential clients.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Lead
        </button>
      </div>
      
      <div className="card">
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search leads by name, email or phone..." 
              style={{ paddingLeft: '2.5rem' }} 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select 
            className="form-control" 
            style={{ width: 'auto' }}
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
          </select>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-light)', textAlign: 'left' }}>
              <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Name</th>
              <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Contact Info</th>
              <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Budget</th>
              <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Status</th>
              <th style={{ padding: '1rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map(lead => (
              <tr key={lead._id} style={{ borderBottom: '1px solid var(--border-light)' }}>
                <td style={{ padding: '1rem 0', fontWeight: 500 }}>{lead.name}</td>
                <td style={{ padding: '1rem 0' }}>
                  <div style={{ fontSize: '0.9rem' }}>{lead.email}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{lead.phone}</div>
                </td>
                <td style={{ padding: '1rem 0' }}>${lead.budget ? lead.budget.toLocaleString() : '0'}</td>
                <td style={{ padding: '1rem 0' }}><span className="badge badge-info">{lead.status}</span></td>
                <td style={{ padding: '1rem 0' }}>
                  <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setSelectedLead(lead)}>View</button>
                </td>
              </tr>
            ))}
            {filteredLeads.length === 0 && (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>No leads match your search criteria.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '400px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Add New Lead</h3>
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
                <label className="form-label">Budget ($)</label>
                <input type="text" className="form-control" value={formData.budget} onChange={e => setFormData({...formData, budget: e.target.value})} placeholder="e.g. 500000" />
              </div>
              <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Source</label>
                  <select className="form-control" value={formData.source} onChange={e => setFormData({...formData, source: e.target.value})}>
                    <option value="Website">Website</option>
                    <option value="Referral">Referral</option>
                    <option value="Ad Campaign">Ad Campaign</option>
                    <option value="Direct Call">Direct Call</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Follow-up Date</label>
                  <input type="date" className="form-control" value={formData.followUpReminder} onChange={e => setFormData({...formData, followUpReminder: e.target.value})} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Preferences (Notes)</label>
                <textarea className="form-control" value={formData.preferences} onChange={e => setFormData({...formData, preferences: e.target.value})} rows="2"></textarea>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Lead</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedLead && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '400px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Lead Details</h3>
              <X size={20} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setSelectedLead(null)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div><strong style={{ color: 'var(--text-muted)' }}>Name:</strong> <br/>{selectedLead.name}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Email:</strong> <br/>{selectedLead.email}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Phone:</strong> <br/>{selectedLead.phone}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Budget:</strong> <br/>${selectedLead.budget?.toLocaleString()}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Status:</strong> <br/><span className="badge badge-info">{selectedLead.status}</span></div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Source:</strong> <br/>{selectedLead.source}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Preferences:</strong> <br/>{selectedLead.preferences || 'None'}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Follow-up:</strong> <br/>{selectedLead.followUpReminder ? new Date(selectedLead.followUpReminder).toLocaleDateString() : 'Not set'}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Created At:</strong> <br/>{new Date(selectedLead.createdAt).toLocaleString()}</div>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setSelectedLead(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
