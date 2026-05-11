import { useState } from 'react'

function LandingPage({ onComplete }) {
  const [startTime, setStartTime] = useState('09:00')
  const [endTime, setEndTime] = useState('17:00')

  const handleSubmit = () => {
    if (!startTime || !endTime) {
      return alert('Please fill in both times!')
    }

    localStorage.setItem('dayStart', startTime)
    localStorage.setItem('dayEnd', endTime)

    onComplete(startTime, endTime)
  }

  return (
    <div className="landing-overlay">
      <div className="landing-card">

        <div className="landing-emoji">🗓️</div>

        <h1 className="landing-title">
          Welcome to My Calendar
        </h1>

        <p className="landing-subtitle">
          Let's set up your day before we get started!
        </p>

        <div className="landing-form">

          <div className="landing-field">
            <label>🌅 What time do you start your day?</label>

            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="landing-input"
            />
          </div>

          <div className="landing-field">
            <label>🌙 What time do you end your day?</label>

            <input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="landing-input"
            />
          </div>

          <button
            className="landing-btn"
            onClick={handleSubmit}
          >
            Let's Go! 🚀
          </button>

        </div>
      </div>
    </div>
  )
}

export default LandingPage