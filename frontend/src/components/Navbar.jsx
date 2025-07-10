import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { useNavigate, NavLink } from 'react-router-dom';

function AppNavbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const linkStyles = ({ isActive }) => ({
    color: isActive ? '#0d6efd' : 'rgba(255, 255, 255, 0.8)',
    fontWeight: isActive ? '600' : '400',
    textDecoration: 'none',
    marginRight: '1rem',
    transition: 'color 0.3s ease',
  });

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      sticky="top"
      className="shadow-sm"
      style={{ padding: '0.6rem 1rem' }}
    >
      <Container>
        <Navbar.Brand
          as={NavLink}
          to="/"
          style={{ fontWeight: '700', fontSize: '1.5rem' }}
        >
          🎉 Event Planner
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-content" />
        <Navbar.Collapse id="navbar-content">
          <Nav className="me-auto align-items-center">
            <Nav.Link as={NavLink} to="/" style={linkStyles} end>
              All Events
            </Nav.Link>
            {token && (
              <>
                <Nav.Link as={NavLink} to="/create" style={linkStyles}>
                  Create Event
                </Nav.Link>
                <Nav.Link as={NavLink} to="/my-events" style={linkStyles}>
                  My Events
                </Nav.Link>
              </>
            )}
          </Nav>

          {token ? (
            <Button
              variant="outline-light"
              onClick={handleLogout}
              className="d-flex align-items-center"
              style={{ fontWeight: '600', letterSpacing: '0.05rem' }}
            >
              👋 Logout
            </Button>
          ) : (
            <Button
              variant="outline-light"
              onClick={() => navigate('/login')}
              style={{ fontWeight: '600', letterSpacing: '0.05rem' }}
            >
              Login
            </Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
