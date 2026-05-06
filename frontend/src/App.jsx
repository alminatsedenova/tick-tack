import { useState, useEffect } from 'react'
import { Calendar, dayjsLocalizer, Views } from 'react-big-calendar'
import dayjs from 'dayjs'
import axios from 'axios'
import 'react-big-calendar/lib/css/react-big-calendar.css'
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

  const tabStyle = (tab) => ({
    padding: '10px 24px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: activeTab === tab ? 'bold' : 'normal',
    borderBottom: activeTab === tab ? '3px solid #3b82f6' : '3px solid transparent',
    background: 'none',
    fontSize: '16px',
    color: activeTab === tab ? '#3b82f6' : '#6b7280'
  })

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>

      {/* Top Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 20px', borderBottom: '1px solid #e5e7eb' }}>
        <h1 style={{ margin: 0, fontSize: '22px' }}>📅 My Calendar</h1>
        <div style={{ display: 'flex' }}>
          <button style={tabStyle('calendar')} onClick={() => setActiveTab('calendar')}>Calendar</button>
          <button style={tabStyle('agenda')} onClick={() => setActiveTab('agenda')}>Daily Agenda</button>
        </div>
      </div>

      {/* Calendar Tab */}
      {activeTab === 'calendar' && (
        <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {[Views.MONTH, Views.WEEK, Views.DAY, Views.AGENDA].map(v => (
              <button
                key={v}
                onClick={() => setView(v)}
                style={{
                  padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                  background: view === v ? '#3b82f6' : '#e5e7eb',
                  color: view === v ? 'white' : '#111',
                  fontWeight: view === v ? 'bold' : 'normal'
                }}
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
          />
        </div>
      )}

      {/* Agenda Tab */}
      {activeTab === 'agenda' && <Agenda />}

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