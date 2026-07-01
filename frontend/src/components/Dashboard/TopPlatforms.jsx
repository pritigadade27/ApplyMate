import { FaLinkedin, FaBuilding, FaGlobe } from 'react-icons/fa';
import { SiIndeed } from 'react-icons/si';

const TopPlatforms = ({ jobs }) => {
  // Compute platform counts dynamically from jobs
  const platformCounts = jobs.reduce((acc, job) => {
    const p = job.platform || 'Other';
    acc[p] = (acc[p] || 0) + 1;
    return acc;
  }, {});

  // Convert to array and sort by count descending
  const sortedPlatforms = Object.entries(platformCounts)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 4); // Only show top 4

  const getPlatformIcon = (name) => {
    switch(name) {
      case 'LinkedIn': return <FaLinkedin color="#0a66c2" size={16} />;
      case 'Indeed': return <SiIndeed color="#003A9B" size={16} />;
      case 'Company Site': return <FaBuilding color="#6b7280" size={16} />;
      case 'Naukri': return <FaGlobe color="#008bdc" size={16} />;
      default: return <FaGlobe color="#475569" size={16} />;
    }
  };

  return (
    <div className="premium-card h-100 d-flex flex-column">
      <h6 className="mb-4" style={{ fontWeight: '600', fontSize: '15px' }}>Top Platforms</h6>
      
      {sortedPlatforms.length === 0 ? (
        <div className="text-center text-muted py-4" style={{ fontSize: '13px' }}>
          No applications added yet.
        </div>
      ) : (
        <div className="d-flex flex-column gap-3 flex-grow-1">
          {sortedPlatforms.map((p, idx) => (
            <div key={idx} className="d-flex justify-content-between align-items-center p-2 rounded" style={{ backgroundColor: '#f8fafc' }}>
              <div className="d-flex align-items-center gap-3">
                <div style={{ width: '32px', height: '32px', backgroundColor: 'white', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  {getPlatformIcon(p.name)}
                </div>
                <div className="d-flex flex-column">
                  <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-color)' }}>{p.name}</span>
                </div>
              </div>
              
              <div className="px-3 py-1 rounded" style={{ backgroundColor: '#e2e8f0', fontSize: '12px', fontWeight: '600', color: '#334155' }}>
                {p.count}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TopPlatforms;
