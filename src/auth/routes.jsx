import { Navigate } from 'react-router-dom'
import { useAuth } from './AuthContext'

export const homePath = (role) =>
  role === 'ADMIN' ? '/admin' : role === 'EMPLOYEE' ? '/employee' : '/customer'

/** Needs a full login (access token). Optionally limited to some roles. */
export function ProtectedRoute({ roles, children }) {
  const { user, loading } = useAuth()
  if (loading) return <p className="center">Loading...</p>
  if (!user) return <Navigate to="/login" replace />
  if (roles && !roles.includes(user.role)) return <Navigate to={homePath(user.role)} replace />
  return children
}

/** Only for the OTP screens: needs the pre-auth token from step 1 of the login. */
export function PreAuthRoute({ children }) {
  const { user, preAuth } = useAuth()
  if (user) return <Navigate to={homePath(user.role)} replace />
  if (!preAuth) return <Navigate to="/login" replace />
  return children
}