// src/components/Navbar.jsx
import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function AppNavbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        <Navbar.Brand href="/">🎉 Event Planner</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-content" />
        <Navbar.Collapse id="navbar-content">
          <Nav className="me-auto">
            <Nav.Link href="/">All Events</Nav.Link>
            {token && (
              <>
                <Nav.Link href="/create">Create</Nav.Link>
                <Nav.Link href="/my-events">My Events</Nav.Link>
              </>
            )}
          </Nav>
          {token ? (
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
          ) : (
            <Button variant="outline-light" onClick={() => navigate('/login')}>
              Login
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
