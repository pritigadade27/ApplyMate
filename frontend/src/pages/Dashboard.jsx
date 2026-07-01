import { useState, useEffect, useContext } from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import { AuthContext } from '../context/AuthContext';
import SummaryCards from '../components/Dashboard/SummaryCards';
import ApplicationChart from '../components/Dashboard/ApplicationChart';
import CalendarWidget from '../components/Dashboard/CalendarWidget';
import TopPlatforms from '../components/Dashboard/TopPlatforms';
import RecentApplications from '../components/Dashboard/RecentApplications';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const { searchQuery } = useOutletContext();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs');
        setJobs(data);
      } catch (error) {
        toast.error('Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchJobs();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  // Filter for global search
  if (searchQuery && searchQuery.trim() !== '') {
    const searchLower = searchQuery.toLowerCase();
    const searchResults = jobs.filter(job => 
      job.companyName.toLowerCase().includes(searchLower) || 
      job.jobRole.toLowerCase().includes(searchLower)
    );

    return (
      <div className="dashboard-wrapper animation-fade-in">
        <h5 className="mb-4" style={{ fontWeight: '600' }}>Search Results for "{searchQuery}"</h5>
        
        <div className="premium-card p-0">
          <div className="table-responsive">
            <table className="table-custom">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Applied Date</th>
                  <th className="text-end">Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-5 text-muted">
                      No applications found matching your search.
                    </td>
                  </tr>
                ) : (
                  searchResults.map(job => (
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
                      <td>
                        <span className={`status-badge status-${job.status.toLowerCase()}`}>
                          {job.status}
                        </span>
                      </td>
                      <td>{new Date(job.applicationDate).toLocaleDateString()}</td>
                      <td className="text-end">
                        <Link to={`/jobs/edit/${job._id}`} className="btn btn-sm text-primary">View / Edit</Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <style>{`.animation-fade-in { animation: fadeIn 0.2s ease-in-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper animation-fade-in">
      <SummaryCards jobs={jobs} />

      <div className="row mt-4 g-4">
        {/* Left Column */}
        <div className="col-12 col-md-6 col-xl-4 d-flex flex-column gap-4">
          <div className="premium-card flex-grow-1">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h6 style={{ fontWeight: '600', fontSize: '15px', margin: 0 }}>Upcoming Interviews</h6>
              <Link to="/calendar" style={{ fontSize: '12px', color: 'var(--primary-color)', textDecoration: 'none' }}>View all</Link>
            </div>
            {/* Shortened list of interviews */}
            {jobs.filter(j => j.status === 'Interview').slice(0, 3).map(job => (
              <div key={job._id} className="d-flex align-items-center gap-3 mb-3 pb-3 border-bottom">
                <div style={{ width: '40px', height: '40px', backgroundColor: '#f3effc', borderRadius: '8px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary-color)', fontWeight: 'bold' }}>
                  {job.companyName.charAt(0)}
                </div>
                <div className="flex-grow-1">
                  <h6 className="mb-0" style={{ fontSize: '14px', fontWeight: '600' }}>{job.companyName}</h6>
                  <small className="text-muted" style={{ fontSize: '12px' }}>{job.jobRole}</small>
                </div>
                <div className="text-end">
                  <div style={{ fontSize: '12px', fontWeight: '500' }}>{job.interviewSchedule?.date ? new Date(job.interviewSchedule.date).toLocaleDateString() : 'TBD'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Column */}
        <div className="col-12 col-md-6 col-xl-4">
          <ApplicationChart jobs={jobs} />
        </div>

        {/* Right Column */}
        <div className="col-12 col-xl-4 d-flex flex-column gap-4">
          <div>
            <CalendarWidget jobs={jobs} />
          </div>
          <div>
            <TopPlatforms jobs={jobs} />
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12">
          <RecentApplications jobs={jobs} />
        </div>
      </div>
      <style>{`.animation-fade-in { animation: fadeIn 0.2s ease-in-out; } @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }`}</style>
    </div>
  );
};

export default Dashboard;
