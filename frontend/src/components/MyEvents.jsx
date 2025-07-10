import React, { useEffect, useState } from 'react';

function MyEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      setError('No auth token found. Please log in.');
      setLoading(false);
      return;
    }

    fetch('http://localhost:5000/api/events/my', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch your events');
        return res.json();
      })
      .then(data => {
        setEvents(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [token]);

  if (loading) return <p>Loading your events...</p>;
  if (error) return <p>Error: {error}</p>;
  if (events.length === 0) return <p>You have no events yet.</p>;

  return (
    <div>
      <h2>Your Events</h2>
      <ul>
        {events.map(event => (
          <li key={event._id}>
            <strong>{event.title}</strong> — {new Date(event.date).toLocaleString()} <br />
            <button onClick={() => window.location.href = `/edit/${event._id}`}>✏️ Edit</button>{' '}
            <button onClick={() => alert('Add delete logic here')}>🗑️ Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default MyEvents;
