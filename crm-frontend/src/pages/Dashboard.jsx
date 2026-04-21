import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp, Users, DollarSign, Home } from 'lucide-react';
import axios from 'axios';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    propertiesSold: 0,
    activeLeads: 0,
    conversionRate: 0,
    revenueData: [],
    activities: []
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [dealsRes, propertiesRes, leadsRes] = await Promise.all([
        axios.get(import.meta.env.VITE_API_URL + '/deals'),
        axios.get(import.meta.env.VITE_API_URL + '/properties'),
        axios.get(import.meta.env.VITE_API_URL + '/leads')
      ]);

      const deals = dealsRes.data;
      const properties = propertiesRes.data;
      const leads = leadsRes.data;

      // Calculations
      const closedDeals = deals.filter(d => d.stage === 'Closed');
      const totalRevenue = closedDeals.reduce((sum, d) => sum + (d.amount || 0), 0);
      const propertiesSold = properties.filter(p => p.status === 'Sold').length;
      const activeLeads = leads.filter(l => l.status !== 'Converted' && l.status !== 'Lost').length;
      const conversionRate = deals.length > 0 ? ((closedDeals.length / deals.length) * 100).toFixed(1) : 0;

      // Group revenue by month for the chart based on updatedAt
      const monthMap = {};
      closedDeals.forEach(deal => {
        const date = new Date(deal.updatedAt || deal.createdAt || Date.now());
        const month = date.toLocaleString('default', { month: 'short' });
        monthMap[month] = (monthMap[month] || 0) + (deal.amount || 0);
      });
      
      const defaultMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
      const revenueData = defaultMonths.map(m => ({
        name: m,
        revenue: monthMap[m] || 0
      }));

      // Mock recent activities out of latest deals/leads
      const sortedDeals = [...deals].sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt)).slice(0, 2);
      const sortedLeads = [...leads].sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 2);
      
      const activities = [];
      sortedLeads.forEach(l => activities.push({
        text: `New lead assigned: ${l.name}`,
        time: new Date(l.createdAt).toLocaleDateString(),
        color: 'var(--info)'
      }));
      sortedDeals.forEach(d => activities.push({
        text: `Deal "${d.title}" moved to ${d.stage}`,
        time: new Date(d.updatedAt).toLocaleDateString(),
        color: d.stage === 'Closed' ? 'var(--success)' : 'var(--warning)'
      }));

      setStats({
        totalRevenue, propertiesSold, activeLeads, conversionRate, revenueData, activities
      });
      setLoading(false);

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const csvContent = "data:text/csv;charset=utf-8,Metric,Value\n"
      + `Total Revenue,${stats.totalRevenue}\n`
      + `Properties Sold,${stats.propertiesSold}\n`
      + `Active Leads,${stats.activeLeads}\n`
      + `Conversion Rate,${stats.conversionRate}%\n`;
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "dashboard_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return <div style={{ padding: '2rem', color: 'var(--text-muted)' }}>Loading dashboard...</div>;
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1>Dashboard Overview</h1>
          <p style={{ color: 'var(--text-muted)' }}>Welcome back! Here's what's happening based on live data.</p>
        </div>
        <button className="btn btn-primary" onClick={handleDownload}>Download Report</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--brand-primary)' }}>
            <DollarSign size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Total Revenue</p>
            <h3 style={{ margin: 0 }}>${stats.totalRevenue > 1000000 ? (stats.totalRevenue/1000000).toFixed(1) + 'M' : stats.totalRevenue.toLocaleString()}</h3>
          </div>
        </div>
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--success)' }}>
            <Home size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Properties Sold</p>
            <h3 style={{ margin: 0 }}>{stats.propertiesSold}</h3>
          </div>
        </div>
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--warning)' }}>
            <Users size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Active Leads</p>
            <h3 style={{ margin: 0 }}>{stats.activeLeads}</h3>
          </div>
        </div>
        <div className="card glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'rgba(139, 92, 246, 0.1)', borderRadius: 'var(--radius-md)', color: 'var(--brand-secondary)' }}>
            <TrendingUp size={24} />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '0.2rem' }}>Conversion Rate</p>
            <h3 style={{ margin: 0 }}>{stats.conversionRate}%</h3>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Revenue Overview (Live)</h3>
          <div style={{ height: '300px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-light)" vertical={false} />
                <XAxis dataKey="name" stroke="var(--text-muted)" />
                <YAxis stroke="var(--text-muted)" />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-sm)' }}
                  itemStyle={{ color: 'var(--text-main)' }}
                />
                <Bar dataKey="revenue" fill="var(--brand-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Recent Activities</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {stats.activities.length > 0 ? stats.activities.map((activity, i) => (
              <div key={i} style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: activity.color, marginTop: '5px' }}></div>
                <div>
                  <p style={{ margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>{activity.text}</p>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: 'var(--text-muted)' }}>{activity.time}</p>
                </div>
              </div>
            )) : (
               <p style={{ color: 'var(--text-muted)' }}>No recent activities.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
