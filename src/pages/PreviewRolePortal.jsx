import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { downloadCsv } from '../customer/customerUtils'

const employeeSections = [
  { key: 'overview', label: 'Overview', icon: 'OV' },
  { key: 'customers', label: 'Customers', icon: 'CU' },
  { key: 'verification', label: 'KYC review', icon: 'KY' },
  { key: 'transactions', label: 'Monitoring', icon: 'TX' },
  { key: 'requests', label: 'Service requests', icon: 'SR' },
  { key: 'notifications', label: 'Notifications', icon: 'NO' },
]

const adminSections = [
  { key: 'overview', label: 'Overview', icon: 'OV' },
  { key: 'users', label: 'Users & roles', icon: 'UR' },
  { key: 'accounts', label: 'Accounts', icon: 'AC' },
  { key: 'transactions', label: 'Transactions', icon: 'TX' },
  { key: 'audit', label: 'Audit trail', icon: 'AU' },
  { key: 'settings', label: 'System settings', icon: 'SE' },
  { key: 'notifications', label: 'Notifications', icon: 'NO' },
]

const employeeCustomers = [
  ['CU-10482', 'Priya Sharma', 'priya.sharma@example.com', 'KYC review', 'In review'],
  ['CU-10479', 'Arjun Patel', 'arjun.patel@example.com', 'Savings account', 'Active'],
  ['CU-10476', 'Neha Iyer', 'neha.iyer@example.com', 'Address update', 'Pending'],
  ['CU-10471', 'Karan Singh', 'karan.singh@example.com', 'Current account', 'Active'],
]

const initialReviews = [
  { id: 'KYC-3018', customer: 'CU-10482 · Priya Sharma', type: 'Identity verification', received: 'Today, 10:18 AM', documents: '3 files', documentNames: ['Government ID', 'Address proof', 'Customer photograph'], status: 'Awaiting review' },
  { id: 'KYC-3017', customer: 'CU-10465 · Devika Nair', type: 'Savings account opening', received: 'Today, 09:42 AM', documents: '4 files', documentNames: ['Government ID', 'Address proof', 'Income declaration', 'Customer photograph'], status: 'Awaiting review' },
  { id: 'KYC-3012', customer: 'CU-10458 · Rohan Das', type: 'Address verification', received: 'Yesterday, 04:30 PM', documents: '2 files', documentNames: ['Government ID', 'Utility bill'], status: 'Awaiting review' },
  { id: 'KYC-3009', customer: 'CU-10443 · Maya Roy', type: 'Identity verification', received: 'Yesterday, 02:12 PM', documents: '3 files', documentNames: ['Government ID', 'Address proof', 'Customer photograph'], status: 'Awaiting review' },
]

const initialFlaggedTransactions = [
  { id: 'TXN-260618-084', alert: 'Large transfer', account: 'Customer ••4821', amount: '₹ 2,50,000.00', status: 'Needs review' },
  { id: 'TXN-260618-079', alert: 'Repeated transfers', account: 'Customer ••1029', amount: '₹ 48,500.00', status: 'Investigating' },
  { id: 'TXN-260617-221', alert: 'Unusual activity', account: 'Customer ••7746', amount: '₹ 1,15,000.00', status: 'Needs review' },
]

const adminUsers = [
  { id: 'USR-00841', name: 'Priya Sharma', role: 'Customer', email: 'priya.sharma@example.com', status: 'Active' },
  { id: 'USR-00839', name: 'Arjun Patel', role: 'Customer', email: 'arjun.patel@example.com', status: 'Active' },
  { id: 'USR-00028', name: 'Samira Khan', role: 'Employee', email: 'samira.khan@example.com', status: 'Active' },
  { id: 'USR-00004', name: 'Dev Admin', role: 'Admin', email: 'dev.admin@example.com', status: 'Active' },
]

const initialAuditEvents = [
  { time: '10:42:18', event: 'TRANSFER_REVIEWED', actor: 'Samira Khan', ip: '10.24.8.16', details: 'Reviewed flagged transaction TXN-260618-084' },
  { time: '10:35:06', event: 'KYC_APPROVED', actor: 'Dev Admin', ip: '10.24.8.10', details: 'Approved customer verification CU-10468' },
  { time: '09:58:41', event: 'USER_SIGN_IN', actor: 'Priya Sharma', ip: '49.36.112.8', details: 'Successful sign-in with MFA' },
  { time: '09:42:03', event: 'ACCOUNT_FROZEN', actor: 'Samira Khan', ip: '10.24.8.16', details: 'Placed account ••3382 on temporary hold' },
]

const initialAdminAccounts = [
  { number: '•••• 4821', customer: 'Priya Sharma', type: 'Savings', balance: '₹ 84,250.75', status: 'Active' },
  { number: '•••• 1906', customer: 'Priya Sharma', type: 'Current', balance: '₹ 1,26,800.00', status: 'Active' },
  { number: '•••• 3382', customer: 'Rohan Das', type: 'Savings', balance: '₹ 42,010.00', status: 'Frozen' },
  { number: '•••• 9014', customer: 'Maya Roy', type: 'Current', balance: '₹ 2,18,400.00', status: 'Active' },
]

