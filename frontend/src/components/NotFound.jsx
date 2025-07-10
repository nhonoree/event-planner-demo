import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <Container className="text-center mt-5">
      <h1 className="display-4 text-danger">404</h1>
      <p className="lead">Oops! The page you're looking for doesn't exist.</p>
      <Link to="/">
        <Button variant="primary">Go Home</Button>
      </Link>
    </Container>
  );
}

export default NotFound;
