export const formatMoney = (value, currency = 'INR') =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value)

export const formatDate = (value, options = { day: 'numeric', month: 'short', year: 'numeric' }) =>
  new Intl.DateTimeFormat('en-IN', options).format(new Date(value))

export function downloadCsv(filename, rows) {
  const escape = (value) => `"${String(value ?? '').replace(/"/g, '""')}"`
  const content = rows.map((row) => row.map(escape).join(',')).join('\r\n')
  const url = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}
