import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import LogoutModal from '../UI/LogoutModal';

const Layout = ({ theme, toggleTheme, setTheme }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  useEffect(() => {
    const savedWidth = localStorage.getItem('sidebarWidth') || '240';
    document.documentElement.style.setProperty('--sidebar-width', `${savedWidth}px`);
  }, []);

  const handleMouseDown = (e) => {
    e.preventDefault();
    const handleMouseMove = (moveEvent) => {
      let newWidth = moveEvent.clientX;
      if (newWidth < 200) newWidth = 200;
      if (newWidth > 500) newWidth = 500;
      document.documentElement.style.setProperty('--sidebar-width', `${newWidth}px`);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      const finalWidth = document.documentElement.style.getPropertyValue('--sidebar-width');
      localStorage.setItem('sidebarWidth', finalWidth.replace('px', ''));
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <div className="app-container">
      <div className={`sidebar-container ${sidebarOpen ? 'open' : ''}`} style={{ position: 'relative' }}>
        <Sidebar closeSidebar={() => setSidebarOpen(false)} setShowLogoutModal={setShowLogoutModal} />
        {/* Resize Handle */}
        <div 
          onMouseDown={handleMouseDown}
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '4px',
            height: '100%',
            cursor: 'col-resize',
            backgroundColor: 'transparent',
            zIndex: 10
          }}
          className="resize-handle"
        />
      </div>
      <div className="main-content">
        <TopBar 
          toggleSidebar={toggleSidebar} 
          theme={theme} 
          toggleTheme={toggleTheme} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
        <div className="page-content">
          <Outlet context={{ theme, setTheme, searchQuery, setSearchQuery }} />
        </div>
      </div>
      <LogoutModal show={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div 
          className="position-fixed top-0 start-0 w-100 h-100" 
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 999 }}
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default Layout;
