import { Link } from 'react-router-dom'
import navigationData from '../../data/navigation.js'
import { useSiteConfig } from '../../context/SiteConfigContext.jsx'
import Icon from '../ui/Icon.jsx'
import './Footer.css'

function chunk(arr, parts) {
  const size = Math.ceil(arr.length / parts)
  return Array.from({ length: parts }, (_, i) => arr.slice(i * size, i * size + size)).filter((c) => c.length)
}

export default function Footer() {
  const { config } = useSiteConfig()
  const { logo, siteName, tagline } = config.identity
  const visibleItems = navigationData.filter((item) => !config.navOverrides[item.id]?.hidden)
  const columns = chunk(visibleItems, 3)
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="container site-footer__grid">
        <div className="site-footer__brand">
          <Link to="/" className="site-footer__brand-link">
            {logo?.image ? (
              <img src={logo.image} alt={logo.alt || siteName} className="site-footer__logo-img" />
            ) : (
              <span className="site-footer__logo-mark"><Icon name="plane" size={18} strokeWidth={2} /></span>
            )}
            <span>{siteName}</span>
          </Link>
          {tagline && <p className="site-footer__tagline">{tagline}</p>}
        </div>

        {columns.map((col, i) => (
          <nav key={i} className="site-footer__col" aria-label="Footer navigation">
            <ul>
              {col.map((item) => (
                <li key={item.id}><Link to={item.path}>{config.navOverrides[item.id]?.label || item.label}</Link></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="container site-footer__bottom">
        <p>© {year} {siteName}. All rights reserved.</p>
        <Link to="/admin" className="site-footer__admin-link">
          <Icon name="lock" size={13} /> Admin
        </Link>
      </div>
    </footer>
  )
}
