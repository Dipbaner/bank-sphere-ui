import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { api, errCode, errMsg, fieldErrors } from '../api/client'
import Alert from '../components/Alert'
import AuthCard from '../components/AuthCard'
import Field from '../components/Field'

export default function ResetPassword() {
  const [params, setParams] = useSearchParams()
  const [token] = useState(params.get('token') || '')   // keep it in memory...
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [linkBad, setLinkBad] = useState(!token)
  const [busy, setBusy] = useState(false)

  useEffect(() => { setParams({}, { replace: true }) }, [setParams])   // ...and remove it from the address bar

  async function submit(e) {
    e.preventDefault()
    setError(''); setErrors({})
    if (password !== confirm) return setErrors({ confirm: 'Passwords do not match' })
    setBusy(true)
    try {
      await api.post('/api/auth/reset-password', { token, newPassword: password })
      navigate('/login', { replace: true, state: { notice: 'Password updated. Please sign in with your new password.' } })
    } catch (err) {
      if (errCode(err) === 'INVALID_TOKEN') setLinkBad(true)
      else { setErrors(fieldErrors(err)); setError(errMsg(err)) }
    } finally {
      setBusy(false)
    }
  }

  if (linkBad) {
    return (
      <AuthCard title="Link expired" footer={<Link to="/forgot-password">Request a new link</Link>}>
        <Alert>This reset link is invalid, already used, or has expired.</Alert>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Choose a new password" subtitle="You will still need your authenticator code to sign in.">
      <Alert>{error}</Alert>
      <form onSubmit={submit}>
        <Field label="New password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} error={errors.newPassword} required autoFocus />
        <Field label="Confirm new password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} required />
        <button className="btn" disabled={busy}>{busy ? 'Saving...' : 'Save new password'}</button>
      </form>
    </AuthCard>
  )
}