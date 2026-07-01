import { MdMenu, MdSearch, MdNotifications, MdSettings, MdClose } from 'react-icons/md';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useLocation, Link } from 'react-router-dom';
import api from '../../api/axios';

const TopBar = ({ toggleSidebar, searchQuery, setSearchQuery }) => {
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    const checkUnreadNotifications = async () => {
      try {
        const { data: jobs } = await api.get('/jobs');
        let unreadCount = 0;
        const readStates = JSON.parse(localStorage.getItem('readNotifications') || '{}');
        
        jobs.forEach((job, index) => {
          if (job.interviewSchedule?.date) {
            const interviewDateStr = job.interviewSchedule.date.substring(0, 10);
            const todayStr = new Date().toISOString().substring(0, 10);
            const d1 = new Date(interviewDateStr + 'T00:00:00Z');
            const d2 = new Date(todayStr + 'T00:00:00Z');
            const diffDays = Math.round((d1 - d2) / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0 && !readStates[`int-0-${index}`]) unreadCount++;
            else if (diffDays === 1 && !readStates[`int-1-${index}`]) unreadCount++;
            else if (diffDays === 2 && !readStates[`int-2-${index}`]) unreadCount++;
            else if (diffDays < 0 && diffDays > -7 && !readStates[`follow-${index}`]) unreadCount++;
          }
          if (job.status === 'Offer' && !readStates[`off-${index}`]) unreadCount++;
        });

        if (jobs.length === 0 && !readStates['welcome-1']) unreadCount++;

        setHasUnread(unreadCount > 0);
      } catch (error) {
        console.error('Failed to check notifications');
      }
    };
    
    if (user) checkUnreadNotifications();
  }, [user, location.pathname]); // Re-check when navigating

  let title = 'HELLO, ' + (user?.name ? user.name.split(' ')[0].toUpperCase() + '!' : 'GUEST!');
  if (location.pathname === '/jobs') title = 'Applications';
  else if (location.pathname === '/jobs/new') title = 'Add Application';
  else if (location.pathname.startsWith('/jobs/edit')) title = 'Edit Application';

  return (
    <div className="topbar d-flex justify-content-between align-items-center px-4 py-3" style={{ backgroundColor: 'transparent' }}>
      <div className="d-flex align-items-center gap-3">
        <button 
          className="btn d-lg-none p-0" 
          onClick={toggleSidebar}
          style={{ background: 'none', border: 'none', color: 'var(--text-color)' }}
        >
          <MdMenu size={28} />
        </button>
        <h4 className="mb-0 d-none d-md-block" style={{ fontWeight: '600', color: 'var(--text-color)', letterSpacing: '0.5px' }}>
          {title}
        </h4>
      </div>
      
      <div className="d-flex align-items-center gap-4">
        <div className="d-none d-md-flex position-relative">
          <input 
            type="text" 
            className="form-control" 
            placeholder="Search by company or role..." 
            value={searchQuery || ''}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ 
              paddingLeft: '44px', 
              paddingRight: '44px',
              width: '300px', 
              borderRadius: '20px', 
              border: '1px solid var(--border-color)',
              backgroundColor: 'var(--card-bg)',
              fontSize: '13px',
              color: 'var(--text-color)'
            }}
          />
          <MdSearch size={20} className="position-absolute text-muted" style={{ left: '16px', top: '50%', transform: 'translateY(-50%)' }} />
          {searchQuery && (
            <MdClose 
              size={18} 
              className="position-absolute text-muted" 
              style={{ right: '16px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer' }} 
              onClick={() => setSearchQuery('')}
            />
          )}
        </div>
        
        <div className="d-flex align-items-center gap-2">
          <Link to="/notifications" className="btn p-2 rounded-circle d-flex align-items-center justify-content-center position-relative" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-color)', border: '1px solid var(--border-color)', textDecoration: 'none' }}>
            <MdNotifications size={20} />
            {hasUnread && (
              <span className="position-absolute translate-middle p-1 bg-danger border border-light rounded-circle" style={{ top: '6px', right: '0px' }}>
                <span className="visually-hidden">New alerts</span>
              </span>
            )}
          </Link>
          <Link to="/settings" className="btn p-2 rounded-circle d-flex align-items-center justify-content-center" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text-color)', border: '1px solid var(--border-color)', textDecoration: 'none' }}>
            <MdSettings size={20} />
          </Link>
          <Link to="/profile" style={{ textDecoration: 'none' }}>
            <div 
              className="avatar rounded-circle d-flex justify-content-center align-items-center ms-2"
              style={{ width: '40px', height: '40px', backgroundColor: 'var(--primary-color)', color: 'white', fontSize: '16px', fontWeight: '600' }}
            >
              {user?.name?.charAt(0) || 'U'}
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
