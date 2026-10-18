import { useState } from 'react'
import { useSiteConfig } from '../../context/SiteConfigContext.jsx'
import Icon from '../ui/Icon.jsx'

export default function AdminSettings() {
  const { changePassword } = useSiteConfig()
  const [current, setCurrent] = useState('')
  const [next, setNext] = useState('')
  const [confirm, setConfirm] = useState('')
  const [message, setMessage] = useState(null)

  async function handleSubmit(e) {
    e.preventDefault()
    if (next !== confirm) {
      setMessage({ type: 'error', text: "New passwords don't match." })
      return
    }
    const ok = await changePassword(current, next)
    if (ok) {
      setMessage({ type: 'success', text: 'Password updated.' })
      setCurrent(''); setNext(''); setConfirm('')
    } else {
      setMessage({ type: 'error', text: 'Current password is incorrect, or the new password is too short (min. 8 characters).' })
    }
  }

  return (
    <div>
      <div className="admin-screen__header">
        <h1>Settings</h1>
        <p>Manage admin access.</p>
      </div>

      <div className="admin-card">
        <h2>Change admin password</h2>
        {message && (
          <p style={{ fontSize: '0.85rem', marginBottom: '0.9rem', color: message.type === 'error' ? 'var(--a-danger)' : 'var(--a-success)' }}>
            {message.text}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="admin-field">
            <label>Current password</label>
            <input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} />
          </div>
          <div className="admin-field">
            <label>New password</label>
            <input type="password" value={next} onChange={(e) => setNext(e.target.value)} />
          </div>
          <div className="admin-field">
            <label>Confirm new password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
          </div>
          <button className="admin-btn" type="submit">Update password</button>
        </form>
      </div>

      <div className="admin-card" style={{ background: '#FFFBEB', borderColor: '#FDE68A' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Icon name="shield" size={17} /> A note on security</h2>
        <p className="admin-card__desc" style={{ marginBottom: 0 }}>
          This is a lightweight front-end gate suitable for keeping casual visitors out of the admin panel —
          it is <strong>not</strong> real security. The password is hashed (SHA-256) rather than stored as
          plain text, so it isn't visible by just reading <code>content.json</code> or the page source, but
          since this is a static site with no server, the check still happens entirely in the browser — a
          technically determined visitor could still bypass it (e.g. via the browser console). Don't store
          anything truly sensitive here, and don't reuse an important password. For real protection, put this
          route behind Netlify Identity or a serverless function instead.
        </p>
      </div>
    </div>
  )
}
