import { useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { toast } from 'react-toastify';
import illustration from '../assets/login-illustration.png';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    
    try {
      const { data } = await api.post('/users/forgotpassword', { email });
      if (data.previewUrl) {
        toast.info('Opening simulated email inbox (Ethereal)...', { autoClose: 3000 });
        setTimeout(() => {
          window.open(data.previewUrl, '_blank');
          toast.success('Check the simulated email for your reset link!');
          setEmail('');
        }, 3000);
      } else {
        toast.success('Password reset email sent! Please check your inbox.');
        setEmail('');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset email');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f7eff9', color: '#312e43' }}>
      {/* Left side - Illustration */}
      <div className="d-none d-lg-flex flex-column justify-content-center align-items-center" style={{ flex: 1, backgroundColor: 'white', borderRight: '1px solid #e5dfee', padding: '40px' }}>
        <h2 style={{ color: '#6a539b', fontWeight: '700', marginBottom: '20px' }}>Reset Password</h2>
        <p className="text-muted mb-5">Don't worry, it happens to the best of us.</p>
        <div style={{ width: '80%', height: '400px', backgroundColor: '#f3effc', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
          <img src={illustration} alt="ApplyMate Dashboard" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <p className="mt-5">Remembered your password? <Link to="/login" style={{ color: '#6a539b', fontWeight: '600', textDecoration: 'none' }}>Login</Link></p>
      </div>

      {/* Right side - Form */}
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ flex: 1, padding: '40px' }}>
        <div className="w-100" style={{ maxWidth: '400px' }}>
          <div className="text-center mb-5 d-lg-none">
            <h2 style={{ color: '#6a539b', fontWeight: '700' }}>ApplyMate</h2>
            <p className="text-muted">Reset your password</p>
          </div>

          <h3 className="mb-4" style={{ fontWeight: '600', color: '#312e43' }}>Forgot Password?</h3>
          <p className="text-muted mb-4" style={{ fontSize: '14px' }}>Enter the email address associated with your account and we'll send you a link to reset your password.</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label" style={{ fontWeight: '500', color: '#312e43' }}>Email Address</label>
              <input 
                type="email" 
                className="form-control form-control-custom" 
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary-custom w-100 justify-content-center mb-4" style={{ padding: '12px' }} disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Link'}
            </button>
            
            <div className="text-center d-lg-none">
              <p>Remembered your password? <Link to="/login" style={{ color: '#6a539b', fontWeight: '600', textDecoration: 'none' }}>Login</Link></p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
