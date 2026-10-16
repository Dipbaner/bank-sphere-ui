import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { api, errCode, errMsg } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { homePath } from '../auth/routes'
import Alert from '../components/Alert'
import AuthCard from '../components/AuthCard'
import Field from '../components/Field'

const OAUTH_ERRORS = {
  oauth_failed: 'Google sign-in did not complete. Please try again.',
  email_not_verified: 'Your Google email is not verified, so it cannot be used here.',
  account_blocked: 'This account cannot sign in. Please contact the bank.',
  account_locked: 'This account is temporarily locked. Please try again later.',
  account_conflict: 'This email is linked to a different Google account.',
}

export default function Login() {
  const { user, startPreAuth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [params] = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(OAUTH_ERRORS[params.get('error')] || '')
  const [notice, setNotice] = useState(location.state?.notice || '')
  const [needsVerify, setNeedsVerify] = useState(false)
  const [busy, setBusy] = useState(false)

  if (user) return <Navigate to={homePath(user.role)} replace />

  async function submit(e) {
    e.preventDefault()
    setError(''); setNotice(''); setNeedsVerify(false); setBusy(true)
    try {
      const { data } = await api.post('/api/auth/login', { email, password })
      startPreAuth(data.preAuthToken, data.enrollmentRequired, data.expiresInSeconds)
      navigate(data.enrollmentRequired ? '/otp/enroll' : '/otp/verify', { replace: true })
    } catch (err) {
      setError(errMsg(err, 'Could not sign in. Please try again.'))
      if (errCode(err) === 'EMAIL_NOT_VERIFIED') setNeedsVerify(true)
    } finally {
      setBusy(false)
    }
  }

  async function resend() {
    try {
      const { data } = await api.post('/api/auth/resend-verification', { email })
      setError(''); setNeedsVerify(false); setNotice(data.message)
    } catch (err) {
      setError(errMsg(err))
    }
  }

  const googleUrl = `${import.meta.env.VITE_API_ORIGIN}/oauth2/authorization/google`

  return (
    <AuthCard
      title="Sign in"
      footer={<><Link to="/register">Create account</Link><Link to="/forgot-password">Forgot password?</Link></>}
    >
      <Alert type="info">{notice}</Alert>
      <Alert>{error}</Alert>
      {needsVerify && <button className="link" onClick={resend}>Resend verification email</button>}
      <form onSubmit={submit}>
        <Field label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoFocus />
        <Field label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button className="btn" disabled={busy}>{busy ? 'Checking...' : 'Continue'}</button>
      </form>
      <a className="btn btn-secondary" href={googleUrl}>Continue with Google</a>
    </AuthCard>
  )
}