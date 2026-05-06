import { useState } from 'react'
import dayjs from 'dayjs'

function EventModal({ slot, event, onSave, onDelete, onClose }) {
  const [title, setTitle] = useState(event?.title || '')
  const [description, setDescription] = useState(event?.description || '')
  const [startTime, setStartTime] = useState(
    event ? dayjs(event.start).format('YYYY-MM-DDTHH:mm')
           : dayjs(slot?.start).format('YYYY-MM-DDTHH:mm')
  )
  const [endTime, setEndTime] = useState(
    event ? dayjs(event.end).format('YYYY-MM-DDTHH:mm')
           : dayjs(slot?.end).format('YYYY-MM-DDTHH:mm')
  )

  const handleSubmit = () => {
    if (!title) return alert('Please enter a title')
    onSave({ title, description, startTime, endTime })
  }

  return (
    <div style={overlay}>
      <div style={modal}>
        <h2>{event ? 'Edit Event' : 'New Event'}</h2>

        <input
          placeholder="Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          style={input}
        />
        <textarea
          placeholder="Description (optional)"
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{ ...input, height: '80px' }}
        />
        <label>Start Time</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={e => setStartTime(e.target.value)}
          style={input}
        />
        <label>End Time</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={e => setEndTime(e.target.value)}
          style={input}
        />

        <div style={{ display: 'flex', gap: '10px', marginTop: '15px' }}>
          <button onClick={handleSubmit} style={btnPrimary}>
            {event ? 'Update' : 'Save'}
          </button>
          {event && (
            <button onClick={onDelete} style={btnDanger}>Delete</button>
          )}
          <button onClick={onClose} style={btnSecondary}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

const overlay = {
  position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
  background: 'rgba(0,0,0,0.5)', display: 'flex',
  alignItems: 'center', justifyContent: 'center', zIndex: 1000
}
const modal = {
  background: 'white', padding: '30px', borderRadius: '10px',
  width: '400px', display: 'flex', flexDirection: 'column', gap: '10px'
}
const input = {
  padding: '8px', borderRadius: '5px',
  border: '1px solid #ccc', width: '100%'
}
const btnPrimary = {
  padding: '8px 16px', background: '#3b82f6',
  color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
}
const btnDanger = {
  padding: '8px 16px', background: '#ef4444',
  color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
}
const btnSecondary = {
  padding: '8px 16px', background: '#6b7280',
  color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
}

export default EventModal