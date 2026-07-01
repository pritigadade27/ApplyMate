import { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import illustration from '../assets/login-illustration.png';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { resettoken } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error('Passwords do not match');
    }
    
    setLoading(true);
    try {
      await api.put(`/users/resetpassword/${resettoken}`, { password });
      toast.success('Password reset successful! You can now login.');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password. Link may be expired.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f7eff9', color: '#312e43' }}>
      {/* Left side - Illustration */}
      <div className="d-none d-lg-flex flex-column justify-content-center align-items-center" style={{ flex: 1, backgroundColor: 'white', borderRight: '1px solid #e5dfee', padding: '40px' }}>
        <h2 style={{ color: '#6a539b', fontWeight: '700', marginBottom: '20px' }}>Secure Account</h2>
        <p className="text-muted mb-5">Create a strong, new password.</p>
        <div style={{ width: '80%', height: '400px', backgroundColor: '#f3effc', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
          <img src={illustration} alt="ApplyMate Dashboard" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </div>

      {/* Right side - Form */}
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ flex: 1, padding: '40px' }}>
        <div className="w-100" style={{ maxWidth: '400px' }}>
          <h3 className="mb-4" style={{ fontWeight: '600', color: '#312e43' }}>Create New Password</h3>
          <p className="text-muted mb-4" style={{ fontSize: '14px' }}>Please enter your new password below.</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label" style={{ fontWeight: '500', color: '#312e43' }}>New Password</label>
              <input 
                type="password" 
                className="form-control form-control-custom" 
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>
            
            <div className="mb-4">
              <label className="form-label" style={{ fontWeight: '500', color: '#312e43' }}>Confirm New Password</label>
              <input 
                type="password" 
                className="form-control form-control-custom" 
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength="6"
              />
            </div>

            <button type="submit" className="btn btn-primary-custom w-100 justify-content-center mb-4" style={{ padding: '12px' }} disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