const adminTransactions = [
  ['TXN-260618-084', 'Priya Sharma', 'Transfer', '₹ 2,50,000.00', 'Flagged'],
  ['TXN-260618-081', 'Arjun Patel', 'Deposit', '₹ 35,000.00', 'Completed'],
  ['TXN-260618-079', 'Rohan Das', 'Transfer', '₹ 48,500.00', 'Review'],
  ['TXN-260617-221', 'Maya Roy', 'Transfer', '₹ 1,15,000.00', 'Flagged'],
]

const initialEmployeeRequests = [
  { id: 'REQ-5018', type: 'Update residential address', customer: 'Priya Sharma', received: 'Today, 10:31 AM', status: 'Awaiting review' },
  { id: 'REQ-5017', type: 'Unfreeze debit card', customer: 'Arjun Patel', received: 'Today, 09:54 AM', status: 'In progress' },
  { id: 'REQ-5011', type: 'Close savings account', customer: 'Neha Iyer', received: 'Yesterday, 04:12 PM', status: 'Awaiting review' },
]

const initialNotifications = [
  { id: 'NTF-104', title: 'KYC submission awaiting review', detail: 'Priya Sharma submitted identity documents for verification.', time: '10:18 AM', category: 'KYC', read: false },
  { id: 'NTF-103', title: 'High-value transfer flagged', detail: 'TXN-260618-084 was flagged by the demo risk rules.', time: '10:05 AM', category: 'Risk', read: false },
  { id: 'NTF-102', title: 'Service request received', detail: 'Priya Sharma requested a residential address update.', time: '09:54 AM', category: 'Request', read: false },
  { id: 'NTF-101', title: 'Daily operations summary', detail: 'All demo services are operational. No live systems are connected.', time: 'Yesterday', category: 'System', read: true },
]

function routeBase(role) {
  return `/preview/${role.toLowerCase()}`
}

function PreviewTable({ headers, rows, statusColumn = -1 }) {
  return (
    <div className="portal-table-wrap">
      <table className="portal-table">
        <thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead>
        <tbody>{rows.map((row, index) => (
          <tr key={`${row[0]}-${index}`}>{row.map((cell, cellIndex) => (
            <td key={`${cell}-${cellIndex}`}>{cellIndex === statusColumn
              ? <span className={`preview-status ${/active|approved|completed/i.test(cell) ? 'good' : /investigat|progress/i.test(cell) ? 'working' : 'pending'}`}>{cell}</span>
              : cell}</td>
          ))}</tr>
        ))}</tbody>
      </table>
    </div>
  )
}

