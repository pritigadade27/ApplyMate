import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import api from '../api/axios';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { MdBusiness, MdWork, MdSchedule, MdComputer, MdClose, MdCalendarToday, MdLabel } from 'react-icons/md';

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [nextInterviewDate, setNextInterviewDate] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await api.get('/jobs');
        setJobs(data);
        
        // Find next upcoming interview
        const todayStr = getLocalDateString(new Date());
        let nextDate = null;
        data.forEach(job => {
          if (job.interviewSchedule?.date) {
            const jobDateStr = job.interviewSchedule.date.substring(0, 10);
            if (jobDateStr >= todayStr) {
              if (!nextDate || jobDateStr < nextDate) {
                nextDate = jobDateStr;
              }
            }
          }
        });
        setNextInterviewDate(nextDate);
        
      } catch (error) {
        toast.error('Failed to fetch calendar events');
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const getLocalDateString = (d) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  const getEventsForDate = (checkDate) => {
    const checkStr = getLocalDateString(checkDate);
    return jobs.filter(job => {
      if (!job.interviewSchedule?.date) return false;
      const jobStr = job.interviewSchedule.date.substring(0, 10);
      return jobStr === checkStr;
    });
  };

  const tileClassName = ({ date: tileDate, view }) => {
    if (view === 'month') {
      const tileStr = getLocalDateString(tileDate);
      const todayStr = getLocalDateString(new Date());
      const isNext = nextInterviewDate && tileStr === nextInterviewDate;
        
      if (isNext) return 'next-interview-date';
      
      const events = getEventsForDate(tileDate);
      if (events.length > 0) {
        if (tileStr < todayStr) return 'past-interview-date';
        return 'highlighted-date';
      }
    }
    return null;
  };

  const tileContent = ({ date: tileDate, view }) => {
    if (view === 'month') {
      const events = getEventsForDate(tileDate);
      if (events.length > 0) {
        return <div className="event-dot"></div>;
      }
    }
    return null;
  };

  const onClickDay = (value) => {
    setDate(value);
    const events = getEventsForDate(value);
    setSelectedEvents(events);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="calendar-page animation-fade-in">
      <h4 style={{ fontWeight: '600' }} className="mb-4">Interview Calendar</h4>
      
      <div className="row g-4">
        <div className="col-lg-8">
          <div className="premium-card d-flex justify-content-center p-4">
            <Calendar 
              onChange={setDate} 
              value={date} 
              tileClassName={tileClassName}
              tileContent={tileContent}
              onClickDay={onClickDay}
              className="custom-calendar"
            />
          </div>
        </div>

        <div className="col-lg-4">
          <div className="premium-card p-4 h-100 position-relative" style={{ overflowY: 'auto' }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 style={{ fontWeight: '600', margin: 0, color: 'var(--primary-color)' }}>
                {selectedEvents.length > 0 ? `Interviews (${selectedEvents.length})` : 'Interview Details'}
              </h5>
              <button className="btn btn-sm btn-light rounded-circle" onClick={() => setSelectedEvents([])}><MdClose /></button>
            </div>

            {selectedEvents.length > 0 ? (
              <div className="d-flex flex-column gap-3">
                {selectedEvents.map(job => (
                  <div key={job._id} className="p-3 border rounded bg-white shadow-sm">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="mb-0 text-primary" style={{ fontWeight: '600' }}>{job.companyName}</h6>
                      <span className="badge bg-light text-dark border">{job.priority} Priority</span>
                    </div>
                    
                    <p className="mb-2" style={{ fontWeight: '500', fontSize: '14px' }}>{job.jobRole}</p>
                    
                    <div className="d-flex align-items-center gap-2 mb-2 text-muted" style={{ fontSize: '13px' }}>
                      <strong>Date:</strong> {new Date(job.interviewSchedule.date).toLocaleDateString()} 
                      {job.interviewSchedule.time && ` | Time: ${job.interviewSchedule.time}`}
                      {job.interviewSchedule.mode && ` | Mode: ${job.interviewSchedule.mode}`}
                    </div>
                    
                    <div className="mb-2" style={{ fontSize: '13px' }}>
                      <strong>Status:</strong> <span className={`status-badge status-${job.status.toLowerCase()}`}>{job.status}</span>
                    </div>

                    {job.notes && (
                      <div className="p-2 rounded mt-2" style={{ backgroundColor: '#f8fafc', fontSize: '13px' }}>
                        <strong>Notes:</strong> {job.notes}
                      </div>
                    )}
                    
                    {job.jobLink && (
                      <div className="mt-3">
                        <a href={job.jobLink} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary" style={{ fontSize: '12px', fontWeight: '500' }}>
                          Open Application Link
                        </a>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="d-flex flex-column justify-content-center align-items-center h-100 text-center text-muted p-4" style={{ minHeight: '300px' }}>
                <MdCalendarToday size={48} className="mb-3" style={{ opacity: 0.2 }} />
                <p>
                  {jobs.filter(j => j.interviewSchedule?.date).length === 0 
                    ? "No upcoming interviews. Add an application with an interview date to see it here."
                    : "No interviews scheduled for this date."}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .animation-fade-in { animation: fadeIn 0.3s ease-in-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        
        .custom-calendar {
          border: none !important;
          width: 100% !important;
          font-family: 'Poppins', sans-serif !important;
          background-color: var(--card-bg);
          color: var(--text-color);
        }
        .custom-calendar .react-calendar__navigation button {
          color: var(--text-color);
          font-weight: 600;
          font-size: 16px;
        }
        .custom-calendar .react-calendar__navigation button:enabled:hover,
        .custom-calendar .react-calendar__navigation button:enabled:focus {
          background-color: #f3effc;
          border-radius: 8px;
        }
        .custom-calendar .react-calendar__month-view__weekdays {
          font-weight: 600;
          text-transform: uppercase;
          font-size: 12px;
          color: var(--text-muted);
        }
        .custom-calendar .react-calendar__month-view__weekdays__weekday abbr {
          text-decoration: none;
        }
        .custom-calendar .react-calendar__tile {
          padding: 1.5em 0.5em;
          border-radius: 8px;
          position: relative;
        }
        .custom-calendar .react-calendar__tile:enabled:hover,
        .custom-calendar .react-calendar__tile:enabled:focus {
          background-color: #f8fafc;
        }
        .custom-calendar .react-calendar__tile--now {
          background: #f1f5f9;
          color: var(--text-color);
          font-weight: 600;
        }
        .custom-calendar .react-calendar__tile--active {
          background: var(--primary-color) !important;
          color: white !important;
          font-weight: 600;
        }
        .highlighted-date {
          font-weight: 700;
          color: var(--primary-color) !important;
          background-color: #f3effc !important;
        }
        .past-interview-date {
          font-weight: 600;
          color: var(--text-muted) !important;
          background-color: #f1f5f9 !important;
        }
        .next-interview-date {
          font-weight: 700;
          color: white !important;
          background-color: var(--priority-high) !important;
        }
        .event-dot {
          height: 6px;
          width: 6px;
          background-color: var(--primary-color);
          border-radius: 50%;
          position: absolute;
          bottom: 10px;
          left: 50%;
          transform: translateX(-50%);
        }
        .next-interview-date .event-dot {
          background-color: white;
        }
      `}</style>
    </div>
  );
};

export default CalendarPage;
