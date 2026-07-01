import { format } from 'date-fns';

const UpcomingInterviews = ({ jobs }) => {
  const interviews = jobs.filter(j => j.status === 'Interview').slice(0, 3); // Get latest 3

  return (
    <div className="premium-card">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 style={{ fontWeight: '600', margin: 0 }}>Upcoming Interviews</h5>
        <a href="/jobs" style={{ fontSize: '14px', color: 'var(--primary-color)', textDecoration: 'none', fontWeight: '500' }}>See more &gt;</a>
      </div>
      
      {interviews.length === 0 ? (
        <p className="text-muted mb-0">No upcoming interviews scheduled.</p>
      ) : (
        <div className="d-flex flex-column gap-3">
          {interviews.map((job) => (
            <div key={job._id} className="d-flex justify-content-between align-items-center p-3 rounded-4" style={{ backgroundColor: 'var(--bg-color)', border: '1px solid var(--border-color)' }}>
              <div className="d-flex align-items-center gap-3">
                <div className="rounded-circle d-flex justify-content-center align-items-center" style={{ width: '48px', height: '48px', backgroundColor: 'rgba(139, 92, 246, 0.1)', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                  {job.companyName.charAt(0)}
                </div>
                <div>
                  <h6 className="mb-1" style={{ fontWeight: '600' }}>{job.jobRole}</h6>
                  <p className="text-muted mb-0" style={{ fontSize: '12px' }}>{job.companyName}</p>
                </div>
              </div>
              <div className="text-end">
                <span className="badge rounded-pill" style={{ backgroundColor: 'rgba(234, 179, 8, 0.2)', color: '#eab308' }}>
                  {format(new Date(job.applicationDate), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UpcomingInterviews;