function EmployeeBody({ section, customers, reviews, setReviews, transactions, setTransactions, requests, setRequests }) {
  const [query, setQuery] = useState('')
  const [selectedReview, setSelectedReview] = useState(null)
  const [notice, setNotice] = useState('')
  const normalizedQuery = query.trim().toLowerCase()

  if (section === 'customers') {
    const filteredCustomers = customers.filter((customer) =>
      customer.slice(0, 4).some((value) => value.toLowerCase().includes(normalizedQuery))
    )
    const selectedCustomer = customers.find((customer) => customer[0] === selectedReview)
    return <>
      <div className="preview-module-heading">
        <div><h2>Customer directory</h2><p>Search customer profiles and review account status.</p></div>
        <input aria-label="Search customers" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, email or ID" />
      </div>
      <p className="preview-results-count" aria-live="polite">{filteredCustomers.length} customers shown</p>
      {filteredCustomers.length
        ? <PreviewTable headers={['CUSTOMER ID', 'NAME', 'EMAIL', 'ACCOUNT', 'STATUS', 'ACTION']} rows={filteredCustomers.map((customer) => [...customer, <button className="preview-row-action" onClick={() => setSelectedReview(customer[0])}>View profile</button>])} statusColumn={4} />
        : <div className="preview-empty-state"><strong>No matching customers</strong><span>Try another name, email, or customer ID.</span></div>}
      {selectedCustomer && <section className="preview-review-card" aria-label="Customer profile details">
        <div className="preview-module-heading"><div><h3>{selectedCustomer[1]}</h3><p>{selectedCustomer[0]} · Customer profile</p></div><button className="preview-row-action quiet" onClick={() => setSelectedReview(null)}>Close</button></div>
        <div className="preview-profile-detail-grid">
          <div><span>Email</span><strong>{selectedCustomer[2]}</strong></div>
          <div><span>Relationship status</span><strong>{selectedCustomer[4]}</strong></div>
          <div><span>Account / request</span><strong>{selectedCustomer[3]}</strong></div>
          <div><span>Customer since</span><strong>14 June 2022</strong></div>
          <div><span>KYC status</span><strong>{selectedCustomer[3].toLowerCase().includes('kyc') ? 'In review' : 'Verified'}</strong></div>
          <div><span>Preferred contact</span><strong>Email and in-app notifications</strong></div>
        </div>
        <p className="preview-demo-disclaimer">Profile information is sample data for frontend preview only.</p>
      </section>}
    </>
  }

  if (section === 'verification') {
    const openReviews = reviews.filter((review) => review.status === 'Awaiting review')
    const review = reviews.find((item) => item.id === selectedReview)
    function updateReview(id, status) {
      const selected = reviews.find((item) => item.id === id)
      setReviews((current) => current.map((item) => item.id === id ? { ...item, status } : item))
      setNotice(`${selected?.customer ?? 'Customer'}: ${status.toLowerCase()}.`)
      setSelectedReview(null)
    }
    return <>
      <div className="preview-module-heading">
        <div><h2>Verification queue</h2><p>Review identity, address, and account-opening submissions.</p></div>
        <span className="portal-count-pill">{openReviews.length} awaiting review</span>
      </div>
      {notice && <p className="preview-action-notice" role="status">{notice}</p>}
      <PreviewTable
        headers={['CUSTOMER', 'SUBMISSION', 'RECEIVED', 'DOCUMENTS', 'STATUS', 'ACTION']}
        rows={reviews.map((item) => [
          item.customer,
          item.type,
          item.received,
          item.documents,
          <span className={`preview-status ${item.status === 'Approved' ? 'good' : item.status === 'Awaiting review' ? 'pending' : 'working'}`}>{item.status}</span>,
          item.status === 'Awaiting review'
            ? <button className="preview-row-action" onClick={() => { setSelectedReview(item.id); setNotice('') }}>Review</button>
            : '—',
        ])}
      />
      {review && <section className="preview-review-card" aria-label="KYC review details">
        <div className="preview-module-heading">
          <div><h3>{review.customer} · {review.type}</h3><p>{review.id} · Submitted {review.received}</p></div>
          <button className="preview-row-action quiet" onClick={() => setSelectedReview(null)}>Close</button>
        </div>
        <div className="preview-document-grid">
          {review.documentNames.map((document) => <div key={document}><span>▤</span><div><strong>{document}</strong><small>Uploaded · mock document</small></div><span className="preview-status good">Received</span></div>)}
        </div>
        <div className="preview-review-actions">
          <button className="preview-row-action" onClick={() => updateReview(review.id, 'Approved')}>Approve KYC</button>
          <button className="preview-row-action secondary" onClick={() => updateReview(review.id, 'Information requested')}>Request information</button>
          <button className="preview-row-action danger" onClick={() => updateReview(review.id, 'Rejected')}>Reject submission</button>
        </div>
        <p className="preview-demo-disclaimer">Demo action: this only changes the sample review status in this browser session.</p>
      </section>}
    </>
  }

  if (section === 'transactions') {
    const openAlerts = transactions.filter((item) => item.status !== 'Reviewed')
    const selectedTransaction = transactions.find((item) => item.id === selectedReview)
    function updateTransaction(id, status) {
      const item = transactions.find((transaction) => transaction.id === id)
      setTransactions((current) => current.map((transaction) => transaction.id === id ? { ...transaction, status } : transaction))
      setNotice(`${item?.id ?? 'Transaction'} marked ${status.toLowerCase()}.`)
    }
    return <>
      <div className="preview-module-heading"><div><h2>Transaction monitoring</h2><p>Review activity flagged by the demo risk rules.</p></div><span className="preview-alert-count">{openAlerts.length} need attention</span></div>
      {notice && <p className="preview-action-notice" role="status">{notice}</p>}
      <PreviewTable
        headers={['REFERENCE', 'ALERT', 'ACCOUNT', 'AMOUNT', 'REVIEW STATUS', 'ACTION']}
        rows={transactions.map((item) => [
          item.id,
          item.alert,
          item.account,
          item.amount,
          <span className={`preview-status ${item.status === 'Reviewed' ? 'good' : item.status === 'Investigating' ? 'working' : 'pending'}`}>{item.status}</span>,
          <div className="preview-inline-actions">
              <button className="preview-row-action quiet" onClick={() => setSelectedReview(selectedReview === item.id ? null : item.id)}>Details</button>
              {item.status !== 'Reviewed' &&
              <button className="preview-row-action" onClick={() => updateTransaction(item.id, 'Reviewed')}>Mark reviewed</button>
              }
              {item.status !== 'Reviewed' && item.status !== 'Investigating' && <button className="preview-row-action quiet" onClick={() => updateTransaction(item.id, 'Investigating')}>Investigate</button>}
          </div>,
        ])}
      />
      {selectedTransaction && <section className="preview-review-card" aria-label="Transaction investigation details">
        <div className="preview-module-heading"><div><h3>{selectedTransaction.alert}</h3><p>{selectedTransaction.id} · {selectedTransaction.account}</p></div><button className="preview-row-action quiet" onClick={() => setSelectedReview(null)}>Close</button></div>
        <div className="preview-profile-detail-grid">
          <div><span>Amount</span><strong>{selectedTransaction.amount}</strong></div>
          <div><span>Risk trigger</span><strong>{selectedTransaction.alert}</strong></div>
          <div><span>Observed</span><strong>18 June 2026 · 10:05 AM</strong></div>
          <div><span>Review status</span><strong>{selectedTransaction.status}</strong></div>
        </div>
        <label className="preview-note-field">Investigation note<textarea placeholder="Add an internal note for this demo review" rows="3" /></label>
        <p className="preview-demo-disclaimer">This investigation panel is illustrative. It does not access or change a real transaction.</p>
      </section>}
      <p className="preview-demo-disclaimer">Risk alerts are illustrative sample data and do not represent a live fraud assessment.</p>
    </>
  }

  if (section === 'requests') {
    function updateRequest(id, status) {
      const item = requests.find((request) => request.id === id)
      setRequests((current) => current.map((request) => request.id === id ? { ...request, status } : request))
      setNotice(`${item?.id ?? 'Request'} updated to ${status.toLowerCase()}.`)
    }
    const selectedRequest = requests.find((item) => item.id === selectedReview)
    return <>
      <div className="preview-module-heading"><div><h2>Service requests</h2><p>Track customer requests for profile and account changes.</p></div></div>
      {notice && <p className="preview-action-notice" role="status">{notice}</p>}
      <PreviewTable
        headers={['REQUEST', 'TYPE', 'CUSTOMER', 'RECEIVED', 'STATUS', 'ACTION']}
        rows={requests.map((item) => [
          item.id,
          item.type,
          item.customer,
          item.received,
          <span className={`preview-status ${item.status === 'Completed' ? 'good' : item.status === 'In progress' ? 'working' : 'pending'}`}>{item.status}</span>,
          <div className="preview-inline-actions">
              <button className="preview-row-action quiet" onClick={() => setSelectedReview(selectedReview === item.id ? null : item.id)}>Details</button>
              {item.status !== 'Completed' && <>
              {item.status === 'Awaiting review' && <button className="preview-row-action quiet" onClick={() => updateRequest(item.id, 'In progress')}>Start review</button>}
              <button className="preview-row-action" onClick={() => updateRequest(item.id, 'Completed')}>Complete</button>
              </>}
          </div>,
        ])}
      />
      {selectedRequest && <section className="preview-review-card" aria-label="Service request details">
        <div className="preview-module-heading"><div><h3>{selectedRequest.type}</h3><p>{selectedRequest.id} · {selectedRequest.customer}</p></div><button className="preview-row-action quiet" onClick={() => setSelectedReview(null)}>Close</button></div>
        <div className="preview-profile-detail-grid">
          <div><span>Received</span><strong>{selectedRequest.received}</strong></div>
          <div><span>Status</span><strong>{selectedRequest.status}</strong></div>
          <div><span>Request summary</span><strong>Customer request submitted through the demo portal.</strong></div>
          <div><span>Required follow-up</span><strong>Review supporting details and confirm with customer.</strong></div>
        </div>
        <label className="preview-note-field">Staff note<textarea placeholder="Add an internal note for this request" rows="3" /></label>
        <p className="preview-demo-disclaimer">Notes are for visual demonstration only and are not persisted.</p>
      </section>}
      <p className="preview-demo-disclaimer">Request updates are local demo state only; no customer account data is changed.</p>
    </>
  }
  return <RoleOverview role="EMPLOYEE" />
}

