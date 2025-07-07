import React from 'react'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) {
    // Not logged in, redirect to login page
    return <Navigate to="/login" replace />
  }
  // Logged in, render the children
  return children
}

export default ProtectedRoute
