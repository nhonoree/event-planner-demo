import React from 'react'

function Dashboard() {
  const token = localStorage.getItem('token')

  if (!token) {
    return <p>⛔ Please log in to view your dashboard.</p>
  }

  return (
    <div>
      <h2>🎉 Dashboard</h2>
      <p>Welcome to your event planner dashboard!</p>
      <button onClick={() => {
        localStorage.removeItem('token')
        window.location.reload()
      }}>
        Logout
      </button>
    </div>
  )
}

export default Dashboard
