import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

function EditEvent() {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    date: ''
  })
  const [error, setError] = useState('')

  useEffect(() => {
    fetch(`http://localhost:5000/api/events`)
      .then(res => res.json())
      .then(data => {
        const target = data.find(e => e._id === id)
        if (target) {
          setForm({
            title: target.title,
            description: target.description,
            location: target.location,
            date: target.date.slice(0, 16) // for input type="datetime-local"
          })
        } else {
          setError('Event not found')
        }
      })
      .catch(() => setError('Failed to fetch event'))
  }, [id])

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      const data = await res.json()
      if (res.ok) {
        alert('✅ Event updated')
        navigate('/events')
      } else {
        setError(data.message || 'Update failed')
      }
    } catch {
      setError('❌ Network error')
    }
  }

  return (
    <div>
      <h2>Edit Event</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Title"
          value={form.title}
          onChange={handleChange}
          required
        /><br />
        <input
          name="location"
          placeholder="Location"
          value={form.location}
          onChange={handleChange}
        /><br />
        <input
          name="date"
          type="datetime-local"
          value={form.date}
          onChange={handleChange}
        /><br />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
        /><br />
        <button type="submit">Update</button>
      </form>
    </div>
  )
}

export default EditEvent
