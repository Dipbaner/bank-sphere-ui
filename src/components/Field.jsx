export default function Field({ label, error, ...props }) {
  return (
    <div>
      <label>
        {label}
        <input {...props} />
      </label>
      {error && <div className="field-error">{error}</div>}
    </div>
  )
}