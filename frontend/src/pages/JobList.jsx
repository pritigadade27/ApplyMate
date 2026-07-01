import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { MdEdit, MdDelete, MdAdd, MdSearch } from 'react-icons/md';
import { toast } from 'react-toastify';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import ConfirmModal from '../components/UI/ConfirmModal';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  
  const { user } = useContext(AuthContext);

  // Pagination & Modal
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 10;
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null });

  const fetchJobs = async () => {
    try {
      const { data } = await api.get('/jobs');
      setJobs(data);
    } catch (error) {
      toast.error('Error fetching jobs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchJobs();
  }, [user]);

  const handleDelete = async () => {
    try {
      await api.delete(`/jobs/${deleteModal.id}`);
      setJobs(jobs.filter(job => job._id !== deleteModal.id));
      toast.success('Job deleted successfully');
    } catch (error) {
      toast.error('Error deleting job');
    } finally {
      setDeleteModal({ show: false, id: null });
    }
  };

  let filteredJobs = jobs.filter(job => {
    const matchesSearch = job.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.jobRole.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? job.status === statusFilter : true;
    const matchesPlatform = platformFilter ? job.platform === platformFilter : true;
    const matchesPriority = priorityFilter ? job.priority === priorityFilter : true;
    return matchesSearch && matchesStatus && matchesPlatform && matchesPriority;
  });

  const priorityWeight = { 'High': 3, 'Medium': 2, 'Low': 1 };
  
  filteredJobs = filteredJobs.sort((a, b) => {
    if (sortOrder === 'newest') return new Date(b.applicationDate) - new Date(a.applicationDate);
    if (sortOrder === 'oldest') return new Date(a.applicationDate) - new Date(b.applicationDate);
    if (sortOrder === 'company_asc') return a.companyName.localeCompare(b.companyName);
    if (sortOrder === 'company_desc') return b.companyName.localeCompare(a.companyName);
    if (sortOrder === 'priority_high') return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
    if (sortOrder === 'priority_low') return (priorityWeight[a.priority] || 0) - (priorityWeight[b.priority] || 0);
    return 0;
  });

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="premium-card" style={{ minHeight: '80vh' }}>
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h5 style={{ fontWeight: '600', margin: 0 }}>Applications</h5>
        <Link to="/jobs/new" className="btn-primary-custom">
          <MdAdd size={18} /> Add Application
        </Link>
      </div>

      <div className="mb-4">
        <div className="search-bar position-relative mb-3 d-flex align-items-center">
          <MdSearch size={22} className="position-absolute" style={{ left: '16px', color: 'var(--text-muted)' }} />
          <input 
            type="text" 
            placeholder="Search by company or role..." 
            className="form-control w-100"
            style={{ borderRadius: '8px', border: '1px solid var(--border-color)', padding: '12px 12px 12px 52px', fontSize: '13px' }}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>

        <div className="d-flex gap-3 flex-wrap">
          <select 
            className="form-control" 
            style={{ width: 'auto', minWidth: '130px', fontSize: '12px', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select 
            className="form-control" 
            style={{ width: 'auto', minWidth: '130px', fontSize: '12px', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
            value={platformFilter}
            onChange={(e) => { setPlatformFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="">All Platforms</option>
            <option value="LinkedIn">LinkedIn</option>
            <option value="Indeed">Indeed</option>
            <option value="Company Site">Company Site</option>
            <option value="Naukri">Naukri</option>
          </select>

          <select 
            className="form-control" 
            style={{ width: 'auto', minWidth: '130px', fontSize: '12px', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
            value={priorityFilter}
            onChange={(e) => { setPriorityFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
          
          <select 
            className="form-control ms-auto" 
            style={{ width: 'auto', minWidth: '130px', fontSize: '12px', padding: '8px 12px', borderRadius: '8px', border: '1px solid var(--border-color)' }}
            value={sortOrder}
            onChange={(e) => { setSortOrder(e.target.value); setCurrentPage(1); }}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="company_asc">Company A-Z</option>
            <option value="company_desc">Company Z-A</option>
            <option value="priority_high">High Priority</option>
            <option value="priority_low">Low Priority</option>
          </select>
        </div>
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
            {currentJobs.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-5 text-muted">No job applications found.</td>
              </tr>
            ) : (
              currentJobs.map(job => (
                <tr key={job._id}>
                  <td>
                    <div className="d-flex align-items-center gap-3">
                      <div style={{ width: '28px', height: '28px', backgroundColor: '#f3effc', borderRadius: '6px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--primary-color)', fontSize: '14px', fontWeight: 'bold' }}>
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
                    <div className="d-flex justify-content-end gap-3">
                      <Link to={`/jobs/edit/${job._id}`} className="text-muted" style={{ textDecoration: 'none' }}>
                        <MdEdit size={18} />
                      </Link>
                      <button 
                        className="text-muted p-0" 
                        style={{ background: 'none', border: 'none' }}
                        onClick={() => setDeleteModal({ show: true, id: job._id })}
                      >
                        <MdDelete size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-end mt-4 gap-2">
          {Array.from({ length: totalPages }).map((_, idx) => (
            <button 
              key={idx} 
              className="btn"
              style={{ 
                width: '32px', height: '32px', padding: 0, borderRadius: '8px',
                backgroundColor: currentPage === idx + 1 ? 'var(--primary-color)' : 'var(--bg-color)',
                color: currentPage === idx + 1 ? 'white' : 'var(--text-color)',
                fontSize: '12px',
                border: 'none'
              }}
              onClick={() => setCurrentPage(idx + 1)}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}

      <ConfirmModal 
        show={deleteModal.show} 
        onClose={() => setDeleteModal({ show: false, id: null })} 
        onConfirm={handleDelete}
        title="Delete Application"
        message="Are you sure you want to delete this job application? This action cannot be undone."
      />
    </div>
  );
};

export default JobList;
