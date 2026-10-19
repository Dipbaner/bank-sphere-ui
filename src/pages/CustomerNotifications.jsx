import { useState } from 'react'

const startingNotifications = [
  { id: 'CUS-801', title: 'Transfer completed', detail: 'Your transfer of ₹ 4,200.00 to Ananya Rao was completed.', time: 'Today, 10:42 AM', category: 'Transactions', read: false },
  { id: 'CUS-800', title: 'Salary credited', detail: '₹ 72,500.00 was credited to your Everyday savings account.', time: 'Yesterday, 09:30 AM', category: 'Accounts', read: false },
  { id: 'CUS-799', title: 'New sign-in detected', detail: 'A sign-in to your demo account was verified with MFA.', time: '18 Jun 2026, 08:14 PM', category: 'Security', read: true },
  { id: 'CUS-798', title: 'Statement ready', detail: 'Your monthly account statement is ready to preview.', time: '16 Jun 2026, 11:05 AM', category: 'Accounts', read: true },
]

export default function CustomerNotifications() {
  const [notifications, setNotifications] = useState(startingNotifications)
  const [filter, setFilter] = useState('All')
  const unreadCount = notifications.filter((item) => !item.read).length
  const visible = notifications.filter((item) => filter === 'All' || (filter === 'Unread' ? !item.read : item.category === filter))

  function toggleRead(id) {
    setNotifications((current) => current.map((item) => item.id === id ? { ...item, read: !item.read } : item))
  }

  function markAllRead() {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })))
  }

  return (
    <div className="portal-page">
      <section className="portal-page-heading">
        <div>
          <p className="portal-eyebrow">YOUR BANK · INBOX</p>
          <h1>Notifications</h1>
          <p className="portal-subtitle">Stay up to date on account activity and security.</p>
        </div>
        <button className="portal-button portal-button-quiet" disabled={!unreadCount} onClick={markAllRead}>Mark all as read</button>
      </section>
      <section className="portal-section portal-notification-panel">
        <div className="portal-notification-toolbar">
          <span>{unreadCount} unread</span>
          <label>Show
            <select value={filter} onChange={(event) => setFilter(event.target.value)}>
              <option>All</option>
              <option>Unread</option>
              <option>Transactions</option>
              <option>Accounts</option>
              <option>Security</option>
            </select>
          </label>
        </div>
        <div className="portal-notification-list">
          {visible.length ? visible.map((item) => (
            <article className={`portal-notification${item.read ? '' : ' unread'}`} key={item.id}>
              <span className={`portal-notification-icon ${item.category.toLowerCase()}`}>{item.category.slice(0, 2).toUpperCase()}</span>
              <div className="portal-notification-copy">
                <div><strong>{item.title}</strong><span className="portal-notification-category">{item.category}</span></div>
                <p>{item.detail}</p>
                <small>{item.time}</small>
              </div>
              <button className="portal-small-button" onClick={() => toggleRead(item.id)}>{item.read ? 'Mark unread' : 'Mark read'}</button>
            </article>
          )) : (
            <div className="portal-empty-state"><span>✓</span><h2>No notifications here</h2><p>Choose another filter to see your sample alerts.</p></div>
          )}
        </div>
        <p className="portal-notification-disclaimer">Sample notifications only. Read status is stored in memory and resets when you leave this preview.</p>
      </section>
    </div>
  )
}
