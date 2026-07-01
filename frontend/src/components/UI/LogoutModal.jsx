import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const LogoutModal = ({ show, onClose }) => {
  const { logout } = useContext(AuthContext);

  if (!show) return null;

  return (
    <div className="modal-backdrop" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div className="premium-card" style={{ width: '90%', maxWidth: '400px', animation: 'scaleIn 0.2s ease-out' }}>
        <h5 style={{ fontWeight: '600', marginBottom: '16px' }}>Logout</h5>
        <p className="text-muted" style={{ marginBottom: '24px' }}>Are you sure you want to logout?</p>
        <div className="d-flex justify-content-end gap-3">
          <button 
            className="btn" 
            style={{ padding: '8px 16px', backgroundColor: '#f3f4f6', color: 'var(--text-color)', borderRadius: '8px', fontWeight: '500' }}
            onClick={onClose}
          >
            Cancel
          </button>
          <button 
            className="btn" 
            style={{ padding: '8px 16px', backgroundColor: '#ef4444', color: 'white', borderRadius: '8px', fontWeight: '500' }}
            onClick={() => {
              logout();
              onClose();
            }}
          >
            Logout
          </button>
        </div>
      </div>
      <style>{`
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LogoutModal;
