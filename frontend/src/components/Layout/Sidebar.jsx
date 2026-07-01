import { NavLink } from 'react-router-dom';
import { MdDashboard, MdWork, MdAddBox, MdCalendarToday, MdBusiness, MdBarChart, MdMessage, MdSettings, MdLogout } from 'react-icons/md';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = ({ closeSidebar, setShowLogoutModal }) => {
  const { user } = useContext(AuthContext);

  const navLinks = [
    { to: '/', icon: <MdDashboard size={20} />, label: 'Dashboard', exact: true },
    { to: '/jobs', icon: <MdWork size={20} />, label: 'Applications', exact: false },
    { to: '/jobs/new', icon: <MdAddBox size={20} />, label: 'Add Application', exact: true },
    { to: '/calendar', icon: <MdCalendarToday size={20} />, label: 'Calendar', exact: true },
    { to: '/profile', icon: <MdMessage size={20} />, label: 'Profile', exact: true }, // Repurposing message icon for Profile temporarily, or use MdPerson
    { to: '/settings', icon: <MdSettings size={20} />, label: 'Settings', exact: true },
  ];

  return (
    <div className="sidebar" style={{ width: 'var(--sidebar-width)', height: '100vh', backgroundColor: 'var(--sidebar-bg)', display: 'flex', flexDirection: 'column' }}>
      
      <div className="logo p-4 d-flex align-items-center gap-2">
        <div style={{ width: '32px', height: '32px', backgroundColor: 'var(--primary-color)', borderRadius: '8px', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', fontSize: '18px' }}>
          A
        </div>
        <h4 style={{ fontWeight: '700', margin: 0, color: 'var(--text-color)' }}>ApplyMate</h4>
      </div>
      
      <div className="user-profile px-4 py-3 d-flex align-items-center gap-3 mb-2">
        <div 
          className="avatar rounded-circle d-flex justify-content-center align-items-center"
          style={{ width: '45px', height: '45px', backgroundColor: '#e5e7eb', color: 'var(--text-color)', fontSize: '18px', fontWeight: '600' }}
        >
          {user?.name?.charAt(0) || 'U'}
        </div>
        <div>
          <h6 className="mb-0" style={{ fontWeight: '600', fontSize: '14px', color: 'var(--text-color)' }}>{user?.name || 'User'}</h6>
          <small className="text-muted" style={{ fontSize: '12px' }}>Job Seeker</small>
        </div>
      </div>

      <nav className="flex-grow-1 d-flex flex-column gap-1 px-3 mt-2" style={{ overflowY: 'auto' }}>
        {navLinks.map((link) => (
          <NavLink 
            key={link.label}
            to={link.to} 
            end={link.exact}
            onClick={closeSidebar}
            className={({ isActive }) => `nav-link p-2 px-3 rounded-3 d-flex align-items-center gap-3 ${isActive ? 'active' : ''}`}
            style={{ textDecoration: 'none' }}
          >
            {link.icon} <span style={{ fontSize: '14px' }}>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-3 mt-auto border-top" style={{ borderColor: 'var(--border-color)' }}>
        <button 
          onClick={() => { closeSidebar && closeSidebar(); setShowLogoutModal(true); }}
          className="btn w-100 d-flex align-items-center gap-3 text-muted nav-link-hover" 
          style={{ padding: '10px 16px', background: 'none', border: 'none', fontSize: '14px', fontWeight: '500', transition: 'all 0.2s ease' }}
          onMouseOver={(e) => { e.currentTarget.style.color = '#ef4444'; e.currentTarget.style.backgroundColor = '#fee2e2'; e.currentTarget.style.borderRadius = '8px'; }}
          onMouseOut={(e) => { e.currentTarget.style.color = 'var(--text-muted)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          <MdLogout size={20} /> Log out
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
