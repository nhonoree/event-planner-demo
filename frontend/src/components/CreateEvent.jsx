import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

function CreateEvent() {
  const [form, setForm] = useState({
    title: '',
    description: '',
    date: '',
    location: ''
  })

  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const token = localStorage.getItem('token')
    if (!token) {
      setMessage('❌ You must be logged in to create an event.')
      // Redirect to login page after short delay
      setTimeout(() => navigate('/login'), 2000)
      return
    }

    try {
      const res = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('✅ Event created successfully!')
        setForm({ title: '', description: '', date: '', location: '' }) // reset form
        // Redirect to events list after short delay
        setTimeout(() => navigate('/events'), 2000)
      } else {
        setMessage(`❌ ${data.message || 'Something went wrong'}`)
      }
    } catch (err) {
      setMessage('❌ Network error')
    }
  }

  return (
    <div>
      <h2>Create Event</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Event Title"
          value={form.title}
          onChange={handleChange}
          required
        /><br />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        /><br />
        <input
          name="date"
          type="datetime-local"
          value={form.date}
          onChange={handleChange}
          required
        /><br />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        /><br />
        <button type="submit">Create Event</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  )
}

export default CreateEvent
