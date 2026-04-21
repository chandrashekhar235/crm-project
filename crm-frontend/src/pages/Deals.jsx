import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import axios from 'axios';

const Deals = () => {
  const stages = ['Inquiry', 'Negotiation', 'Agreement', 'Closed', 'Lost'];
  const stageColors = {
    'Inquiry': 'var(--info)',
    'Negotiation': 'var(--warning)',
    'Agreement': 'var(--brand-secondary)',
    'Closed': 'var(--success)',
    'Lost': 'var(--danger)'
  };
  
  const [deals, setDeals] = useState([]);
  const [clients, setClients] = useState([]);
  const [agents, setAgents] = useState([]);
  
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '', amount: '', stage: 'Inquiry', clientId: '', agentId: '', documents: []
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [dealsRes, clientsRes, agentsRes] = await Promise.all([
        axios.get('http://localhost:5001/deals'),
        axios.get('http://localhost:5001/clients'),
        axios.get('http://localhost:5001/users')
      ]);
      setDeals(dealsRes.data);
      setClients(clientsRes.data);
      setAgents(agentsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        amount: formData.amount ? Number(formData.amount.replace(/[^0-9.-]+/g,"")) : 0
      };
      await axios.post('http://localhost:5001/deals', payload);
      setShowModal(false);
      setFormData({ title: '', amount: '', stage: 'Inquiry', clientId: '', agentId: '' });
      fetchData();
    } catch (error) {
      console.error('Error adding deal:', error);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const data = new FormData();
    data.append('file', file);
    try {
      const res = await axios.post('http://localhost:5001/api/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        setFormData(prev => ({
          ...prev, 
          documents: [...prev.documents, { name: file.name, url: res.data.url }]
        }));
      }
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed');
    }
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Deal Pipeline</h1>
          <p style={{ color: 'var(--text-muted)' }}>Drag and drop deals across stages (visual only demo).</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Deal
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
        {stages.map(stage => (
          <div key={stage} style={{ flex: '0 0 300px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', padding: '1rem' }}>
            <h3 style={{ fontSize: '1rem', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between' }}>
              {stage}
              <span className="badge" style={{ backgroundColor: 'var(--bg-secondary)', color: 'var(--text-muted)' }}>
                {deals.filter(d => d.stage === stage).length}
              </span>
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {deals.filter(d => d.stage === stage).map(deal => (
                <div key={deal._id} className="card" style={{ padding: '1rem', cursor: 'grab' }}>
                  <div style={{ height: '4px', width: '40px', backgroundColor: stageColors[stage], borderRadius: '4px', marginBottom: '0.75rem' }}></div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{deal.title}</h4>
                  <p style={{ margin: '0 0 1rem 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Client: {deal.clientId?.name || 'Unknown'}
                  </p>
                  <div style={{ fontWeight: 'bold' }}>${deal.amount?.toLocaleString()}</div>
                  {deal.documents && deal.documents.length > 0 && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--brand-primary)', marginTop: '0.5rem' }}>
                      📎 {deal.documents.length} Document(s)
                    </div>
                  )}
                </div>
              ))}
              {deals.filter(d => d.stage === stage).length === 0 && (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  No deals
                </div>
              )}
            </div>
            
            <button className="btn btn-secondary" onClick={() => { setFormData({...formData, stage}); setShowModal(true); }} style={{ width: '100%', marginTop: '1rem', background: 'transparent', border: '1px dashed var(--border-light)' }}>
              + Add Deal
            </button>
          </div>
        ))}
      </div>

      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '400px', maxWidth: '90%' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Add New Deal</h3>
              <X size={20} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowModal(false)} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input required type="text" className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Amount ($)</label>
                <input required type="text" className="form-control" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Stage</label>
                <select className="form-control" value={formData.stage} onChange={e => setFormData({...formData, stage: e.target.value})}>
                  {stages.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Client</label>
                <select required className="form-control" value={formData.clientId} onChange={e => setFormData({...formData, clientId: e.target.value})}>
                  <option value="">Select Client</option>
                  {clients.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Agent (User)</label>
                <select required className="form-control" value={formData.agentId} onChange={e => setFormData({...formData, agentId: e.target.value})}>
                  <option value="">Select Agent</option>
                  {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Documents (Agreements)</label>
                <input type="file" className="form-control" onChange={handleFileUpload} />
                {formData.documents.length > 0 && (
                  <ul style={{ marginTop: '0.5rem', paddingLeft: '1rem', fontSize: '0.85rem' }}>
                    {formData.documents.map((doc, idx) => (
                      <li key={idx}><a href={doc.url} target="_blank" rel="noreferrer" style={{ color: 'var(--brand-primary)' }}>{doc.name}</a></li>
                    ))}
                  </ul>
                )}
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Deal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Deals;
