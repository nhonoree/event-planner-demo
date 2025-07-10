import React, { useEffect, useState } from 'react';
import {
  Container,
  Card,
  Button,
  Spinner,
  Row,
  Col,
  Alert
} from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
      headers: { Authorization: `Bearer ${token}` },
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

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;

    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        setEvents(events.filter(event => event._id !== id));
        toast.success('✅ Event deleted successfully');
      } else {
        const data = await res.json();
        toast.error(data.message || '❌ Delete failed');
      }
    } catch {
      toast.error('❌ Network error');
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
        <p>Loading your events...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Error: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">📌 My Events</h2>
      <Row>
        {events.length === 0 && <p>You haven’t created any events yet.</p>}
        {events.map(event => (
          <Col md={4} sm={6} xs={12} key={event._id} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Card.Text>
                  <strong>When:</strong> {new Date(event.date).toLocaleString()}<br />
                  <strong>Where:</strong> {event.location || 'No location'}<br />
                  <strong>Description:</strong> {event.description || 'No description'}
                </Card.Text>
                <Button
                  variant="secondary"
                  size="sm"
                  className="me-2"
                  onClick={() => window.location.href = `/edit/${event._id}`}
                >
                  ✏️ Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(event._id)}
                >
                  🗑️ Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <ToastContainer />
    </Container>
  );
}

export default MyEvents;
