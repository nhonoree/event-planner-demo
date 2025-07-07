import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'
import CreateEvent from './components/CreateEvent'
import EventList from './components/EventList'
import Logout from './components/Logout'
import ProtectedRoute from './components/ProtectedRoute'
import { isTokenExpired } from './utils/auth'  // make sure path is correct

function AppWrapper() {
  // Because useNavigate hook can only be used inside components
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
    <>
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="/register">Register</Link> |{' '}
        <Link to="/login">Login</Link> |{' '}
        <Link to="/dashboard">Dashboard</Link> |{' '}
        <Link to="/create">Create Event</Link> |{' '}
        <Link to="/events">Events</Link> |{' '}
        <Link to="/logout">Logout</Link>
      </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protect these routes */}
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
      </Routes>
    </>
  )
}

export default AppWrapper
