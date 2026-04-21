import React, { useState, useEffect } from 'react';
import { Plus, Search, MapPin, X } from 'lucide-react';
import axios from 'axios';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [agents, setAgents] = useState([]);
  
  // Filtering and Search State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('All Types');
  const [filterStatus, setFilterStatus] = useState('All Status');
  
  const [showModal, setShowModal] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', price: '', type: 'Residential', location: '', status: 'Available', agentId: '', images: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [propRes, agentsRes] = await Promise.all([
        axios.get(import.meta.env.VITE_API_URL + '/properties'),
        axios.get(import.meta.env.VITE_API_URL + '/users')
      ]);
      setProperties(propRes.data);
      setAgents(agentsRes.data);
    } catch (error) {
      console.error('Error fetching properties', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        price: Number(formData.price.toString().replace(/[^0-9.-]+/g,"")),
        images: formData.images ? formData.images.split(',').map(url => url.trim()) : []
      };
      await axios.post(import.meta.env.VITE_API_URL + '/properties', payload);
      setShowModal(false);
      setFormData({ title: '', price: '', type: 'Residential', location: '', status: 'Available', agentId: '', images: '' });
      fetchData();
    } catch (error) {
      console.error('Error saving property', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    const data = new FormData();
    data.append('file', file);
    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + '/api/upload', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (res.data.success) {
        const currentImages = formData.images ? formData.images.split(',').map(u => u.trim()).filter(u => u) : [];
        currentImages.push(res.data.url);
        setFormData({ ...formData, images: currentImages.join(', ') });
      }
    } catch (error) {
      console.error('Upload failed', error);
      alert('Upload failed');
    }
  };

  const filteredProperties = properties.filter(prop => {
    const matchesSearch = prop.location?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          prop.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'All Types' || prop.type === filterType;
    const matchesStatus = filterStatus === 'All Status' || prop.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Properties</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage listings and availability.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> Add Property
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by location, title..." 
            style={{ paddingLeft: '2.5rem' }} 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select 
          className="form-control" 
          style={{ width: 'auto' }}
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All Types">All Types</option>
          <option value="Residential">Residential</option>
          <option value="Commercial">Commercial</option>
        </select>
        <select 
          className="form-control" 
          style={{ width: 'auto' }}
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All Status">All Status</option>
          <option value="Available">Available</option>
          <option value="Sold">Sold</option>
          <option value="Hold">Hold</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
        {filteredProperties.map(prop => (
          <div key={prop._id} className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <div style={{ height: '200px', backgroundColor: 'var(--bg-tertiary)', position: 'relative' }}>
              {prop.images && prop.images[0] ? (
                <img src={prop.images[0]} alt={prop.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>No Image</div>
              )}
              <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                <span className={`badge ${prop.status === 'Available' ? 'badge-success' : 'badge-warning'}`}>{prop.status}</span>
              </div>
              <div style={{ position: 'absolute', top: '1rem', left: '1rem' }}>
                <span className="badge" style={{ background: 'rgba(0,0,0,0.6)', color: 'white' }}>{prop.type}</span>
              </div>
            </div>
            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{prop.title}</h3>
              <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                <MapPin size={16} /> {prop.location}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--brand-primary)' }}>
                  ${(prop.price || 0).toLocaleString()}
                </div>
                <button className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => setSelectedProperty(prop)}>Details</button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {filteredProperties.length === 0 && (
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>
          No properties found matching your criteria.
        </div>
      )}

      {/* Detail View Modal */}
      {selectedProperty && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <div className="card" style={{ width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <h3 style={{ margin: 0 }}>Property Details</h3>
              <X size={20} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setSelectedProperty(null)} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {selectedProperty.images && selectedProperty.images[0] && (
                <img src={selectedProperty.images[0]} alt="Prop" style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
              )}
              <div><strong style={{ color: 'var(--text-muted)' }}>Title:</strong> <br/>{selectedProperty.title}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Location:</strong> <br/>{selectedProperty.location}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Price:</strong> <br/>${(selectedProperty.price || 0).toLocaleString()}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Type:</strong> <br/>{selectedProperty.type}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Description:</strong> <br/>{selectedProperty.description || 'No description provided.'}</div>
              <div><strong style={{ color: 'var(--text-muted)' }}>Status:</strong> <br/>
                <span className={`badge ${selectedProperty.status === 'Available' ? 'badge-success' : 'badge-warning'}`}>{selectedProperty.status}</span>
              </div>
              <button className="btn btn-primary" style={{ marginTop: '1rem' }} onClick={() => setSelectedProperty(null)}>Close</button>
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
          <div className="card" style={{ width: '500px', maxWidth: '90%', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Add New Property</h3>
              <X size={20} style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => setShowModal(false)} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Title</label>
                <input required type="text" className="form-control" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Price ($)</label>
                <input required type="text" className="form-control" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
              </div>
              <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Type</label>
                  <select className="form-control" value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})}>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label className="form-label">Status</label>
                  <select className="form-control" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                    <option value="Available">Available</option>
                    <option value="Sold">Sold</option>
                    <option value="Hold">Hold</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input required type="text" className="form-control" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
              </div>
              <div className="form-group">
                <label className="form-label">Images</label>
                <input type="file" className="form-control" onChange={handleImageUpload} accept="image/*" />
                <input type="text" className="form-control" style={{ marginTop: '0.5rem' }} value={formData.images} onChange={e => setFormData({...formData, images: e.target.value})} placeholder="Or paste URLs (comma separated)..." />
              </div>
              <div className="form-group">
                <label className="form-label">Agent ID</label>
                <select required className="form-control" value={formData.agentId} onChange={e => setFormData({...formData, agentId: e.target.value})}>
                  <option value="">Select an Agent...</option>
                  {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Property</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Properties;
