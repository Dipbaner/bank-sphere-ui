import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

export default function OAuthCallback() {
  const { startPreAuth } = useAuth()
  const navigate = useNavigate()
  const done = useRef(false)

  useEffect(() => {
    if (done.current) return
    done.current = true

    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const token = hash.get('preAuthToken')
    const enrollmentRequired = hash.get('enrollmentRequired') === 'true'

    window.history.replaceState(null, '', window.location.pathname)   // remove the token from the address bar

    if (!token) return navigate('/login?error=oauth_failed', { replace: true })
    startPreAuth(token, enrollmentRequired, 300)
    navigate(enrollmentRequired ? '/otp/enroll' : '/otp/verify', { replace: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <p className="center">Signing you in...</p>
}