function AdminBody({ section, users, setUsers, accounts, setAccounts, settings, setSettings, audit, setAudit, notifications, setNotifications }) {
  const [query, setQuery] = useState('')
  const [notice, setNotice] = useState('')
  const [editingUser, setEditingUser] = useState(null)
  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'Customer' })
  const [editingSetting, setEditingSetting] = useState(null)
  const [settingDraft, setSettingDraft] = useState('')
  const [eventFilter, setEventFilter] = useState('All events')
  const normalizedQuery = query.trim().toLowerCase()

  function logAdminEvent(event, details) {
    const now = new Date()
    const time = now.toLocaleTimeString('en-GB', { hour12: false })
    setAudit((current) => [{ time, event, actor: 'Dev Admin', ip: '10.24.8.10', details }, ...current])
  }

  function openUserForm(user = null) {
    setEditingUser(user?.id ?? 'new')
    setUserForm(user
      ? { name: user.name, email: user.email, role: user.role }
      : { name: '', email: '', role: 'Customer' })
    setNotice('')
  }

  function saveUser(event) {
    event.preventDefault()
    const isNew = editingUser === 'new'
    const user = {
      id: isNew ? `USR-${String(Date.now()).slice(-5)}` : editingUser,
      ...userForm,
      status: isNew ? 'Active' : users.find((item) => item.id === editingUser)?.status ?? 'Active',
    }
    setUsers((current) => isNew ? [user, ...current] : current.map((item) => item.id === user.id ? user : item))
    logAdminEvent(isNew ? 'USER_CREATED' : 'USER_UPDATED', `${isNew ? 'Created' : 'Updated'} ${user.role.toLowerCase()} user ${user.name}`)
    setNotice(`${user.name} ${isNew ? 'added' : 'updated'} in demo data.`)
    setEditingUser(null)
  }

  function toggleUser(user) {
    const status = user.status === 'Active' ? 'Disabled' : 'Active'
    setUsers((current) => current.map((item) => item.id === user.id ? { ...item, status } : item))
    logAdminEvent(status === 'Disabled' ? 'USER_DISABLED' : 'USER_ENABLED', `${status === 'Disabled' ? 'Disabled' : 'Enabled'} user ${user.name}`)
    setNotice(`${user.name} is now ${status.toLowerCase()}.`)
  }

  if (section === 'users') {
    const filteredUsers = users.filter((user) => [user.id, user.name, user.email, user.role, user.status].some((value) => value.toLowerCase().includes(normalizedQuery)))
    return <>
      <div className="preview-module-heading"><div><h2>User directory</h2><p>Manage sample customer, employee, and administrator access.</p></div><button className="portal-button portal-button-primary" onClick={() => openUserForm()}>＋ Add user</button></div>
      {notice && <p className="preview-action-notice" role="status">{notice}</p>}
      <label className="preview-search-field"><span>⌕</span><input aria-label="Search users" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, email, role or user ID" /></label>
      {editingUser && <form className="preview-editor-card" onSubmit={saveUser}>
        <div className="preview-module-heading"><div><h3>{editingUser === 'new' ? 'Add user' : 'Edit user'}</h3><p>Changes affect this browser session only.</p></div><button type="button" className="preview-row-action quiet" onClick={() => setEditingUser(null)}>Cancel</button></div>
        <div className="preview-editor-fields">
          <label>Name<input required minLength="2" value={userForm.name} onChange={(event) => setUserForm((current) => ({ ...current, name: event.target.value }))} /></label>
          <label>Email<input type="email" required value={userForm.email} onChange={(event) => setUserForm((current) => ({ ...current, email: event.target.value }))} /></label>
          <label>Role<select value={userForm.role} onChange={(event) => setUserForm((current) => ({ ...current, role: event.target.value }))}><option>Customer</option><option>Employee</option><option>Admin</option></select></label>
          <button className="portal-button portal-button-primary" type="submit">{editingUser === 'new' ? 'Add demo user' : 'Save changes'}</button>
        </div>
      </form>}
      {filteredUsers.length
        ? <PreviewTable headers={['USER ID', 'NAME', 'ROLE', 'EMAIL', 'STATUS', 'ACTIONS']} rows={filteredUsers.map((user) => [
          user.id, user.name, user.role, user.email,
          <span className={`preview-status ${user.status === 'Active' ? 'good' : 'pending'}`}>{user.status}</span>,
          <div className="preview-inline-actions"><button className="preview-row-action quiet" onClick={() => openUserForm(user)}>Edit</button><button className={`preview-row-action ${user.status === 'Active' ? 'danger' : ''}`} onClick={() => toggleUser(user)}>{user.status === 'Active' ? 'Disable' : 'Enable'}</button></div>,
        ])} />
        : <div className="preview-empty-state"><strong>No matching users</strong><span>Change the search terms and try again.</span></div>}
      <p className="preview-demo-disclaimer">User administration is mock-only. No account access or roles are changed on a server.</p>
    </>
  }

  if (section === 'accounts') {
    const filteredAccounts = accounts.filter((account) => [account.number, account.customer, account.type, account.status].some((value) => value.toLowerCase().includes(normalizedQuery)))
    function toggleAccount(account) {
      const status = account.status === 'Active' ? 'Frozen' : 'Active'
      setAccounts((current) => current.map((item) => item.number === account.number ? { ...item, status } : item))
      logAdminEvent(status === 'Frozen' ? 'ACCOUNT_FROZEN' : 'ACCOUNT_UNFROZEN', `${status === 'Frozen' ? 'Froze' : 'Unfroze'} account ${account.number}`)
      setNotice(`${account.number} is now ${status.toLowerCase()} in demo data.`)
    }
    return <>
      <div className="preview-module-heading"><div><h2>All accounts</h2><p>Search the sample account portfolio and manage operational status.</p></div></div>
      {notice && <p className="preview-action-notice" role="status">{notice}</p>}
      <label className="preview-search-field"><span>⌕</span><input aria-label="Search accounts" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search account, customer, type or status" /></label>
      <PreviewTable headers={['ACCOUNT', 'CUSTOMER', 'TYPE', 'BALANCE', 'STATUS', 'ACTION']} rows={filteredAccounts.map((account) => [
        account.number, account.customer, account.type, account.balance,
        <span className={`preview-status ${account.status === 'Active' ? 'good' : 'pending'}`}>{account.status}</span>,
        <button className={`preview-row-action ${account.status === 'Active' ? 'danger' : ''}`} onClick={() => toggleAccount(account)}>{account.status === 'Active' ? 'Freeze' : 'Unfreeze'}</button>,
      ])} />
      <p className="preview-demo-disclaimer">Freeze and unfreeze buttons only update local sample state. No account is actually restricted.</p>
    </>
  }

  if (section === 'transactions') {
    const filtered = adminTransactions.filter((row) => row.join(' ').toLowerCase().includes(normalizedQuery))
    return <>
      <div className="preview-module-heading"><div><h2>Transaction activity</h2><p>Recent sample activity across the BankSphere network.</p></div><button className="portal-button portal-button-quiet" onClick={() => downloadCsv('banksphere-demo-transactions.csv', [['Reference', 'Customer', 'Type', 'Amount', 'Status'], ...filtered])}>↓ Export CSV</button></div>
      <label className="preview-search-field"><span>⌕</span><input aria-label="Search transactions" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search reference, customer, type or status" /></label>
      <PreviewTable headers={['REFERENCE', 'CUSTOMER', 'TYPE', 'AMOUNT', 'STATUS']} rows={filtered} statusColumn={4} />
      <p className="preview-demo-disclaimer">Transaction data is illustrative; CSV export contains sample rows only.</p>
    </>
  }

  if (section === 'audit') {
    const eventTypes = [...new Set(audit.map((event) => event.event))]
    const filtered = audit.filter((event) =>
      (eventFilter === 'All events' || event.event === eventFilter) &&
      [event.actor, event.details, event.ip, event.event].some((value) => value.toLowerCase().includes(normalizedQuery))
    )
    return <>
      <div className="preview-module-heading"><div><h2>System audit trail</h2><p>Filter and export recent demo security and operations events.</p></div><button className="portal-button portal-button-quiet" onClick={() => downloadCsv('banksphere-demo-audit.csv', [['TIME', 'EVENT', 'ACTOR', 'IP ADDRESS', 'DETAILS'], ...filtered.map((event) => [event.time, event.event, event.actor, event.ip, event.details])])}>↓ Export CSV</button></div>
      <div className="preview-filter-row">
        <label className="preview-search-field"><span>⌕</span><input aria-label="Search audit events" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search actor, details or IP" /></label>
        <label className="preview-event-filter">Event type<select value={eventFilter} onChange={(event) => setEventFilter(event.target.value)}><option>All events</option>{eventTypes.map((event) => <option key={event}>{event}</option>)}</select></label>
      </div>
      <PreviewTable headers={['TIME', 'EVENT', 'ACTOR', 'IP ADDRESS', 'DETAILS']} rows={filtered.map((event) => [event.time, event.event, event.actor, event.ip, event.details])} />
      <p className="preview-demo-disclaimer">{filtered.length} sample event{filtered.length === 1 ? '' : 's'} shown. New mock admin actions add entries to this session's trail.</p>
    </>
  }

  if (section === 'settings') {
    const settingsData = [
      { key: 'transferLimit', title: 'Transfer limit', description: 'Maximum single transaction', suffix: '₹', step: '1000' },
      { key: 'dailyLimit', title: 'Daily customer limit', description: 'Maximum outgoing per day', suffix: '₹', step: '1000' },
      { key: 'beneficiaryDelay', title: 'New beneficiary delay', description: 'Activation period before first transfer', suffix: 'minutes', step: '5' },
    ]
    function saveSetting(key) {
      setSettings((current) => ({ ...current, [key]: settingDraft }))
      logAdminEvent('POLICY_UPDATED', `Updated ${settingsData.find((item) => item.key === key)?.title} to ${settingDraft}`)
      setNotice('Policy value updated in demo data.')
      setEditingSetting(null)
    }
    return <>
      <div className="preview-module-heading"><div><h2>System settings</h2><p>Configure sample transaction controls and customer policies.</p></div></div>
      {notice && <p className="preview-action-notice" role="status">{notice}</p>}
      <div className="preview-settings-grid">{settingsData.map((item) => (
        <article key={item.key}>
          <span>{item.title}</span>
          {editingSetting === item.key
            ? <div className="preview-setting-editor"><input type="number" min="1" step={item.step} value={settingDraft} onChange={(event) => setSettingDraft(event.target.value)} aria-label={`${item.title} value`} /><small>{item.suffix}</small></div>
            : <strong>{item.key === 'beneficiaryDelay' ? `${settings[item.key]} minutes` : `₹ ${Number(settings[item.key]).toLocaleString('en-IN')}`}</strong>}
          <small>{item.description}</small>
          {editingSetting === item.key
            ? <div className="preview-inline-actions"><button className="preview-row-action" disabled={!Number(settingDraft) || Number(settingDraft) <= 0} onClick={() => saveSetting(item.key)}>Save</button><button className="preview-row-action quiet" onClick={() => setEditingSetting(null)}>Cancel</button></div>
            : <button className="portal-button portal-button-quiet" onClick={() => { setEditingSetting(item.key); setSettingDraft(String(settings[item.key])); setNotice('') }}>Edit policy</button>}
        </article>
      ))}</div>
      <p className="preview-demo-disclaimer">Policy controls only update local preview state and do not affect real banking operations.</p>
    </>
  }

  if (section === 'notifications') return <NotificationBody role="ADMIN" notifications={notifications} setNotifications={setNotifications} />
  return <RoleOverview role="ADMIN" />
}

