import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import illustration from '../assets/login-illustration.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
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
        <p className="mt-5">Don't have an account? <Link to="/register" style={{ color: '#6a539b', fontWeight: '600', textDecoration: 'none' }}>Sign up</Link></p>
      </div>

      {/* Right side - Form */}
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ flex: 1, padding: '40px' }}>
        <div style={{ width: '100%', maxWidth: '400px' }}>
          <div className="text-center mb-5">
            <h2 style={{ color: '#6a539b', fontWeight: '700', marginBottom: '10px' }}>Welcome Back!</h2>
            <p className="text-muted">Login to your account</p>
          </div>

          <form onSubmit={handleSubmit}>
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

            <div className="d-flex justify-content-between align-items-center mb-5">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="rememberMe" />
                <label className="form-check-label text-muted" htmlFor="rememberMe" style={{ fontSize: '14px' }}>
                  Remember me
                </label>
              </div>
              <Link to="/forgotpassword" style={{ color: '#6a539b', fontSize: '14px', textDecoration: 'none' }}>Forgot password?</Link>
            </div>

            <button type="submit" className="btn w-100 py-3" style={{ backgroundColor: '#6a539b', color: 'white', borderRadius: '12px', fontWeight: '600' }}>
              Login
            </button>
          </form>
          
          <div className="d-lg-none mt-4 text-center">
            <p className="text-muted">Don't have an account? <Link to="/register" style={{ color: '#6a539b', fontWeight: '600', textDecoration: 'none' }}>Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
