// src/components/Home.jsx
import React from 'react';
import { Container, Button, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <Container className="text-center mt-5">
      <Row className="align-items-center">
        <Col md={12}>
          <h1 className="display-4">🎉 Welcome to Event Planner</h1>
          <p className="lead mt-3">
            Effortlessly create, manage, and share your events with ease.
          </p>
          <div className="mt-4">
            <Link to="/register">
              <Button variant="primary" className="me-3">Get Started</Button>
            </Link>
            <Link to="/events">
              <Button variant="outline-secondary">Browse Events</Button>
            </Link>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;
