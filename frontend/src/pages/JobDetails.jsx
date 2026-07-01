import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { MdEdit, MdDelete, MdArrowBack, MdDownload, MdEvent, MdLink } from 'react-icons/md';
import { toast } from 'react-toastify';
import api from '../api/axios';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await api.get(`/jobs/${id}`);
        setJob(data);
      } catch (error) {
        toast.error('Failed to load application details');
        navigate('/jobs');
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id, navigate]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await api.delete(`/jobs/${id}`);
        toast.success("Application deleted");
        navigate('/jobs');
      } catch (error) {
        toast.error("Failed to delete application");
      }
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!job) return <div>Not found</div>;

  const timelineSteps = [
    { label: 'Applied', date: job.applicationDate },
    { label: 'HR Screening', date: null },
    { label: 'Technical Interview', date: job.interviewSchedule?.date || null },
    { label: 'Final Round', date: null },
    { label: 'Offer', date: job.status === 'Offer' ? new Date() : null },
  ];

  return (
    <div className="job-details pb-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <Link to="/jobs" className="d-flex align-items-center gap-2" style={{ color: 'var(--text-color)', textDecoration: 'none', fontWeight: '600', fontSize: '18px' }}>
          <MdArrowBack /> Application Details
        </Link>
        <div className="d-flex gap-2">
          <Link to={`/jobs/edit/${job._id}`} className="btn-primary-custom" style={{ backgroundColor: 'var(--primary-color)' }}>
            <MdEdit /> Edit
          </Link>
          <button className="btn" style={{ backgroundColor: '#fee2e2', color: '#ef4444', borderRadius: '8px', padding: '8px 16px', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }} onClick={handleDelete}>
            <MdDelete /> Delete
          </button>
        </div>
      </div>

      <div className="premium-card mb-4">
        <div className="row align-items-center">
          <div className="col-md-6 d-flex align-items-center gap-3 mb-3 mb-md-0">
            <div style={{ width: '56px', height: '56px', backgroundColor: '#f3effc', borderRadius: '12px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary-color)', fontSize: '24px', fontWeight: 'bold' }}>
              {job.companyName.charAt(0)}
            </div>
            <div>
              <h4 className="mb-0" style={{ fontWeight: '700' }}>{job.companyName}</h4>
              <p className="text-muted mb-0">{job.jobRole}</p>
              {job.jobLink && <a href={job.jobLink} target="_blank" rel="noreferrer" style={{ fontSize: '12px', color: 'var(--primary-color)', textDecoration: 'none' }}><MdLink /> View Job Posting</a>}
            </div>
          </div>
          
          <div className="col-md-6 d-flex justify-content-md-end gap-4 flex-wrap">
            <div>
              <small className="text-muted d-block mb-1">Platform</small>
              <span style={{ fontWeight: '600' }}>{job.platform || 'Company Site'}</span>
            </div>
            <div>
              <small className="text-muted d-block mb-1">Status</small>
              <span className={`status-badge status-${job.status.toLowerCase()}`}>{job.status}</span>
            </div>
            <div>
              <small className="text-muted d-block mb-1">Priority</small>
              <span style={{ color: job.priority === 'High' ? 'var(--priority-high)' : job.priority === 'Medium' ? 'var(--priority-medium)' : 'var(--priority-low)', fontWeight: '600' }}>{job.priority}</span>
            </div>
            <div>
              <small className="text-muted d-block mb-1">Applied Date</small>
              <span style={{ fontWeight: '600' }}>{format(new Date(job.applicationDate), 'dd MMM yyyy')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-lg-8">
          <div className="premium-card h-100 d-flex flex-column gap-4">
            <div>
              <h6 style={{ fontWeight: '600', fontSize: '15px' }}>Job Description / Notes</h6>
              <p className="text-muted" style={{ fontSize: '14px', whiteSpace: 'pre-line' }}>
                {job.notes || 'No description or notes provided for this application.'}
              </p>
            </div>
            
            <div>
              <h6 style={{ fontWeight: '600', fontSize: '15px', marginBottom: '12px' }}>Key Skills</h6>
              <div className="d-flex flex-wrap gap-2">
                {job.skills && job.skills.length > 0 ? (
                  job.skills.map((skill, idx) => (
                    <span key={idx} style={{ padding: '6px 12px', backgroundColor: '#f8f9fa', borderRadius: '20px', fontSize: '12px', fontWeight: '500', color: 'var(--text-color)' }}>• {skill}</span>
                  ))
                ) : (
                  <span className="text-muted" style={{ fontSize: '13px' }}>No skills added.</span>
                )}
              </div>
            </div>

            <div className="mt-4">
              <h6 style={{ fontWeight: '600', fontSize: '15px', marginBottom: '24px' }}>Application Timeline</h6>
              <div className="d-flex justify-content-between position-relative">
                <div style={{ position: 'absolute', top: '12px', left: '0', right: '0', height: '2px', backgroundColor: 'var(--border-color)', zIndex: 0 }}></div>
                {timelineSteps.map((step, idx) => (
                  <div key={idx} className="d-flex flex-column align-items-center position-relative" style={{ zIndex: 1, width: '20%' }}>
                    <div style={{ 
                      width: '26px', height: '26px', borderRadius: '50%', 
                      backgroundColor: step.date ? 'var(--primary-color)' : 'white',
                      border: `2px solid ${step.date ? 'var(--primary-color)' : 'var(--border-color)'}`,
                      marginBottom: '8px'
                    }}></div>
                    <span style={{ fontSize: '11px', fontWeight: '600', color: step.date ? 'var(--text-color)' : 'var(--text-muted)', textAlign: 'center' }}>{step.label}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{step.date ? format(new Date(step.date), 'dd MMM yyyy') : '---'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-4">
          <div className="d-flex flex-column gap-4 h-100">
            <div className="premium-card">
              <h6 style={{ fontWeight: '600', fontSize: '15px', marginBottom: '16px' }}>Interview Schedule</h6>
              {job.interviewSchedule?.date ? (
                <div className="d-flex align-items-start gap-3">
                  <div style={{ padding: '10px', backgroundColor: '#f3effc', borderRadius: '8px', color: 'var(--primary-color)' }}>
                    <MdEvent size={24} />
                  </div>
                  <div>
                    <div style={{ fontWeight: '600', fontSize: '13px' }}>{format(new Date(job.interviewSchedule.date), 'dd MMM yyyy')}</div>
                    <div className="text-muted" style={{ fontSize: '12px', marginBottom: '8px' }}>{format(new Date(job.interviewSchedule.date), 'hh:mm a')}</div>
                    <div style={{ fontSize: '12px' }}><span className="text-muted">Round:</span> {job.interviewSchedule.round || 'Not specified'}</div>
                    <div style={{ fontSize: '12px' }}><span className="text-muted">Mode:</span> {job.interviewSchedule.mode || 'Online'}</div>
                  </div>
                </div>
              ) : (
                <p className="text-muted" style={{ fontSize: '13px', margin: 0 }}>No interviews scheduled yet.</p>
              )}
            </div>

            <div className="premium-card flex-grow-1">
              <h6 style={{ fontWeight: '600', fontSize: '15px', marginBottom: '16px' }}>Documents</h6>
              {job.documents && job.documents.length > 0 ? (
                <div className="d-flex flex-column gap-3">
                  {job.documents.map((doc, idx) => (
                    <div key={idx} className="d-flex justify-content-between align-items-center p-2 rounded" style={{ border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)' }}>
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ color: 'var(--primary-color)' }}>📄</span>
                        <span style={{ fontSize: '13px', fontWeight: '500' }}>{doc.name}</span>
                      </div>
                      <a href={doc.url} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)' }}><MdDownload /></a>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted" style={{ fontSize: '13px', margin: 0 }}>No documents attached.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetails;
