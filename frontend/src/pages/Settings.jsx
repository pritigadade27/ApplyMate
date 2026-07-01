import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { MdPalette, MdNotifications, MdSecurity, MdPerson, MdCheck } from 'react-icons/md';
import { toast } from 'react-toastify';
import api from '../api/axios';

const Settings = () => {
  const { theme, setTheme } = useOutletContext();
  const [activeTab, setActiveTab] = useState('appearance');
  const [compactMode, setCompactMode] = useState(localStorage.getItem('compactMode') === 'true');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCompactMode = (e) => {
    setCompactMode(e.target.checked);
    localStorage.setItem('compactMode', e.target.checked);
    toast.success('Compact mode ' + (e.target.checked ? 'enabled' : 'disabled'));
    // In a real app, this would toggle a global CSS class
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    try {
      await api.put('/users/profile', {
        currentPassword,
        password: newPassword
      });
      toast.success('Password updated successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-page">
      <h4 className="mb-4" style={{ fontWeight: '600' }}>Settings</h4>
      
      <div className="row g-4">
        {/* Sidebar Nav for Settings */}
        <div className="col-md-3">
          <div className="premium-card p-2">
            <div className="d-flex flex-column gap-1">
              <button 
                className={`btn text-start p-3 ${activeTab === 'appearance' ? 'active' : ''}`}
                style={{ 
                  borderRadius: '8px', 
                  backgroundColor: activeTab === 'appearance' ? '#f3effc' : 'transparent',
                  color: activeTab === 'appearance' ? 'var(--primary-color)' : 'var(--text-muted)',
                  fontWeight: activeTab === 'appearance' ? '600' : '500'
                }}
                onClick={() => setActiveTab('appearance')}
              >
                <MdPalette size={20} className="me-2" /> Appearance
              </button>
              <button 
                className={`btn text-start p-3 ${activeTab === 'notifications' ? 'active' : ''}`}
                style={{ 
                  borderRadius: '8px', 
                  backgroundColor: activeTab === 'notifications' ? '#f3effc' : 'transparent',
                  color: activeTab === 'notifications' ? 'var(--primary-color)' : 'var(--text-muted)',
                  fontWeight: activeTab === 'notifications' ? '600' : '500'
                }}
                onClick={() => setActiveTab('notifications')}
              >
                <MdNotifications size={20} className="me-2" /> Notifications
              </button>
              <button 
                className={`btn text-start p-3 ${activeTab === 'security' ? 'active' : ''}`}
                style={{ 
                  borderRadius: '8px', 
                  backgroundColor: activeTab === 'security' ? '#f3effc' : 'transparent',
                  color: activeTab === 'security' ? 'var(--primary-color)' : 'var(--text-muted)',
                  fontWeight: activeTab === 'security' ? '600' : '500'
                }}
                onClick={() => setActiveTab('security')}
              >
                <MdSecurity size={20} className="me-2" /> Security
              </button>
              <button 
                className={`btn text-start p-3 ${activeTab === 'account' ? 'active' : ''}`}
                style={{ 
                  borderRadius: '8px', 
                  backgroundColor: activeTab === 'account' ? '#fee2e2' : 'transparent',
                  color: activeTab === 'account' ? '#ef4444' : 'var(--text-muted)',
                  fontWeight: activeTab === 'account' ? '600' : '500'
                }}
                onClick={() => setActiveTab('account')}
              >
                <MdPerson size={20} className="me-2" /> Account
              </button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="col-md-9">
          <div className="premium-card">
            
            {activeTab === 'appearance' && (
              <div className="animation-fade-in">
                <h5 className="mb-4">Appearance</h5>
                
                <div className="mb-5">
                  <h6 className="mb-3">Theme</h6>
                  <div className="d-flex gap-3">
                    <div 
                      className="theme-option p-3 border rounded text-center cursor-pointer"
                      style={{ borderColor: theme === 'light' ? 'var(--primary-color)' : 'var(--border-color)', backgroundColor: theme === 'light' ? '#f3effc' : 'var(--card-bg)', flex: 1 }}
                      onClick={() => setTheme('light')}
                    >
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '50%', margin: '0 auto 10px' }}></div>
                      <span style={{ fontWeight: '500' }}>Light</span>
                      {theme === 'light' && <MdCheck className="d-block mx-auto mt-2 text-primary" />}
                    </div>
                    
                    <div 
                      className="theme-option p-3 border rounded text-center cursor-pointer"
                      style={{ borderColor: theme === 'dark' ? 'var(--primary-color)' : 'var(--border-color)', backgroundColor: theme === 'dark' ? 'rgba(106, 83, 155, 0.1)' : 'var(--card-bg)', flex: 1 }}
                      onClick={() => setTheme('dark')}
                    >
                      <div style={{ width: '40px', height: '40px', backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '50%', margin: '0 auto 10px' }}></div>
                      <span style={{ fontWeight: '500' }}>Dark</span>
                      {theme === 'dark' && <MdCheck className="d-block mx-auto mt-2 text-primary" />}
                    </div>

                    <div 
                      className="theme-option p-3 border rounded text-center cursor-pointer"
                      style={{ borderColor: theme === 'system' ? 'var(--primary-color)' : 'var(--border-color)', backgroundColor: theme === 'system' ? '#f3effc' : 'var(--card-bg)', flex: 1 }}
                      onClick={() => setTheme('system')}
                    >
                      <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #f8fafc 50%, #0f172a 50%)', border: '1px solid #e2e8f0', borderRadius: '50%', margin: '0 auto 10px' }}></div>
                      <span style={{ fontWeight: '500' }}>System</span>
                      {theme === 'system' && <MdCheck className="d-block mx-auto mt-2 text-primary" />}
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h6 className="mb-3">Personalization</h6>
                  <div className="d-flex align-items-center justify-content-between p-3 border rounded">
                    <div>
                      <p className="mb-1" style={{ fontWeight: '500' }}>Compact Mode</p>
                      <p className="mb-0 text-muted" style={{ fontSize: '13px' }}>Reduce spacing and padding to fit more content on screen.</p>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" role="switch" checked={compactMode} onChange={handleCompactMode} style={{ width: '40px', height: '20px' }} />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="animation-fade-in">
                <h5 className="mb-4">Notifications</h5>
                <div className="d-flex flex-column gap-3">
                  <div className="d-flex align-items-center justify-content-between p-3 border rounded">
                    <div>
                      <p className="mb-1" style={{ fontWeight: '500' }}>Email Notifications</p>
                      <p className="mb-0 text-muted" style={{ fontSize: '13px' }}>Receive weekly summaries of your application activity.</p>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" role="switch" defaultChecked style={{ width: '40px', height: '20px' }} />
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between p-3 border rounded">
                    <div>
                      <p className="mb-1" style={{ fontWeight: '500' }}>Interview Reminders</p>
                      <p className="mb-0 text-muted" style={{ fontSize: '13px' }}>Get reminded 24 hours before an upcoming interview.</p>
                    </div>
                    <div className="form-check form-switch">
                      <input className="form-check-input" type="checkbox" role="switch" defaultChecked style={{ width: '40px', height: '20px' }} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="animation-fade-in">
                <h5 className="mb-4">Security</h5>
                
                <form onSubmit={handlePasswordChange}>
                  <div className="mb-3">
                    <label className="form-label" style={{ fontWeight: '500' }}>Current Password</label>
                    <input type="password" required value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="form-control form-control-custom" placeholder="Enter current password" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label" style={{ fontWeight: '500' }}>New Password</label>
                    <input type="password" required value={newPassword} onChange={e => setNewPassword(e.target.value)} className="form-control form-control-custom" placeholder="Enter new password" />
                  </div>
                  <div className="mb-4">
                    <label className="form-label" style={{ fontWeight: '500' }}>Confirm New Password</label>
                    <input type="password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="form-control form-control-custom" placeholder="Confirm new password" />
                  </div>
                  <button type="submit" disabled={loading} className="btn btn-primary-custom">
                    {loading ? <span className="spinner-border spinner-border-sm" /> : 'Update Password'}
                  </button>
                </form>

              </div>
            )}

            {activeTab === 'account' && (
              <div className="animation-fade-in">
                <h5 className="mb-4" style={{ color: '#ef4444' }}>Danger Zone</h5>
                
                <div className="p-4 border rounded" style={{ borderColor: '#fecaca', backgroundColor: '#fef2f2' }}>
                  <h6 style={{ fontWeight: '600', color: '#b91c1c' }}>Delete Account</h6>
                  <p className="text-muted" style={{ fontSize: '14px', marginBottom: '20px' }}>
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button className="btn" style={{ backgroundColor: '#ef4444', color: 'white', fontWeight: '500', padding: '8px 20px', borderRadius: '8px' }}>
                    Delete your account
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .cursor-pointer { cursor: pointer; }
        .animation-fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default Settings;
