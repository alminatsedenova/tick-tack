import { useState, useEffect } from 'react'
import axios from 'axios'
import dayjs from 'dayjs'

function Agenda() {
  const [tasks, setTasks] = useState([])
  const [newTask, setNewTask] = useState('')
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'))

  useEffect(() => {
    fetchEvents()
  }, [date])

  const fetchEvents = async () => {
    const res = await axios.get('/api/events')
    const filtered = res.data.filter(e =>
      dayjs(e.startTime).format('YYYY-MM-DD') === date
    )
    setTasks(filtered)
  }

  const handleAddTask = async () => {
    if (!newTask.trim()) return
    await axios.post('/api/events', {
      title: newTask,
      description: '',
      startTime: dayjs(date).startOf('day').toISOString(),
      endTime: dayjs(date).endOf('day').toISOString()
    })
    setNewTask('')
    fetchEvents()
  }

  const handleDelete = async (id) => {
    await axios.delete(`/api/events/${id}`)
    fetchEvents()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAddTask()
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '16px' }}>📋 Daily Agenda</h2>

      {/* Date Picker */}
      <input
        type="date"
        value={date}
        onChange={e => setDate(e.target.value)}
        style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', marginBottom: '20px', width: '100%' }}
      />

      {/* Add Task */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <input
          placeholder="Add a task for the day..."
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
        />
        <button
          onClick={handleAddTask}
          style={{ padding: '8px 16px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}
        >
          Add
        </button>
      </div>

      {/* Task List */}
      {tasks.length === 0 ? (
        <p style={{ color: '#9ca3af' }}>No tasks for this day. Add one above!</p>
      ) : (
        tasks.map(task => (
          <div key={task.id} style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            padding: '12px 16px', background: '#f9fafb', borderRadius: '8px',
            marginBottom: '10px', border: '1px solid #e5e7eb'
          }}>
            <div>
              <p style={{ margin: 0, fontWeight: 'bold' }}>{task.title}</p>
              <p style={{ margin: 0, fontSize: '12px', color: '#6b7280' }}>
                {dayjs(task.startTime).format('h:mm A')} - {dayjs(task.endTime).format('h:mm A')}
              </p>
            </div>
            <button
              onClick={() => handleDelete(task.id)}
              style={{ background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', padding: '6px 12px', cursor: 'pointer' }}
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  )
}

export default Agenda