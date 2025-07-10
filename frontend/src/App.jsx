import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import CreateEvent from './components/CreateEvent'
import EventList from './components/EventList'
import Logout from './components/Logout'
import ProtectedRoute from './components/ProtectedRoute'
import { isTokenExpired } from './utils/auth' 
import EditEvent from './components/EditEvent'
import MyEvents from './components/MyEvents'
import Footer from './components/Footer' 
import NotFound from './components/NotFound';
import Home from './components/Home';

function AppWrapper() {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  )
}

function App() {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && isTokenExpired(token)) {
      localStorage.removeItem('token')
      navigate('/login')
    }
  }, [navigate])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <nav style={{ marginBottom: '1rem', padding: '1rem', background: '#eee' }}>
        <Link to="/register">Register</Link> |{' '}
        <Link to="/login">Login</Link> |{' '}
        <Link to="/dashboard">Dashboard</Link> |{' '}
        <Link to="/create">Create Event</Link> |{' '}
        <Link to="/events">Events</Link> |{' '}
        <Link to="/logout">Logout</Link> |{' '}
        <Link to="/my-events">My Events</Link>
      </nav>

      <main style={{ flexGrow: 1, padding: '0 1rem' }}>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <CreateEvent />
              </ProtectedRoute>
            }
          />

          <Route path="/events" element={<EventList />} />
          <Route path="/logout" element={<Logout />} />

          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <EditEvent />
              </ProtectedRoute>
            }
          />

          <Route
            path="/my-events"
            element={
              <ProtectedRoute>
                <MyEvents />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Home />} />

          

        </Routes>
      </main>

      <Footer />
    </div>
  )
}

export default AppWrapper
