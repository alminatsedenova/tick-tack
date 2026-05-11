import { useState, useEffect } from 'react'
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar'
import dayjs from 'dayjs'
import axios from 'axios'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import './App.css'
import EventModal from './components/EventModal'
import Agenda from './components/Agenda'

const localizer = dayjsLocalizer(dayjs)

function App() {
  const [events, setEvents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [view, setView] = useState(Views.MONTH)
  const [date, setDate] = useState(new Date())
  const [activeTab, setActiveTab] = useState('calendar')

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    const res = await axios.get('/api/events')
    const formatted = res.data.map(e => ({
      ...e,
      start: new Date(e.startTime),
      end: new Date(e.endTime)
    }))
    setEvents(formatted)
  }

  const handleSelectSlot = (slotInfo) => {
    setSelectedSlot(slotInfo)
    setSelectedEvent(null)
    setShowModal(true)
  }

  const handleSelectEvent = (event) => {
    setSelectedEvent(event)
    setSelectedSlot(null)
    setShowModal(true)
  }

  const handleSave = async (eventData) => {
    if (selectedEvent) {
      await axios.put(`/api/events/${selectedEvent.id}`, eventData)
    } else {
      await axios.post('/api/events', eventData)
    }
    fetchEvents()
    setShowModal(false)
  }

  const handleDelete = async () => {
    await axios.delete(`/api/events/${selectedEvent.id}`)
    fetchEvents()
    setShowModal(false)
  }

  return (
    <div className="app">

      {/* Navbar */}
      <div className="navbar">
        <h1>🗓️ My Calendar</h1>
        <div className="nav-tabs">
          <button
            className={`nav-tab ${activeTab === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveTab('calendar')}
          >
            Calendar
          </button>
          <button
            className={`nav-tab ${activeTab === 'agenda' ? 'active' : ''}`}
            onClick={() => setActiveTab('agenda')}
          >
            Daily Agenda
          </button>
        </div>
      </div>

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div className="calendar-container">
          <div className="view-buttons">
            {[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`view-btn ${view === v ? 'active' : ''}`}
              >
                {v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ flex: 1 }}
            selectable
            view={view}
            onView={setView}
            date={date}
            onNavigate={setDate}
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            toolbar={false}
            min={new Date(2026, 0, 1, 7, 0, 0)}
            max={new Date(2026, 0, 1, 22, 0, 0)}

            eventPropGetter={() => ({
              style: {
                backgroundColor: '#91f5ad',
                color: '#333',
                borderRadius: '6px',
                border: '1px solid #c2e812'
              }
            })}
          />
        </div>
      )}

      {/* Agenda Tab */}
      {activeTab === 'agenda' && <Agenda />}

      {/* Modal */}
      {showModal && (
        <EventModal
          slot={selectedSlot}
          event={selectedEvent}
          onSave={handleSave}
          onDelete={handleDelete}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}

export default App