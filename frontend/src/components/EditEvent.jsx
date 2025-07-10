import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Form,
  Button,
  Container,
  Alert,
  Card,
  Spinner
} from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const [form, setForm] = useState({
    title: '',
    description: '',
    location: '',
    date: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/events`)
      .then(res => res.json())
      .then(data => {
        const target = data.find(e => e._id === id);
        if (target) {
          setForm({
            title: target.title,
            description: target.description,
            location: target.location,
            date: target.date.slice(0, 16)
          });
        } else {
          setError('Event not found');
        }
        setLoading(false);
      })
      .catch(() => {
        setError('❌ Failed to fetch event');
        setLoading(false);
      });
  }, [id]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('✅ Event updated successfully!');
        setTimeout(() => navigate('/events'), 1500);
      } else {
        setError(data.message || 'Update failed');
      }
    } catch {
      setError('❌ Network error');
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading event data...</p>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <ToastContainer />
      <Card className="p-4 shadow">
        <h2 className="text-center mb-4">✏️ Edit Event</h2>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter event title"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="Event location"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Date & Time</Form.Label>
            <Form.Control
              type="datetime-local"
              name="date"
              value={form.date}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe the event"
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100">
            Update Event
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default EditEvent;
