import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Button, Card, Form, Spinner, Alert } from 'react-bootstrap'

function Dashboard() {
  const token = localStorage.getItem('token')
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState({
    title: '',
    date: '',
    location: '',
    description: ''
  })

  useEffect(() => {
    if (!token) return
    fetch('http://localhost:5000/api/events/my', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        setEvents(data)
        setLoading(false)
      })
      .catch(() => {
        setEvents([])
        setLoading(false)
      })
  }, [token])

  const handleDelete = async id => {
    if (!window.confirm('Are you sure you want to delete this event?')) return
    const res = await fetch(`http://localhost:5000/api/events/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.ok) setEvents(events.filter(e => e._id !== id))
  }

  const handleEdit = event => {
    setEditId(event._id)
    setForm({
      title: event.title,
      date: event.date.slice(0, 16),
      location: event.location,
      description: event.description,
    })
  }

  const handleUpdate = async e => {
    e.preventDefault()
    const res = await fetch(`http://localhost:5000/api/events/${editId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      const updated = await res.json()
      setEvents(events.map(e => (e._id === updated.event._id ? updated.event : e)))
      setEditId(null)
    }
  }

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value })

  if (!token) return <Alert variant="danger">⛔ Please log in to view your dashboard.</Alert>

  return (
    <Container className="mt-4">
      <h2 className="mb-4 text-center">🎉 Dashboard</h2>
      <p className="text-center">Welcome to your event planner dashboard!</p>
      <div className="text-center mb-4">
        <Button variant="danger" onClick={() => {
          localStorage.removeItem('token')
          window.location.reload()
        }}>
          Logout
        </Button>
      </div>

      <h4>Your Events</h4>
      {loading ? (
        <Spinner animation="border" />
      ) : events.length === 0 ? (
        <Alert variant="info">You haven’t created any events yet.</Alert>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {events.map(event => (
            <Col key={event._id}>
              <Card>
                <Card.Body>
                  <Card.Title>{event.title}</Card.Title>
                  <Card.Subtitle className="mb-2 text-muted">
                    {new Date(event.date).toLocaleString()}
                  </Card.Subtitle>
                  <Card.Text>
                    📍 {event.location}<br />
                    📝 {event.description}
                  </Card.Text>
                  <Button
                    variant="warning"
                    size="sm"
                    onClick={() => handleEdit(event)}
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(event._id)}
                  >
                    Delete
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {editId && (
        <div className="mt-5">
          <h4>Edit Event</h4>
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                name="title"
                value={form.title}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                name="date"
                type="datetime-local"
                value={form.date}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                name="location"
                value={form.location}
                onChange={handleChange}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                name="description"
                value={form.description}
                onChange={handleChange}
              />
            </Form.Group>
            <Button type="submit" variant="primary">Update</Button>{' '}
            <Button type="button" variant="secondary" onClick={() => setEditId(null)}>Cancel</Button>
          </Form>
        </div>
      )}
    </Container>
  )
}

export default Dashboard
