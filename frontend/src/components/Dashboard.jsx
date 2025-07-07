import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function Dashboard() {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')

  useEffect(() => {
    if (!token) {
      navigate('/login')  // Redirect to login if no token
    }
  }, [token, navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/login')  // Redirect after logout
  }

  if (!token) {
    return null // or a loading spinner while redirecting
  }

  return (
    <div>
      <h2>🎉 Dashboard</h2>
      <p>Welcome to your event planner dashboard!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  )
}

export default Dashboard
