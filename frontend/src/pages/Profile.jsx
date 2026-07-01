import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { MdPerson, MdEmail, MdLock, MdLogout } from 'react-icons/md';

const Profile = () => {
  const { user, updateGlobalUser, logout } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await api.get('/users/profile');
        setProfile(data);
      } catch (error) {
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchProfile();
  }, [user]);

  const handleSave = async (e) => {
    e?.preventDefault();
    try {
      const updateData = { ...profile };
      const { data } = await api.put('/users/profile', updateData);
      setProfile(data);
      updateGlobalUser(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="profile-page max-w-3xl mx-auto">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 style={{ fontWeight: '600' }}>Account Settings</h4>
      </div>

      <div className="row g-4">
        <div className="col-md-3">
          <div className="premium-card p-2 text-center mb-3">
            {profile?.profilePhoto ? (
              <img src={profile.profilePhoto} alt="Profile" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', margin: '0 auto 16px', display: 'block' }} />
            ) : (
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 16px' }}>
                {profile?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            <h6 style={{ fontWeight: '600' }}>{profile?.name}</h6>
            <p className="text-muted" style={{ fontSize: '13px' }}>{profile?.email}</p>
          </div>
        </div>

        <div className="col-md-9">
          <div className="premium-card animation-fade-in">
            <h5 className="mb-4">Profile Details</h5>
            <form onSubmit={handleSave}>
              <div className="row g-4 mb-4">
                <div className="col-md-6">
                  <label className="form-label text-muted small">Full Name</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white"><MdPerson /></span>
                    <input type="text" name="name" className="form-control form-control-custom border-start-0" value={profile.name || ''} onChange={handleChange} disabled />
                  </div>
                  <small className="text-muted" style={{ fontSize: '11px' }}>Name cannot be changed.</small>
                </div>
                
                <div className="col-md-6">
                  <label className="form-label text-muted small">Email Address</label>
                  <div className="input-group">
                    <span className="input-group-text bg-white"><MdEmail /></span>
                    <input type="email" name="email" className="form-control form-control-custom border-start-0" value={profile.email || ''} onChange={handleChange} disabled />
                  </div>
                  <small className="text-muted" style={{ fontSize: '11px' }}>Email cannot be changed.</small>
                </div>
              </div>



              <div className="d-flex justify-content-end align-items-center border-top pt-4 mt-2">
                <button 
                  type="button" 
                  className="btn btn-outline-danger d-flex align-items-center gap-2" 
                  onClick={() => {
                    if(window.confirm('Are you sure you want to log out?')) {
                      logout();
                    }
                  }} 
                  style={{ fontWeight: '500' }}
                >
                  <MdLogout /> Log Out
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        .animation-fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Profile;
