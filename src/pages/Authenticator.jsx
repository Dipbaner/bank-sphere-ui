import { useEffect, useMemo, useState } from 'react'
import * as OTPAuth from 'otpauth'
import AuthCard from '../components/AuthCard'
import Alert from '../components/Alert'
import Field from '../components/Field'
import { DEMO_KEY } from './OtpEnroll'

const RADIUS = 52
const CIRC = 2 * Math.PI * RADIUS

export default function Authenticator() {
  const [secret, setSecret] = useState(() => {
    try { return JSON.parse(localStorage.getItem(DEMO_KEY) || '{}').secret || '' } catch { return '' }
  })
  const [input, setInput] = useState('')
  const [shown, setShown] = useState(false)
  // eslint-disable-next-line react-hooks/purity
  const [now, setNow] = useState(Date.now())
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 500)
    return () => clearInterval(id)
  }, [])

  const totp = useMemo(() => {
    if (!secret) return null
    try {
      return new OTPAuth.TOTP({
        issuer: 'BankSphere', label: 'demo', algorithm: 'SHA1', digits: 6, period: 30,
        secret: OTPAuth.Secret.fromBase32(secret.replace(/\s/g, '')),
      })
    } catch { return null }
  }, [secret])

  const secondsLeft = 30 - (Math.floor(now / 1000) % 30)
  const code = shown && totp ? totp.generate({ timestamp: now }) : null

  function saveKey(e) {
    e.preventDefault()
    localStorage.setItem(DEMO_KEY, JSON.stringify({ secret: input.trim() }))
    setSecret(input.trim()); setInput('')
  }

  function forget() {
    localStorage.removeItem(DEMO_KEY)
    setSecret(''); setShown(false)
  }

  async function copy() {
    await navigator.clipboard.writeText(code)
    setCopied(true); setTimeout(() => setCopied(false), 1500)
  }

  return (
    <AuthCard title="In-app authenticator" subtitle="A demo of the bank app's Generate OTP screen.">
      <Alert type="info">
        Demo only: the key is stored in this browser, so it is weaker than a separate phone app.
      </Alert>

      {!secret || !totp ? (
        <form onSubmit={saveKey}>
          <Field label="Setup key" value={input} onChange={(e) => setInput(e.target.value)} placeholder="from the enrollment screen" required />
          <button className="btn">Save key</button>
        </form>
      ) : (
        <>
          {!shown && <button className="btn" onClick={() => setShown(true)}>Generate OTP</button>}
          {code && (
            <>
              <div className="big-code">{code.slice(0, 3)} {code.slice(3)}</div>
              <div className="ring">
                <svg width="120" height="120">
                  <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#eaecf0" strokeWidth="8" />
                  <circle cx="60" cy="60" r={RADIUS} fill="none" stroke="#1f4fd8" strokeWidth="8"
                    strokeDasharray={CIRC} strokeDashoffset={CIRC * (1 - secondsLeft / 30)} strokeLinecap="round" />
                </svg>
                <div className="count">{secondsLeft}</div>
              </div>
              <p className="muted center">A new code appears automatically every 30 seconds.</p>
              <button className="btn btn-secondary" onClick={copy}>{copied ? 'Copied' : 'Copy code'}</button>
            </>
          )}
          <p className="center"><button className="link" onClick={forget}>Remove saved key</button></p>
        </>
      )}
    </AuthCard>
  )
}