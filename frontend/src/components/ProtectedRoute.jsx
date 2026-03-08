import { Navigate, useLocation } from 'react-router-dom'
import { getCurrentSession } from '../auth/session'

function ProtectedRoute({ children, requireAdmin = false }) {
  const location = useLocation()
  const session = getCurrentSession()

  if (!session) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (requireAdmin && session.role !== 'ADMIN') {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
