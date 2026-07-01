import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import illustration from '../assets/login-illustration.png';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { register } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    register(name, email, password);
  };

  return (
    <div className="d-flex" style={{ minHeight: '100vh', backgroundColor: '#f7eff9', color: '#312e43' }}>
      {/* Left side - Illustration */}
      <div className="d-none d-lg-flex flex-column justify-content-center align-items-center" style={{ flex: 1, backgroundColor: 'white', borderRight: '1px solid #e5dfee', padding: '40px' }}>
        <h2 style={{ color: '#6a539b', fontWeight: '700', marginBottom: '20px' }}>Welcome to ApplyMate</h2>
        <p className="text-muted mb-5">Track your job applications in one place</p>
        <div style={{ width: '80%', height: '400px', backgroundColor: '#f3effc', borderRadius: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
          <img src={illustration} alt="ApplyMate Dashboard" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
        <p className="mt-5">Already have an account? <Link to="/login" style={{ color: '#6a539b', fontWeight: '600', textDecoration: 'none' }}>Login</Link></p>
      </div>

      {/* Right side - Form */}
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ flex: 1, padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div className="text-center mb-5">
            <h2 style={{ color: '#6a539b', fontWeight: '700', marginBottom: '10px' }}>Create Account</h2>
            <p className="text-muted">Start tracking your dream job</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label text-muted" style={{ fontSize: '14px' }}>Full Name</label>
              <input 
                type="text" 
                className="form-control-custom w-100" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Sophia Johnson"
                required
                style={{ backgroundColor: '#f8f9fa', border: 'none', color: '#312e43' }}
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-muted" style={{ fontSize: '14px' }}>Email Address</label>
              <input 
                type="email" 
                className="form-control-custom w-100" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="sophia@example.com"
                required
                style={{ backgroundColor: '#f8f9fa', border: 'none', color: '#312e43' }}
              />
            </div>
            
            <div className="mb-4">
              <label className="form-label text-muted" style={{ fontSize: '14px' }}>Password</label>
              <input 
                type="password" 
                className="form-control-custom w-100" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ backgroundColor: '#f8f9fa', border: 'none', color: '#312e43' }}
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-muted" style={{ fontSize: '14px' }}>Confirm Password</label>
              <input 
                type="password" 
                className="form-control-custom w-100" 
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ backgroundColor: '#f8f9fa', border: 'none', color: '#312e43' }}
              />
            </div>

            <div className="form-check mb-5">
              <input className="form-check-input" type="checkbox" id="terms" required />
              <label className="form-check-label text-muted" htmlFor="terms" style={{ fontSize: '14px' }}>
                I agree to the Terms & Conditions
              </label>
            </div>

            <button type="submit" className="btn w-100 py-3" style={{ backgroundColor: '#6a539b', color: 'white', borderRadius: '12px', fontWeight: '600' }}>
              Sign up
            </button>
          </form>
          
          <div className="d-lg-none mt-4 text-center">
            <p className="text-muted">Already have an account? <Link to="/login" style={{ color: '#6a539b', fontWeight: '600', textDecoration: 'none' }}>Login</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