function NotificationBody({ role, notifications, setNotifications }) {
  const [filter, setFilter] = useState('All')
  const visibleNotifications = notifications.filter((item) => filter === 'All' || (filter === 'Unread' ? !item.read : item.category === filter))
  const unreadCount = notifications.filter((item) => !item.read).length

  function toggleRead(id) {
    setNotifications((current) => current.map((item) => item.id === id ? { ...item, read: !item.read } : item))
  }

  function markAllRead() {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })))
  }

  return <>
    <div className="preview-module-heading">
      <div><h2>Notifications inbox</h2><p>Demo alerts and updates for the {role.toLowerCase()} workspace.</p></div>
      <button className="portal-button portal-button-quiet" disabled={!unreadCount} onClick={markAllRead}>Mark all as read</button>
    </div>
    <div className="preview-notification-toolbar">
      <span>{unreadCount} unread</span>
      <label>Show<select value={filter} onChange={(event) => setFilter(event.target.value)}><option>All</option><option>Unread</option><option>KYC</option><option>Risk</option><option>Request</option><option>System</option></select></label>
    </div>
    <div className="preview-notification-list">
      {visibleNotifications.length ? visibleNotifications.map((item) => (
        <article className={`preview-notification${item.read ? '' : ' unread'}`} key={item.id}>
          <span className={`preview-notification-icon ${item.category.toLowerCase()}`}>{item.category.slice(0, 2).toUpperCase()}</span>
          <div className="preview-notification-copy"><div><strong>{item.title}</strong><span className="preview-notification-category">{item.category}</span></div><p>{item.detail}</p><small>{item.time}</small></div>
          <button className="preview-row-action quiet" onClick={() => toggleRead(item.id)}>{item.read ? 'Mark unread' : 'Mark read'}</button>
        </article>
      )) : <div className="preview-empty-state"><strong>No notifications here</strong><span>Choose another filter to see more demo notifications.</span></div>}
    </div>
    <p className="preview-demo-disclaimer">Notifications are static sample content; read states exist only for this browser session.</p>
  </>
}

