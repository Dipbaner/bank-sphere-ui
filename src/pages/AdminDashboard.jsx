import { useEffect, useState } from 'react'
import { api, errMsg } from '../api/client'
import Alert from '../components/Alert'
import DashboardLayout from '../components/DashboardLayout'

export default function AdminDashboard() {
  const [page, setPage] = useState(0)
  const [data, setData] = useState({ content: [] })
  const [error, setError] = useState('')

  useEffect(() => {
    api.get('/api/admin/audit-logs', { params: { page, size: 10 } })
      .then((r) => setData(r.data))
      .catch((e) => setError(errMsg(e)))
  }, [page])

  const totalPages = data.totalPages ?? data.page?.totalPages ?? 1

  return (
    <DashboardLayout title="Admin dashboard">
      <h3>Audit log</h3>
      <Alert>{error}</Alert>
      <table>
        <thead>
          <tr><th>Time</th><th>Action</th><th>Status</th><th>Who</th><th>IP</th><th>Details</th></tr>
        </thead>
        <tbody>
          {(data.content ?? []).map((a) => (
            <tr key={a.id}>
              <td>{a.eventTime?.replace('T', ' ').slice(0, 19)}</td>
              <td>{a.action}</td>
              <td>{a.status}</td>
              <td>{a.identifier}</td>
              <td>{a.ip}</td>
              <td>{a.details}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pager">
        <button className="link" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
        <span className="muted">Page {page + 1} of {totalPages}</span>
        <button className="link" disabled={page + 1 >= totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </DashboardLayout>
  )
}