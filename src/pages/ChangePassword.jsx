import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, errCode, errMsg, fieldErrors } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { homePath } from '../auth/routes'
import Alert from '../components/Alert'
import AuthCard from '../components/AuthCard'
import Field from '../components/Field'
import OtpInput from '../components/OtpInput'

export default function ChangePassword() {
  const { user, clearSession } = useAuth()
  const navigate = useNavigate()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [otp, setOtp] = useState('')
  const [errors, setErrors] = useState({})
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setError(''); setErrors({})
    if (next !== confirm) return setErrors({ confirm: 'Passwords do not match' })
    setBusy(true)
    try {
      await api.post('/api/auth/change-password', { currentPassword: current, newPassword: next, otp })
      clearSession()      // the server ended every session, including this one
      navigate('/login', { replace: true, state: { notice: 'Password changed. Please sign in again.' } })
    } catch (err) {
      setErrors(fieldErrors(err))
      setError(errMsg(err))
      if (errCode(err) === 'INVALID_OTP') setOtp('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthCard title="Change password" subtitle="You will be signed out of all devices afterwards."
      footer={<Link to={homePath(user.role)}>Cancel</Link>}>
      <Alert>{error}</Alert>
      <form onSubmit={submit}>
        <Field label="Current password" type="password" value={current} onChange={(e) => setCurrent(e.target.value)} required />
        <Field label="New password" type="password" value={next} onChange={(e) => setNext(e.target.value)} error={errors.newPassword} required />
        <Field label="Confirm new password" type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} error={errors.confirm} required />
        <p className="muted center">Authenticator code</p>
        <OtpInput value={otp} onChange={setOtp} disabled={busy} autoFocus={false} />
        <button className="btn" disabled={busy || otp.length !== 6}>{busy ? 'Saving...' : 'Change password'}</button>
      </form>
    </AuthCard>
  )
}