import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  return (
    <Container className="text-center mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h1 className="display-4 fw-bold">Welcome to Event Planner</h1>
          <p className="lead">
            Plan and organize your events easily. Create, edit, and share events with others.
          </p>
          <div className="d-grid gap-2 d-sm-flex justify-content-sm-center mt-4">
            <Button variant="primary" size="lg" onClick={() => navigate('/register')}>
              Get Started
            </Button>
            <Button variant="outline-secondary" size="lg" onClick={() => navigate('/events')}>
              View Events
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
