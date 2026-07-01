import { MdEdit, MdDelete } from 'react-icons/md';
import { format } from 'date-fns';

const RecentApplications = ({ jobs }) => {
  const recentJobs = jobs.slice(0, 5);

  return (
    <div className="premium-card">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h6 style={{ fontWeight: '600', fontSize: '15px', margin: 0 }}>Recent Applications</h6>
        <a href="/jobs" style={{ fontSize: '12px', color: 'var(--primary-color)', textDecoration: 'none' }}>View all</a>
      </div>
      
      <div className="table-responsive">
        <table className="table-custom">
          <thead>
            <tr>
              <th>Company</th>
              <th>Role</th>
              <th>Platform</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Applied Date</th>
              <th className="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            {recentJobs.length === 0 ? (
              <tr><td colSpan="7" className="text-center">No recent applications.</td></tr>
            ) : (
              recentJobs.map((job) => (
                <tr key={job._id}>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <div style={{ width: '24px', height: '24px', backgroundColor: '#f3effc', borderRadius: '4px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary-color)', fontSize: '12px', fontWeight: 'bold' }}>
                        {job.companyName.charAt(0)}
                      </div>
                      <span style={{ fontWeight: '600', color: 'var(--text-color)' }}>{job.companyName}</span>
                    </div>
                  </td>
                  <td>{job.jobRole}</td>
                  <td>{job.platform || 'Company Site'}</td>
                  <td>
                    <span className={`status-badge status-${job.status.toLowerCase()}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <span style={{ 
                      color: job.priority === 'High' ? 'var(--priority-high)' : job.priority === 'Medium' ? 'var(--priority-medium)' : 'var(--priority-low)',
                      fontWeight: '600',
                      fontSize: '12px'
                    }}>
                      {job.priority}
                    </span>
                  </td>
                  <td>{format(new Date(job.applicationDate), 'dd MMM yyyy')}</td>
                  <td className="text-end">
                    <div className="d-flex justify-content-end gap-2">
                      <button className="btn btn-sm text-muted"><MdEdit /></button>
                      <button className="btn btn-sm text-muted"><MdDelete /></button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentApplications;
