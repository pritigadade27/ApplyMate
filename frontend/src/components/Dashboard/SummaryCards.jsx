import { MdInsertDriveFile, MdCheckCircle, MdPeople, MdStar, MdCancel } from 'react-icons/md';

const SummaryCards = ({ jobs }) => {
  const total = jobs.length;
  const applied = jobs.filter(j => j.status === 'Applied').length;
  const interview = jobs.filter(j => j.status === 'Interview').length;
  const offer = jobs.filter(j => j.status === 'Offer').length;
  const rejected = jobs.filter(j => j.status === 'Rejected').length;

  const stats = [
    { title: 'Total Applications', count: total, icon: <MdInsertDriveFile size={24} /> },
    { title: 'Applied', count: applied, icon: <MdCheckCircle size={24} /> },
    { title: 'Interview', count: interview, icon: <MdPeople size={24} /> },
    { title: 'Offer', count: offer, icon: <MdStar size={24} /> },
    { title: 'Rejected', count: rejected, icon: <MdCancel size={24} /> }
  ];

  return (
    <div className="row g-3">
      {stats.map((stat, idx) => (
        <div className="col" key={idx} style={{ minWidth: '180px' }}>
          <div className="premium-card d-flex flex-column" style={{ padding: '20px' }}>
            <div className="d-flex align-items-center gap-3">
              <div 
                className="icon-container d-flex justify-content-center align-items-center rounded-circle"
                style={{ width: '45px', height: '45px', backgroundColor: '#f3effc', color: 'var(--primary-color)' }}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-muted mb-0" style={{ fontSize: '11px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {stat.title}
                </p>
                <h3 style={{ fontWeight: '700', margin: 0, color: 'var(--text-color)' }}>
                  {stat.count}
                </h3>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
