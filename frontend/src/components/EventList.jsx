import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import {
  Card,
  Button,
  Container,
  Row,
  Col,
  Spinner,
  Alert
} from 'react-bootstrap';

function EventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetch('http://localhost:5000/api/events')
      .then(res => {
        if (!res.ok) throw new Error('Failed to fetch');
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
  }, []);

  // Decode the token to get logged-in user's ID
  let userId = null;
  if (token) {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1]));
      userId = decoded.id;
    } catch (e) {
      console.error('Invalid token');
    }
  }

  const handleDelete = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this event?');
    if (!confirm) return;

    try {
      const res = await fetch(`http://localhost:5000/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        setEvents(events.filter(event => event._id !== id));
        toast.success('✅ Event deleted successfully');
      } else {
        const data = await res.json();
        toast.error(`❌ ${data.message || 'Delete failed'}`);
      }
    } catch (err) {
      toast.error('❌ Network error while deleting event');
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" variant="primary" />
        <p>Loading events...</p>
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
      <h2 className="mb-4">All Events</h2>
      <Row>
        {events.length === 0 && <p>No events found.</p>}
        {events.map(event => (
          <Col md={4} sm={6} xs={12} key={event._id} className="mb-4">
            <Card>
              <Card.Body>
                <Card.Title>{event.title}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">
                  By: {event.creator?.username || 'Unknown'}
                </Card.Subtitle>
                <Card.Text>
                  <strong>When:</strong> {new Date(event.date).toLocaleString()}<br />
                  <strong>Where:</strong> {event.location || 'No location'}<br />
                  <strong>Description:</strong> {event.description || 'No description'}
                </Card.Text>

                {event.creator?._id === userId && (
                  <>
                    <Button
                      variant="danger"
                      size="sm"
                      className="me-2"
                      onClick={() => handleDelete(event._id)}
                    >
                      🗑️ Delete
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => window.location.href = `/edit/${event._id}`}
                    >
                      ✏️ Edit
                    </Button>
                  </>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ✅ Toast container to show notifications */}
      <ToastContainer position="top-center" />
    </Container>
  );
}

export default EventList;