function RoleOverview({ role, audit = initialAuditEvents }) {
  const isAdmin = role === 'ADMIN'
  const metrics = isAdmin
    ? [['TOTAL CUSTOMERS', '12,840', '+ 4.8% this month', 'blue'], ['ACTIVE ACCOUNTS', '18,296', '+ 2.1% this month', 'green'], ['TRANSACTION VOLUME', '₹ 8.42 Cr', 'This month', 'violet'], ['FLAGGED ACTIVITY', '03', 'Requires review', 'orange']]
    : [['CUSTOMERS SERVED', '128', 'This month', 'blue'], ['KYC REVIEWS', '08', 'Awaiting your review', 'orange'], ['FLAGGED ACTIVITY', '03', 'Requires your attention', 'violet'], ['OPEN REQUESTS', '05', 'Across all customers', 'green']]
  return <>
    <section className="portal-page-heading"><div><p className="portal-eyebrow">{isAdmin ? 'BANK-WIDE OPERATIONS' : 'STAFF WORKSPACE'}</p><h1>{isAdmin ? 'Good morning, Dev' : 'Good morning, Samira'}</h1><p className="portal-subtitle">{isAdmin ? 'Your BankSphere overview for today.' : 'Here’s your team’s work at a glance.'}</p></div><span className="preview-date-pill">● All systems operational</span></section>
    <section className="preview-metric-grid">{metrics.map(([label, value, foot, tone]) => <article className="preview-metric-card" key={label}><span className={`preview-metric-icon ${tone}`}>{tone === 'green' ? '↗' : tone === 'orange' ? '!' : tone === 'violet' ? '◇' : '▤'}</span><span className="preview-metric-label">{label}</span><strong>{value}</strong><small>{foot}</small></article>)}</section>
    <section className="preview-content-card"><div className="portal-section-heading"><div><h2>{isAdmin ? 'Recent system activity' : 'Needs your attention'}</h2><p>{isAdmin ? 'Latest events from across the bank.' : 'Prioritized items in your work queue.'}</p></div></div>{isAdmin ? <PreviewTable headers={['TIME', 'EVENT', 'ACTOR', 'IP ADDRESS', 'DETAILS']} rows={audit.slice(0, 3).map((event) => [event.time, event.event, event.actor, event.ip, event.details])} /> : <PreviewTable headers={['CUSTOMER', 'TASK', 'RECEIVED', 'PRIORITY', 'STATUS']} rows={ [['CU-10482 · Priya Sharma', 'Review identity documents', '10:18 AM', 'Normal', 'Awaiting review'], ['TXN-260618-084 · ••4821', 'Review large transfer', '10:05 AM', 'High', 'Needs review'], ['REQ-5018 · Priya Sharma', 'Address change request', '09:54 AM', 'Normal', 'Awaiting review']] } statusColumn={4} />}</section>
    <section className="preview-content-card"><div className="portal-section-heading"><div><h2>{isAdmin ? 'Monthly transaction volume' : 'Quick access'}</h2><p>{isAdmin ? 'Illustrative daily volume for the current month.' : 'Jump into your most-used work areas.'}</p></div></div>{isAdmin ? <div className="preview-chart" aria-label="Demo monthly transaction volume"><div style={{ height: '36%' }} /><div style={{ height: '52%' }} /><div style={{ height: '44%' }} /><div style={{ height: '69%' }} /><div style={{ height: '55%' }} /><div style={{ height: '82%' }} /><div style={{ height: '64%' }} /><div style={{ height: '93%' }} /><div style={{ height: '73%' }} /><div style={{ height: '100%' }} /><div style={{ height: '79%' }} /><div style={{ height: '88%' }} /></div> : <div className="preview-shortcuts"><Link to="/preview/employee/customers">Search customers <span>→</span></Link><Link to="/preview/employee/verification">Review KYC <span>→</span></Link><Link to="/preview/employee/transactions">Monitor transactions <span>→</span></Link><Link to="/preview/employee/requests">Handle requests <span>→</span></Link></div>}</section>
  </>
}

