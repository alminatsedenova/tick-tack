import { useState, useEffect } from 'react'
import { Calendar, dayjsLocalizer } from 'react-big-calendar'
import dayjs from 'dayjs'
import axios from 'axios'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import EventModal from './components/EventModal'

const localizer = dayjsLocalizer(dayjs)

function App() {
  const [events, setEvents] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState(null)
  const [selectedEvent, setSelectedEvent] = useState(null)

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
    <div style={{ height: '100vh', padding: '20px' }}>
      <h1 style={{ marginBottom: '20px' }}>📅 My Calendar</h1>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 'calc(100vh - 100px)' }}
        selectable
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
      />
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