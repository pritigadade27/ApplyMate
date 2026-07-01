import { useState, useEffect } from 'react';
import api from '../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { MdNotifications, MdCheck, MdWork, MdWarning, MdEvent } from 'react-icons/md';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAndGenerateNotifications = async () => {
      try {
        const { data: jobs } = await api.get('/jobs');
        const generated = [];
        
        // Generate notifications based on jobs
        jobs.forEach((job, index) => {
          if (job.interviewSchedule?.date) {
            const interviewDateStr = job.interviewSchedule.date.substring(0, 10);
            const todayStr = new Date().toISOString().substring(0, 10);
            
            // Calculate absolute day difference using UTC dates to avoid DST/timezone issues
            const d1 = new Date(interviewDateStr + 'T00:00:00Z');
            const d2 = new Date(todayStr + 'T00:00:00Z');
            const diffTime = d1 - d2;
            const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 0) {
              generated.push({ id: `int-0-${index}`, type: 'warning', title: 'Interview Today!', message: `Good luck! You have an interview with ${job.companyName} for the ${job.jobRole} role today.`, read: false, date: new Date() });
            } else if (diffDays === 1) {
              generated.push({ id: `int-1-${index}`, type: 'warning', title: 'Interview Tomorrow', message: `You have an interview with ${job.companyName} for the ${job.jobRole} role tomorrow.`, read: false, date: new Date() });
            } else if (diffDays === 2) {
              generated.push({ id: `int-2-${index}`, type: 'info', title: 'Interview in Two Days', message: `Prepare for your upcoming interview with ${job.companyName}.`, read: false, date: new Date() });
            } else if (diffDays < 0 && diffDays > -7) {
               generated.push({ id: `follow-${index}`, type: 'info', title: 'Follow-up Reminder', message: `It has been a few days since your interview with ${job.companyName}. Consider sending a follow-up email.`, read: false, date: new Date(new Date().getTime() - Math.abs(diffTime)) });
            }
          }
          if (job.status === 'Offer') {
             generated.push({ id: `off-${index}`, type: 'success', title: 'Offer Received!', message: `Congratulations on receiving an offer from ${job.companyName} for the ${job.jobRole} role!`, read: false, date: new Date(job.updatedAt || new Date()) });
          }
        });

        // Add a welcome notification if none exist
        if (generated.length === 0) {
          generated.push({
            id: 'welcome-1',
            type: 'info',
            title: 'Welcome to ApplyMate!',
            message: 'Add your first job application and we will notify you of upcoming interviews.',
            read: false,
            date: new Date()
          });
        }

        // Sort by date desc
        generated.sort((a, b) => b.date - a.date);
        
        // Check local storage for read status
        const readStates = JSON.parse(localStorage.getItem('readNotifications') || '{}');
        const finalNotifs = generated.map(n => ({ ...n, read: readStates[n.id] || false }));

        setNotifications(finalNotifs);
      } catch (error) {
        toast.error('Failed to load notifications');
      } finally {
        setLoading(false);
      }
    };
    fetchAndGenerateNotifications();
  }, []);

  const markAsRead = (id) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    setNotifications(updated);
    
    const readStates = JSON.parse(localStorage.getItem('readNotifications') || '{}');
    readStates[id] = true;
    localStorage.setItem('readNotifications', JSON.stringify(readStates));
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    
    const readStates = JSON.parse(localStorage.getItem('readNotifications') || '{}');
    updated.forEach(n => readStates[n.id] = true);
    localStorage.setItem('readNotifications', JSON.stringify(readStates));
    toast.success('All notifications marked as read');
  };

  if (loading) return <LoadingSpinner />;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-page animation-fade-in">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 style={{ fontWeight: '600', margin: 0 }}>Notifications</h4>
          <p className="text-muted mb-0" style={{ fontSize: '14px' }}>You have {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}.</p>
        </div>
        {unreadCount > 0 && (
          <button className="btn btn-outline-primary btn-sm" onClick={markAllAsRead}>
            <MdCheck className="me-1" /> Mark all as read
          </button>
        )}
      </div>

      <div className="premium-card p-0 overflow-hidden">
        {notifications.length === 0 ? (
          <div className="p-5 text-center text-muted">
            <MdNotifications size={48} style={{ opacity: 0.2 }} className="mb-3" />
            <p>You're all caught up!</p>
          </div>
        ) : (
          <div className="list-group list-group-flush">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`list-group-item p-4 d-flex gap-3 align-items-start ${!notif.read ? 'bg-light' : ''}`}
                style={{ borderLeft: !notif.read ? '4px solid var(--primary-color)' : '4px solid transparent', transition: 'all 0.2s' }}
              >
                <div 
                  className="rounded-circle d-flex justify-content-center align-items-center flex-shrink-0"
                  style={{ width: '40px', height: '40px', backgroundColor: notif.type === 'warning' ? '#fef3c7' : notif.type === 'success' ? '#dcfce7' : '#e0e7ff', color: notif.type === 'warning' ? '#d97706' : notif.type === 'success' ? '#15803d' : '#4338ca' }}
                >
                  {notif.type === 'warning' && <MdWarning size={20} />}
                  {notif.type === 'success' && <MdCheck size={20} />}
                  {notif.type === 'info' && <MdEvent size={20} />}
                </div>
                
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <h6 className="mb-0" style={{ fontWeight: !notif.read ? '700' : '500', color: 'var(--text-color)' }}>
                      {notif.title}
                    </h6>
                    <small className="text-muted" style={{ fontSize: '11px' }}>
                      {notif.date.toLocaleDateString()}
                    </small>
                  </div>
                  <p className="mb-2" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                    {notif.message}
                  </p>
                  
                  {!notif.read && (
                    <button 
                      className="btn btn-sm btn-link p-0 text-decoration-none" 
                      style={{ fontSize: '12px', fontWeight: '600' }}
                      onClick={() => markAsRead(notif.id)}
                    >
                      Mark as read
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .animation-fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default Notifications;
