import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import { api, errCode, errMsg } from '../api/client'
import { useAuth } from '../auth/AuthContext'
import { homePath } from '../auth/routes'
import Alert from '../components/Alert'
import AuthCard from '../components/AuthCard'
import OtpInput from '../components/OtpInput'

export const DEMO_KEY = 'bs_demo_authenticator'

export default function OtpEnroll() {
  const { preAuth, completeLogin, cancelPreAuth } = useAuth()
  const navigate = useNavigate()

  const [setup, setSetup] = useState(null)       // { secret, otpauthUri, ... }
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)     // { backupCodes, accessToken, role }
  const [saved, setSaved] = useState(false)
  const [demoSaved, setDemoSaved] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const started = useRef(false)                  // enrolling twice would create two different secrets

  const headers = { Authorization: `Bearer ${preAuth.token}` }

  useEffect(() => {
    if (started.current) return
    started.current = true
    api.post('/api/auth/otp/enroll', null, { headers })
      .then(({ data }) => setSetup(data))
      .catch((err) => {
        if (errCode(err) === 'OTP_ALREADY_ENABLED') navigate('/otp/verify', { replace: true })
        else setError(errMsg(err))
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function confirm(e) {
    e.preventDefault()
    setError(''); setBusy(true)
    try {
      const { data } = await api.post('/api/auth/otp/enroll/confirm', { otp: code }, { headers })
      setResult(data)                            // show the backup codes BEFORE entering the app
    } catch (err) {
      if (errCode(err) === 'UNAUTHORIZED' || errCode(err) === 'ACCOUNT_LOCKED') {
        cancelPreAuth()
        return navigate('/login', { replace: true, state: { notice: errMsg(err, 'Session expired. Please log in again.') } })
      }
      setError(errMsg(err)); setCode('')
    } finally {
      setBusy(false)
    }
  }

  function download() {
    const text = 'BankSphere backup codes\n\n' + result.backupCodes.join('\n') +
      '\n\nEach code works once. Keep this file somewhere safe.\n'
    const url = URL.createObjectURL(new Blob([text], { type: 'text/plain' }))
    const a = document.createElement('a')
    a.href = url
    a.download = 'banksphere-backup-codes.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  function enterApp() {
    completeLogin(result.accessToken)
    navigate(homePath(result.role), { replace: true })
  }

  function saveToDemoAuthenticator() {
    localStorage.setItem(DEMO_KEY, JSON.stringify({ secret: setup.secret }))
    setDemoSaved(true)
  }

  /* ---------------- screen 2: backup codes ---------------- */
  if (result) {
    return (
      <AuthCard title="Save your backup codes" subtitle="If you lose your phone, each code can be used once to sign in. They are shown only now.">
        <div className="codes">
          {result.backupCodes.map((c) => <span key={c}>{c}</span>)}
        </div>
        <button className="btn btn-secondary" onClick={download}>Download as a file</button>
        <label className="check">
          <input type="checkbox" checked={saved} onChange={(e) => setSaved(e.target.checked)} />
          I have saved these codes
        </label>
        <button className="btn" disabled={!saved} onClick={enterApp}>Continue to BankSphere</button>
      </AuthCard>
    )
  }

  /* ---------------- screen 1: scan and confirm ---------------- */
  return (
    <AuthCard title="Set up your authenticator" subtitle="Scan the QR code with Google Authenticator, Microsoft Authenticator or a similar app.">
      <Alert>{error}</Alert>
      {!setup && !error && <p className="muted center">Preparing...</p>}
      {setup && (
        <>
          <div className="qr"><QRCodeSVG value={setup.otpauthUri} size={180} /></div>
          <p className="muted center">Cannot scan? Enter this key by hand:</p>
          <div className="key">{setup.secret.match(/.{1,4}/g).join(' ')}</div>
          <button className="link" onClick={saveToDemoAuthenticator}>
            {demoSaved ? 'Saved to the in-app authenticator' : 'Also save to the in-app demo authenticator'}
          </button>
          <form onSubmit={confirm}>
            <p className="muted center">Then type the 6-digit code it shows:</p>
            <OtpInput value={code} onChange={setCode} disabled={busy} autoFocus={false} />
            <button className="btn" disabled={busy || code.length !== 6}>
              {busy ? 'Checking...' : 'Confirm and continue'}
            </button>
          </form>
        </>
      )}
    </AuthCard>
  )
}