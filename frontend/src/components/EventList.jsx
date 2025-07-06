import React, { useEffect, useState } from 'react'

function EventList() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
   fetch("http://localhost:5000/api/events")

      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then(data => {
        setEvents(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <p>Loading events...</p>
  if (error) return <p>Error: {error}</p>

  return (
    <div>
      <h2>All Events</h2>
      {events.length === 0 && <p>No events found.</p>}
      <ul>
        {events.map(event => (
          <li key={event._id}>
            <strong>{event.title}</strong> by {event.creator?.username || 'Unknown'} <br />
            When: {new Date(event.date).toLocaleString()} <br />
            Where: {event.location || 'No location'} <br />
            Description: {event.description || 'No description'}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default EventList
