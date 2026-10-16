import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { api, errCode, errMsg } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { homePath } from '../auth/routes'
import Alert from '../components/Alert'
import AuthCard from '../components/AuthCard'
import Field from '../components/Field'
import OtpInput from '../components/OtpInput'
import useCountdown, { mmss } from '../hooks/useCountdown'

export default function OtpVerify() {
  const { preAuth, completeLogin, cancelPreAuth } = useAuth()
  const navigate = useNavigate()
  const left = useCountdown(preAuth.expiresAt)

  const [mode, setMode] = useState('otp')           // 'otp' | 'backup'
  const [code, setCode] = useState('')
  const [backup, setBackup] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const headers = { Authorization: `Bearer ${preAuth.token}` }

  function backToLogin(notice) {
    cancelPreAuth()
    navigate('/login', { replace: true, state: { notice } })
  }

  useEffect(() => {
    if (left === 0) backToLogin('Your sign-in session expired. Please log in again.')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [left])

  async function submit(e) {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      const { data } = mode === 'otp'
        ? await api.post('/api/auth/otp/verify', { otp: code }, { headers })
        : await api.post('/api/auth/otp/backup', { code: backup }, { headers })
      completeLogin(data.accessToken)
      const notice = data.remainingBackupCodes !== undefined
        ? `Backup code accepted. ${data.remainingBackupCodes} backup codes left.` : undefined
      navigate(homePath(data.role), { replace: true, state: notice ? { notice } : undefined })
    } catch (err) {
      const c = errCode(err)
      if (c === 'UNAUTHORIZED') return backToLogin('Your sign-in session expired. Please log in again.')
      if (c === 'ACCOUNT_LOCKED') return backToLogin(errMsg(err))
      setError(errMsg(err)); setCode(''); setBackup('')
    } finally {
      setBusy(false)
    }
  }

  return (
    <AuthCard
      title="Enter your code"
      subtitle={mode === 'otp'
        ? 'Open your authenticator and type the 6-digit code.'
        : 'Type one of your saved backup codes.'}
      footer={<>
        <button className="link" onClick={() => { setMode(mode === 'otp' ? 'backup' : 'otp'); setError('') }}>
          {mode === 'otp' ? 'Use a backup code' : 'Use authenticator code'}
        </button>
        <Link to="/authenticator" target="_blank">Open in-app authenticator</Link>
      </>}
    >
      <Alert>{error}</Alert>
      <form onSubmit={submit}>
        {mode === 'otp'
          ? <OtpInput value={code} onChange={setCode} disabled={busy} />
          : <Field label="Backup code" value={backup} onChange={(e) => setBackup(e.target.value)} placeholder="XXXXX-XXXXX" autoFocus />}
        <button className="btn" disabled={busy || (mode === 'otp' ? code.length !== 6 : backup.length < 10)}>
          {busy ? 'Verifying...' : 'Verify'}
        </button>
      </form>
      <p className="muted center">
        Session expires in {mmss(left)}. Five wrong codes lock your account for 15 minutes.
      </p>
    </AuthCard>
  )
}