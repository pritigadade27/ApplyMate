import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { MdInsertDriveFile, MdCheckCircle, MdPeople, MdStar, MdCancel } from 'react-icons/md';

const Statistics = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs');
        setJobs(data);
      } catch (error) {
        toast.error('Failed to fetch statistics data');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  if (loading) return <LoadingSpinner />;

  // Data processing
  const total = jobs.length;
  const applied = jobs.filter(j => j.status === 'Applied').length;
  const interview = jobs.filter(j => j.status === 'Interview').length;
  const offer = jobs.filter(j => j.status === 'Offer').length;
  const rejected = jobs.filter(j => j.status === 'Rejected').length;

  const statusData = [
    { name: 'Applied', value: applied, color: '#4338ca' },
    { name: 'Interview', value: interview, color: '#a21caf' },
    { name: 'Offer', value: offer, color: '#15803d' },
    { name: 'Rejected', value: rejected, color: '#be123c' },
  ].filter(d => d.value > 0);

  // Platform grouping (simplified)
  const platformCounts = {};
  jobs.forEach(job => {
    const platform = job.platform || 'Other';
    platformCounts[platform] = (platformCounts[platform] || 0) + 1;
  });
  const platformData = Object.keys(platformCounts).map(key => ({
    name: key,
    Applications: platformCounts[key]
  }));

  // Monthly applications (mock distribution based on dates, simplified)
  const monthlyData = [
    { name: 'Jan', count: 0 }, { name: 'Feb', count: 0 }, { name: 'Mar', count: 0 },
    { name: 'Apr', count: 0 }, { name: 'May', count: 0 }, { name: 'Jun', count: 0 },
    { name: 'Jul', count: 0 }, { name: 'Aug', count: 0 }, { name: 'Sep', count: 0 },
    { name: 'Oct', count: 0 }, { name: 'Nov', count: 0 }, { name: 'Dec', count: 0 }
  ];
  jobs.forEach(job => {
    if (job.date) {
      const monthIndex = new Date(job.date).getMonth();
      monthlyData[monthIndex].count += 1;
    }
  });

  const successRate = total > 0 ? (((offer + interview) / total) * 100).toFixed(1) : 0;

  return (
    <div className="statistics-page animation-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 style={{ fontWeight: '600' }}>Detailed Statistics</h4>
        <div className="badge bg-primary px-3 py-2" style={{ fontSize: '14px', borderRadius: '8px' }}>
          Success Rate: {successRate}%
        </div>
      </div>

      {/* Summary Cards */}
      <div className="row g-3 mb-4">
        {[
          { title: 'Total', count: total, icon: <MdInsertDriveFile size={24} />, color: 'var(--primary-color)' },
          { title: 'Applied', count: applied, icon: <MdCheckCircle size={24} />, color: '#4338ca' },
          { title: 'Interview', count: interview, icon: <MdPeople size={24} />, color: '#a21caf' },
          { title: 'Offer', count: offer, icon: <MdStar size={24} />, color: '#15803d' },
          { title: 'Rejected', count: rejected, icon: <MdCancel size={24} />, color: '#be123c' }
        ].map((stat, idx) => (
          <div className="col" key={idx} style={{ minWidth: '150px' }}>
            <div className="premium-card p-3 d-flex align-items-center gap-3 h-100">
              <div 
                className="d-flex justify-content-center align-items-center rounded-circle"
                style={{ width: '45px', height: '45px', backgroundColor: `${stat.color}15`, color: stat.color }}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-muted mb-0" style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase' }}>
                  {stat.title}
                </p>
                <h4 style={{ fontWeight: '700', margin: 0, color: 'var(--text-color)' }}>
                  {stat.count}
                </h4>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row g-4">
        {/* Monthly Trend Area Chart */}
        <div className="col-lg-8">
          <div className="premium-card h-100 p-4">
            <h6 className="mb-4" style={{ fontWeight: '600' }}>Monthly Applications</h6>
            <div style={{ width: '100%', height: '300px' }}>
              <ResponsiveContainer>
                <AreaChart data={monthlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary-color)" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="var(--primary-color)" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                  <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-soft)' }} />
                  <Area type="monotone" dataKey="count" stroke="var(--primary-color)" strokeWidth={3} fillOpacity={1} fill="url(#colorCount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Status Distribution Pie Chart */}
        <div className="col-lg-4">
          <div className="premium-card h-100 p-4">
            <h6 className="mb-4" style={{ fontWeight: '600' }}>Status Distribution</h6>
            <div style={{ width: '100%', height: '300px', display: 'flex', justifyContent: 'center' }}>
              {statusData.length > 0 ? (
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={statusData}
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-soft)' }} />
                    <Legend iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="d-flex align-items-center text-muted">No data available</div>
              )}
            </div>
          </div>
        </div>

        {/* Platform Bar Chart */}
        <div className="col-12">
          <div className="premium-card p-4">
            <h6 className="mb-4" style={{ fontWeight: '600' }}>Applications by Platform</h6>
            <div style={{ width: '100%', height: '350px' }}>
              {platformData.length > 0 ? (
                <ResponsiveContainer>
                  <BarChart data={platformData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                    <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-soft)' }} />
                    <Bar dataKey="Applications" fill="var(--primary-color)" radius={[4, 4, 0, 0]} barSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="d-flex justify-content-center align-items-center h-100 text-muted">No data available</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .animation-fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Statistics;
