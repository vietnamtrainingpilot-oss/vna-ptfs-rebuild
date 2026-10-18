import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSiteConfig } from '../../context/SiteConfigContext.jsx'
import Icon from '../ui/Icon.jsx'
import './admin.css'

export default function AdminLogin() {
  const { login } = useSiteConfig()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setChecking(true)
    const ok = await login(password)
    setChecking(false)
    if (ok) {
      setError('')
    } else {
      setError('Incorrect password. Try again.')
    }
  }

  return (
    <div className="admin-app">
      <div className="admin-login">
        <form className="admin-login__card" onSubmit={handleSubmit}>
          <div className="admin-login__icon"><Icon name="lock" size={24} /></div>
          <h1>Admin Panel</h1>
          <p>Sign in to customize the website — theme, navigation and every page's content.</p>
          {error && <div className="admin-login__error">{error}</div>}
          <input
            type="password"
            placeholder="Admin password"
            value={password}
            autoFocus
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="admin-login__submit" disabled={checking}>{checking ? 'Checking…' : 'Sign in'}</button>
          <Link to="/" className="admin-login__back">← Back to site</Link>
        </form>
      </div>
    </div>
  )
}
