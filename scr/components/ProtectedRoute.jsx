import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { Spinner } from './Spinner.jsx'

export function ProtectedRoute() {
  const location = useLocation()
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <Spinner />
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <Outlet />
}


