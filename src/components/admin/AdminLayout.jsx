import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSiteConfig } from '../../context/SiteConfigContext.jsx'
import Icon from '../ui/Icon.jsx'
import AdminDashboard from './AdminDashboard.jsx'
import AdminIdentity from './AdminIdentity.jsx'
import AdminTheme from './AdminTheme.jsx'
import AdminNavigation from './AdminNavigation.jsx'
import AdminPages from './AdminPages.jsx'
import AdminData from './AdminData.jsx'
import AdminSettings from './AdminSettings.jsx'
import './admin.css'

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'layout-dashboard' },
  { id: 'identity', label: 'Site Identity', icon: 'building-2' },
  { id: 'theme', label: 'Theme & Design', icon: 'palette' },
  { id: 'navigation', label: 'Navigation', icon: 'navigation' },
  { id: 'pages', label: 'Pages', icon: 'file-stack' },
  { id: 'data', label: 'Import / Export', icon: 'database' },
  { id: 'settings', label: 'Settings', icon: 'key-round' },
]

const SCREENS = {
  dashboard: AdminDashboard,
  identity: AdminIdentity,
  theme: AdminTheme,
  navigation: AdminNavigation,
  pages: AdminPages,
  data: AdminData,
  settings: AdminSettings,
}

export default function AdminLayout() {
  const { config, logout } = useSiteConfig()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const Screen = SCREENS[activeTab]

  function go(tab) {
    setActiveTab(tab)
    setSidebarOpen(false)
  }

  return (
    <div className="admin-app">
      <div className="admin-mobile-topbar">
        <button onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Icon name="menu" size={22} /></button>
        <strong>Admin Panel</strong>
        <Link to="/" aria-label="View site"><Icon name="external-link" size={20} /></Link>
      </div>

      <div className="admin-layout">
        <aside className={`admin-sidebar${sidebarOpen ? ' is-open' : ''}`}>
          <div className="admin-sidebar__brand">
            <span className="admin-sidebar__brand-icon"><Icon name="plane" size={18} strokeWidth={2.2} /></span>
            <span>{config.identity.siteName}<small>Admin Panel</small></span>
          </div>
          <nav>
            {TABS.map((tab) => (
              <button key={tab.id} className={activeTab === tab.id ? 'is-active' : ''} onClick={() => go(tab.id)}>
                <Icon name={tab.icon} size={17} />
                {tab.label}
              </button>
            ))}
          </nav>
          <div className="admin-sidebar__footer">
            <Link to="/"><Icon name="external-link" size={16} /> View site</Link>
            <button onClick={logout}><Icon name="log-out" size={16} /> Log out</button>
          </div>
        </aside>
        {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 190 }} />}

        <div className="admin-main">
          <div className="admin-main__inner">
            <Screen onNavigate={go} />
          </div>
        </div>
      </div>
    </div>
  )
}
