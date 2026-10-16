export default function AuthCard({ title, subtitle, children, footer }) {
  return (
    <main className="page">
      <div className="card">
        <h1 className="brand">BankSphere</h1>
        <h2>{title}</h2>
        {subtitle && <p className="muted">{subtitle}</p>}
        {children}
        {footer && <div className="footer">{footer}</div>}
      </div>
    </main>
  )
}