export default function PreviewRolePortal({ role }) {
  const isAdmin = role === 'ADMIN'
  const location = useLocation()
  const navigate = useNavigate()
  const customers = employeeCustomers
  const [users, setUsers] = useState(adminUsers)
  const [accounts, setAccounts] = useState(initialAdminAccounts)
  const [settings, setSettings] = useState({ transferLimit: 500000, dailyLimit: 1000000, beneficiaryDelay: 30 })
  const [audit, setAudit] = useState(initialAuditEvents)
  const [reviews, setReviews] = useState(initialReviews)
  const [transactions, setTransactions] = useState(initialFlaggedTransactions)
  const [requests, setRequests] = useState(initialEmployeeRequests)
  const [notifications, setNotifications] = useState(initialNotifications)
  const base = routeBase(role)
  const sections = (isAdmin ? adminSections : employeeSections).map((item) => ({
    ...item,
    count: item.key === 'verification'
      ? reviews.filter((review) => review.status === 'Awaiting review').length
      : item.key === 'transactions' && !isAdmin
        ? transactions.filter((transaction) => transaction.status !== 'Reviewed').length
        : item.key === 'requests'
          ? requests.filter((request) => request.status !== 'Completed').length
          : item.key === 'notifications'
            ? notifications.filter((notification) => !notification.read).length
            : undefined,
  }))
  const section = location.pathname.slice(base.length + 1).split('/')[0] || 'overview'
  const active = sections.find((item) => item.key === section) || sections[0]
  const heading = active.key === 'overview' ? 'Overview' : active.label
  const initials = isAdmin ? 'DA' : 'SK'

  return <div className="portal preview-role-portal">
    <aside className="portal-sidebar">
      <Link className="portal-brand" to="/preview"><span className="portal-brand-mark">B</span><span>Bank<span>Sphere</span></span></Link>
      <div className="portal-nav-label">{isAdmin ? 'ADMINISTRATION' : 'OPERATIONS'}</div>
      <nav className="portal-nav" aria-label={`${role.toLowerCase()} demo navigation`}>
        {sections.map((item) => <Link className={`portal-nav-link${item.key === active.key ? ' active' : ''}`} to={item.key === 'overview' ? base : `${base}/${item.key}`} key={item.key}>
          <span className="portal-nav-icon">{item.icon}</span>{item.label}{item.count && <span className="preview-nav-count">{item.count}</span>}
        </Link>)}
      </nav>
      <div className="portal-sidebar-bottom">
        <Link className="portal-preview-link" to="/preview">← Switch demo portal</Link>
        <div className="portal-user"><div className="portal-avatar">{initials}</div><div className="portal-user-info"><strong>{isAdmin ? 'Dev Admin' : 'Samira Khan'}</strong><span>{isAdmin ? 'Bank administrator' : 'Bank employee'}</span></div></div>
      </div>
    </aside>
    <div className="portal-main">
      <header className="portal-topbar"><div className="portal-breadcrumb">BankSphere <span>/</span> {heading}</div><div className="portal-topbar-right"><span className="portal-demo-badge"><span /> Demo environment</span><button className="portal-topbar-link preview-switch-button" onClick={() => navigate('/preview')}>All portals</button><div className="portal-topbar-avatar">{initials}</div></div></header>
      <main className="portal-content">
        <div className="portal-demo-notice"><strong>Demo preview</strong><span>This {isAdmin ? 'admin' : 'employee'} portal uses sample operational data. Actions are visual only.</span></div>
        <div className="portal-page">
          {active.key === 'overview' ? <RoleOverview role={role} audit={audit} /> : active.key === 'notifications' ? <NotificationBody role={role} notifications={notifications} setNotifications={setNotifications} /> : isAdmin ? <AdminBody
            section={active.key}
            users={users}
            setUsers={setUsers}
            accounts={accounts}
            setAccounts={setAccounts}
            settings={settings}
            setSettings={setSettings}
            audit={audit}
            setAudit={setAudit}
            notifications={notifications}
            setNotifications={setNotifications}
          /> : <EmployeeBody
            section={active.key}
            customers={customers}
            reviews={reviews}
            setReviews={setReviews}
            transactions={transactions}
            setTransactions={setTransactions}
            requests={requests}
            setRequests={setRequests}
          />}
          <p className="portal-footnote">Sample interface for frontend development. No backend requests are made in preview mode.</p>
        </div>
      </main>
    </div>
  </div>
}
