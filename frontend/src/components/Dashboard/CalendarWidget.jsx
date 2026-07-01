import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { MdBusiness, MdClose } from 'react-icons/md';
import { Link } from 'react-router-dom';

const CalendarWidget = ({ jobs = [] }) => {
  const [date, setDate] = useState(new Date());
  const [selectedEvents, setSelectedEvents] = useState([]);
  const [nextInterviewDate, setNextInterviewDate] = useState(null);

  useEffect(() => {
    // Find next upcoming interview
    const todayStr = getLocalDateString(new Date());
    let nextDate = null;
    jobs.forEach(job => {
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
  }, [jobs]);

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
        return <div className="event-dot-mini"></div>;
      }
    }
    return null;
  };

  const onClickDay = (value) => {
    setDate(value);
    const events = getEventsForDate(value);
    setSelectedEvents(events);
  };

  return (
    <div className="premium-card d-flex flex-column align-items-center justify-content-center">
      <div className="w-100 d-flex justify-content-between align-items-center mb-3">
        <h6 className="mb-0" style={{ fontWeight: '600' }}>Schedule</h6>
        <Link to="/calendar" style={{ fontSize: '12px', color: 'var(--primary-color)', textDecoration: 'none' }}>View full</Link>
      </div>

      <style>
        {`
          .react-calendar {
            border: none;
            width: 100%;
            background-color: transparent;
            font-family: 'Poppins', sans-serif;
          }
          .react-calendar__navigation button {
            color: var(--text-color);
            min-width: 44px;
            background: none;
            font-size: 14px;
            font-weight: 600;
          }
          .react-calendar__navigation button:enabled:hover,
          .react-calendar__navigation button:enabled:focus {
            background-color: #f3effc;
            border-radius: 8px;
          }
          .react-calendar__month-view__weekdays {
            color: var(--text-muted);
            font-weight: 600;
            text-transform: uppercase;
            font-size: 10px;
          }
          .react-calendar__month-view__weekdays__weekday abbr {
            text-decoration: none;
          }
          .react-calendar__tile {
            color: var(--text-color);
            padding: 8px 0;
            background: none;
            text-align: center;
            font-size: 13px;
            position: relative;
          }
          .react-calendar__tile:enabled:hover,
          .react-calendar__tile:enabled:focus {
            background-color: #f8fafc;
            border-radius: 8px;
          }
          .react-calendar__tile--now {
            background: #f1f5f9;
            border-radius: 8px;
            color: var(--text-color);
            font-weight: 600;
          }
          .react-calendar__tile--active {
            background: var(--primary-color) !important;
            border-radius: 8px;
            color: white !important;
            font-weight: 600;
          }
          .highlighted-date {
            font-weight: 700;
            color: var(--primary-color) !important;
            background-color: #f3effc !important;
            border-radius: 8px;
          }
          .past-interview-date {
            font-weight: 600;
            color: var(--text-muted) !important;
            background-color: #f1f5f9 !important;
            border-radius: 8px;
          }
          .next-interview-date {
            font-weight: 700;
            color: white !important;
            background-color: var(--priority-high) !important;
            border-radius: 8px;
          }
          .event-dot-mini {
            height: 4px;
            width: 4px;
            background-color: var(--primary-color);
            border-radius: 50%;
            position: absolute;
            bottom: 2px;
            left: 50%;
            transform: translateX(-50%);
          }
          .next-interview-date .event-dot-mini {
            background-color: white;
          }
          .widget-event-details {
            animation: fadeIn 0.2s ease-in-out;
            background-color: #f8fafc;
            border-radius: 8px;
            padding: 12px;
            margin-top: 10px;
            width: 100%;
            font-size: 12px;
          }
        `}
      </style>
      <Calendar 
        onChange={setDate} 
        value={date} 
        tileClassName={tileClassName}
        tileContent={tileContent}
        onClickDay={onClickDay}
      />

      {selectedEvents.length > 0 && (
        <div className="widget-event-details mt-3">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <strong style={{ color: 'var(--primary-color)' }}>{selectedEvents.length} Interview{selectedEvents.length > 1 ? 's' : ''}</strong>
            <button className="btn btn-sm btn-link p-0 text-muted" onClick={() => setSelectedEvents([])}><MdClose /></button>
          </div>
          {selectedEvents.map((ev, idx) => (
            <div key={idx} className="mb-2 pb-2 border-bottom">
              <div className="d-flex align-items-center gap-2 mb-1">
                <MdBusiness size={14} className="text-muted" />
                <span style={{ fontWeight: '600', color: 'var(--text-color)' }}>{ev.companyName}</span>
              </div>
              <div className="text-muted" style={{ fontSize: '11px', paddingLeft: '22px' }}>{ev.jobRole}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CalendarWidget;
