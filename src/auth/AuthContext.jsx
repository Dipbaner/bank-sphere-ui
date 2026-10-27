import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { api, parseJwt, refreshSession, setAccessToken, setSessionLostHandler } from '../api/client'

const AuthContext = createContext(null)
export const useAuth = () => useContext(AuthContext)

const userFromToken = (token) => {
  const c = parseJwt(token)
  return c ? { email: c.email, role: c.role } : null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)        // { email, role } once fully logged in
  const [preAuth, setPreAuth] = useState(null)  // { token, enrollmentRequired, expiresAt }
  const [loading, setLoading] = useState(
    () => window.location.pathname !== '/' && !window.location.pathname.startsWith('/preview')
  )

  // On page load the memory token is gone: try to restore the session from the cookie.
  useEffect(() => {
    setSessionLostHandler(() => setUser(null))
    if (window.location.pathname === '/' || window.location.pathname.startsWith('/preview')) return
    refreshSession()
      .then((d) => setUser(userFromToken(d.accessToken)))
      .catch(() => setUser(null))
      .finally(() => setLoading(false))
  }, [])

  const startPreAuth = useCallback((token, enrollmentRequired, expiresInSeconds = 300) => {
    setPreAuth({ token, enrollmentRequired, expiresAt: Date.now() + expiresInSeconds * 1000 })
  }, [])

  const cancelPreAuth = useCallback(() => setPreAuth(null), [])

  const completeLogin = useCallback((accessToken) => {
    setAccessToken(accessToken)
    setUser(userFromToken(accessToken))
    setPreAuth(null)
  }, [])

  const clearSession = useCallback(() => {
    setAccessToken(null)
    setUser(null)
    setPreAuth(null)
  }, [])

  const logout = useCallback(async () => {
    try { await api.post('/api/auth/logout') } catch { /* already signed out */ }
    clearSession()
  }, [clearSession])

  const logoutAll = useCallback(async () => {
    try { await api.post('/api/auth/logout-all') } catch { /* already signed out */ }
    clearSession()
  }, [clearSession])

  const value = useMemo(
    () => ({ user, preAuth, loading, startPreAuth, cancelPreAuth, completeLogin, clearSession, logout, logoutAll }),
    [user, preAuth, loading, startPreAuth, cancelPreAuth, completeLogin, clearSession, logout, logoutAll]
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}