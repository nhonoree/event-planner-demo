import React from 'react'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Register from './components/Register'
import Login from './components/Login'
import Dashboard from './components/Dashboard'


function App() {
  return (
    <BrowserRouter>
      <nav style={{ marginBottom: '1rem' }}>
        <Link to="/register">Register</Link> |{' '}
        <Link to="/login">Login</Link> |{' '}
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/create">Create Event</Link> |{' '}
        <Link to="/events">Events</Link> |{' '}

      </nav>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateEvent />} />
        <Route path="/events" element={<EventList />} />


      </Routes>
    </BrowserRouter>
  )
}

export default App
import CreateEvent from './components/CreateEvent'
import EventList from './components/EventList'
