import React, { useState } from 'react'
import { Form, Button, Container, Alert, Card, Spinner } from 'react-bootstrap'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function CreateEvent() {
  const [form, setForm] = useState({ title: '', date: '', location: '', description: '' })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('http://localhost:5000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      })

      if (!res.ok) throw new Error('Failed to create event')

      setForm({ title: '', date: '', location: '', description: '' })
      toast.success('Event created successfully!')
      setLoading(false)

      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err) {
      setError(err.message)
      toast.error(err.message)
      setLoading(false)
    }
  }

  return (
    <Container className="mt-4">
      <ToastContainer position="top-center" />
      <Card className="shadow p-4">
        <h2 className="mb-4 text-center">🎉 Create a New Event</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3" controlId="formTitle">
            <Form.Label>Event Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Enter event title"
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDate">
            <Form.Label>Date & Time</Form.Label>
            <Form.Control
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formLocation">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Enter location"
              disabled={loading}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Write a short description"
              disabled={loading}
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100" disabled={loading}>
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Creating...
              </>
            ) : (
              'Create Event'
            )}
          </Button>
        </Form>
      </Card>
    </Container>
  )
}

export default CreateEvent
