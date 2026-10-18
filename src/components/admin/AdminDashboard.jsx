import { useMemo } from 'react'
import { useSiteConfig } from '../../context/SiteConfigContext.jsx'
import { flattenPages } from '../../data/navigation.js'
import navigationData from '../../data/navigation.js'
import { configSizeKB } from '../../utils/storage.js'
import Icon from '../ui/Icon.jsx'

export default function AdminDashboard({ onNavigate }) {
  const { config } = useSiteConfig()

  const stats = useMemo(() => {
    const all = flattenPages(navigationData)
    const withContent = all.filter((p) => (config.pages[p.id]?.sections?.length || 0) > 0)
    const totalSections = all.reduce((sum, p) => sum + (config.pages[p.id]?.sections?.length || 0), 0)
    return { totalPages: all.length, withContent: withContent.length, totalSections, sizeKB: configSizeKB(config) }
  }, [config])

  const quickLinks = [
    { id: 'identity', icon: 'building-2', title: 'Site Identity', desc: 'Logo, favicon & site name' },
    { id: 'theme', icon: 'palette', title: 'Theme & Design', desc: 'Colors, fonts & backgrounds' },
    { id: 'navigation', icon: 'navigation', title: 'Navigation', desc: 'Show, hide & rename menu items' },
    { id: 'pages', icon: 'file-stack', title: 'Pages', desc: 'Add and edit page content' },
  ]

  return (
    <div>
      <div className="admin-screen__header">
        <h1>Dashboard</h1>
        <p>An overview of your site — jump into any area to start customizing.</p>
      </div>

      <div className="dash-banner">
        <div>
          <h2>How publishing works</h2>
          <p>
            Changes save instantly to this browser and preview live when you view the site.
            To make them visible to everyone once you deploy on Netlify, go to
            <strong> Import / Export</strong> and export your config, then include it in your deployment.
          </p>
        </div>
        <button className="admin-btn" onClick={() => onNavigate('data')}>
          <Icon name="database" size={16} /> Open Import / Export
        </button>
      </div>

      <div className="dash-grid">
        <div className="dash-stat"><strong>{stats.totalPages}</strong><span>Total pages in the site structure</span></div>
        <div className="dash-stat"><strong>{stats.withContent}</strong><span>Pages with content added</span></div>
        <div className="dash-stat"><strong>{stats.totalSections}</strong><span>Sections built across the site</span></div>
      </div>

      <div className="admin-card">
        <h2>Storage used</h2>
        <p className="admin-card__desc">Your config is stored in this browser's local storage ({stats.sizeKB} KB of a ~5,000 KB typical limit).</p>
        <div className="storage-bar"><div className="storage-bar__fill" style={{ width: `${Math.min(100, (stats.sizeKB / 5000) * 100)}%` }} /></div>
      </div>

      <h2 style={{ fontSize: '1.05rem', marginBottom: '0.9rem' }}>Quick links</h2>
      <div className="quick-links">
        {quickLinks.map((q) => (
          <button key={q.id} className="quick-link" onClick={() => onNavigate(q.id)}>
            <span className="quick-link__icon"><Icon name={q.icon} size={18} /></span>
            <span><strong>{q.title}</strong><span>{q.desc}</span></span>
          </button>
        ))}
      </div>
    </div>
  )
}
