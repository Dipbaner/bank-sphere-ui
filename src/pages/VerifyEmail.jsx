import { useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api, errMsg } from '../api/client'
import Alert from '../components/Alert'
import AuthCard from '../components/AuthCard'

export default function VerifyEmail() {
  const [params] = useSearchParams()
  const [state, setState] = useState('loading')
  const [message, setMessage] = useState('')
  const called = useRef(false)   // the link works once, so never call it twice

  useEffect(() => {
    if (called.current) return
    called.current = true
    const token = params.get('token')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (!token) { setState('error'); setMessage('This link is incomplete.'); return }
    api.get('/api/auth/verify-email', { params: { token } })
      .then(() => setState('ok'))
      .catch((e) => { setState('error'); setMessage(errMsg(e, 'This link is invalid or has expired.')) })
  }, [params])

  return (
    <AuthCard title="Email verification" footer={<Link to="/login">Go to sign in</Link>}>
      {state === 'loading' && <p className="muted">Verifying...</p>}
      {state === 'ok' && <Alert type="ok">Your email is verified. You can now sign in.</Alert>}
      {state === 'error' && <Alert>{message} Try signing in to request a new link.</Alert>}
    </AuthCard>
  )
}