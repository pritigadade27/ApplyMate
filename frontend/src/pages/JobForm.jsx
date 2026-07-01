import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { MdArrowBack, MdSave } from 'react-icons/md';
import api from '../api/axios';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const JobForm = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    jobRole: '',
    location: '',
    applicationDate: new Date().toISOString().split('T')[0],
    status: 'Applied',
    priority: 'Medium',
    platform: 'Company Site',
    jobLink: '',
    notes: '',
    interviewSchedule: {
      date: '',
      time: '',
      mode: 'Online'
    }
  });
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (isEdit) {
      const fetchJob = async () => {
        setInitialLoading(true);
        try {
          const { data } = await api.get(`/jobs/${id}`);
          setFormData({
            ...data,
            applicationDate: new Date(data.applicationDate).toISOString().split('T')[0],
            interviewSchedule: {
              date: data.interviewSchedule?.date ? new Date(data.interviewSchedule.date).toISOString().split('T')[0] : '',
              time: data.interviewSchedule?.time || '',
              mode: data.interviewSchedule?.mode || 'Online'
            }
          });
        } catch (error) {
          toast.error('Failed to load job details');
          navigate('/jobs');
        } finally {
          setInitialLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e) => {
    if (['date', 'time', 'mode'].includes(e.target.name)) {
      setFormData({
        ...formData,
        interviewSchedule: { ...formData.interviewSchedule, [e.target.name]: e.target.value }
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = { ...formData };
      if (payload.status === 'Interview' && !payload.interviewSchedule?.date) {
        toast.error('Interview Date is required when status is Interview');
        setLoading(false);
        return;
      }
      if (!payload.interviewSchedule?.date) {
        payload.interviewSchedule = null;
      }

      if (isEdit) {
        await api.put(`/jobs/${id}`, payload);
        toast.success('Job updated successfully');
      } else {
        await api.post('/jobs', payload);
        toast.success('Job application added');
      }
      navigate('/jobs');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="d-flex align-items-center gap-3 mb-4">
        <Link to="/jobs" className="btn btn-light rounded-circle p-2 d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px' }}>
          <MdArrowBack size={24} />
        </Link>
        <h4 style={{ fontWeight: '600', margin: 0 }}>
          {isEdit ? 'Edit Application' : 'New Application'}
        </h4>
      </div>

      <div className="premium-card">
        <form onSubmit={handleSubmit}>
          <div className="row g-4">
            <div className="col-md-6">
              <label className="form-label" style={{ fontWeight: '500' }}>Company Name *</label>
              <input type="text" className="form-control-custom w-100" name="companyName" value={formData.companyName} onChange={handleChange} required />
            </div>
            
            <div className="col-md-6">
              <label className="form-label" style={{ fontWeight: '500' }}>Job Role *</label>
              <input type="text" className="form-control-custom w-100" name="jobRole" value={formData.jobRole} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label" style={{ fontWeight: '500' }}>Location *</label>
              <input type="text" className="form-control-custom w-100" name="location" value={formData.location} onChange={handleChange} required />
            </div>

            <div className="col-md-6">
              <label className="form-label" style={{ fontWeight: '500' }}>Application Date *</label>
              <input type="date" className="form-control-custom w-100" name="applicationDate" value={formData.applicationDate} onChange={handleChange} required />
            </div>

            <div className="col-md-4">
              <label className="form-label text-muted" style={{ fontSize: '13px', fontWeight: '500' }}>Platform *</label>
              <select className="form-control-custom w-100" name="platform" value={formData.platform} onChange={handleChange} required>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Indeed">Indeed</option>
                <option value="Company Site">Company Site</option>
                <option value="Naukri">Naukri</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label text-muted" style={{ fontSize: '13px', fontWeight: '500' }}>Status *</label>
              <select className="form-control-custom w-100" name="status" value={formData.status} onChange={handleChange} required>
                <option value="Applied">Applied</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
              </select>
            </div>

            <div className="col-md-4">
              <label className="form-label text-muted" style={{ fontSize: '13px', fontWeight: '500' }}>Priority *</label>
              <select className="form-control-custom w-100" name="priority" value={formData.priority} onChange={handleChange} required>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="col-12 mt-4 p-4 rounded" style={{ backgroundColor: '#f3effc' }}>
              <h6 className="mb-3" style={{ fontWeight: '600', color: 'var(--primary-color)' }}>Interview Details (Optional)</h6>
              <div className="row g-3">
                <div className="col-md-4">
                  <label className="form-label" style={{ fontWeight: '500', fontSize: '13px' }}>Interview Date</label>
                  <input type="date" className="form-control-custom w-100 bg-white" name="date" value={formData.interviewSchedule?.date || ''} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label" style={{ fontWeight: '500', fontSize: '13px' }}>Interview Time</label>
                  <input type="time" className="form-control-custom w-100 bg-white" name="time" value={formData.interviewSchedule?.time || ''} onChange={handleChange} />
                </div>
                <div className="col-md-4">
                  <label className="form-label" style={{ fontWeight: '500', fontSize: '13px' }}>Mode</label>
                  <select className="form-control-custom w-100 bg-white" name="mode" value={formData.interviewSchedule?.mode || 'Online'} onChange={handleChange}>
                    <option value="Online">Online</option>
                    <option value="In-Person">In-Person</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="col-12">
              <label className="form-label" style={{ fontWeight: '500' }}>Job Posting Link</label>
              <input type="url" className="form-control-custom w-100" name="jobLink" value={formData.jobLink} onChange={handleChange} placeholder="https://..." />
            </div>

            <div className="col-12">
              <label className="form-label" style={{ fontWeight: '500' }}>Notes</label>
              <textarea className="form-control-custom w-100" name="notes" value={formData.notes} onChange={handleChange} rows="4" placeholder="Any additional information..."></textarea>
            </div>

            <div className="col-12 d-flex justify-content-end mt-5 gap-3">
              <Link to="/jobs" className="btn btn-light rounded-pill px-4" style={{ fontWeight: '500' }}>Cancel</Link>
              <button type="submit" className="btn-primary-custom" disabled={loading}>
                {loading ? <span className="spinner-border spinner-border-sm" /> : <><MdSave size={20} /> Save Application</>}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
