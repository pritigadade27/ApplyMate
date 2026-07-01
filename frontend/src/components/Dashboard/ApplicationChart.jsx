import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const ApplicationChart = ({ jobs }) => {
  const data = [
    { name: 'Applied', value: jobs.filter(j => j.status === 'Applied').length, color: '#4c1d95' }, // Dark purple
    { name: 'Interview', value: jobs.filter(j => j.status === 'Interview').length, color: '#7c3aed' }, // Primary purple
    { name: 'Offer', value: jobs.filter(j => j.status === 'Offer').length, color: '#a78bfa' }, // Light purple
    { name: 'Rejected', value: jobs.filter(j => j.status === 'Rejected').length, color: '#ddd6fe' }, // Lightest purple
  ];

  return (
    <div className="premium-card h-100 d-flex flex-column">
      <h6 className="mb-4" style={{ fontWeight: '600', fontSize: '15px' }}>Application Status</h6>
      <div className="flex-grow-1 d-flex align-items-center">
        <div style={{ width: '50%', height: '200px', position: 'relative' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                stroke="none"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: 'var(--shadow-soft)' }}
                itemStyle={{ color: 'var(--text-color)', fontWeight: '500' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
            <h4 style={{ margin: 0, fontWeight: '700' }}>{jobs.length}</h4>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Total</span>
          </div>
        </div>
        
        <div style={{ width: '50%' }} className="d-flex flex-column gap-3 pl-3">
          {data.map((item, idx) => (
            <div key={idx} className="d-flex align-items-center gap-2">
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: item.color }}></span>
              <span style={{ fontSize: '12px', color: 'var(--text-muted)', flexGrow: 1 }}>{item.name}</span>
              <span style={{ fontSize: '12px', fontWeight: '600' }}>({item.value})</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ApplicationChart;
