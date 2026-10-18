import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import navigationData from '../../data/navigation.js'
import { useSiteConfig } from '../../context/SiteConfigContext.jsx'
import Icon from '../ui/Icon.jsx'
import './Header.css'

export default function Header({ heroMode }) {
  const { config } = useSiteConfig()
  const location = useLocation()
  const [scrolled, setScrolled] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState(new Set())
  const closeTimer = useRef(null)

  const transparentCapable = config.theme.headerStyle === 'transparent' && heroMode
  const isTransparent = transparentCapable && !scrolled

  useEffect(() => {
    if (!transparentCapable) { setScrolled(false); return }
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [transparentCapable])

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false)
    setOpenDropdown(null)
  }, [location.pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  const visibleItems = navigationData.filter((item) => !config.navOverrides[item.id]?.hidden)
  const labelFor = (item) => config.navOverrides[item.id]?.label || item.label

  function handleEnter(id) {
    clearTimeout(closeTimer.current)
    setOpenDropdown(id)
  }
  function handleLeave() {
    closeTimer.current = setTimeout(() => setOpenDropdown(null), 120)
  }
  function toggleMobileGroup(id) {
    setMobileExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const { logo, siteName } = config.identity

  return (
    <header className={`site-header ${isTransparent ? 'site-header--transparent' : 'site-header--solid'}`}>
      <div className="container site-header__inner">
        <Link to="/" className="site-header__brand" aria-label={siteName}>
          {logo?.image ? (
            <img src={logo.image} alt={logo.alt || siteName} className="site-header__logo-img" />
          ) : (
            <span className="site-header__logo-mark" aria-hidden="true">
              <Icon name="plane" size={20} strokeWidth={2} />
            </span>
          )}
          <span className="site-header__name">{siteName}</span>
        </Link>

        <nav className="site-header__nav" aria-label="Primary">
          <ul>
            {visibleItems.map((item) => {
              const children = (item.children || []).filter((c) => !config.navOverrides[c.id]?.hidden)
              const hasChildren = children.length > 0
              return (
                <li
                  key={item.id}
                  className="site-header__item"
                  onMouseEnter={() => hasChildren && handleEnter(item.id)}
                  onMouseLeave={() => hasChildren && handleLeave()}
                >
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => `site-header__link${isActive ? ' is-active' : ''}`}
                    onClick={(e) => {
                      if (hasChildren && openDropdown !== item.id) {
                        e.preventDefault()
                        setOpenDropdown(item.id)
                      }
                    }}
                  >
                    {labelFor(item)}
                    {hasChildren && <Icon name="chevron-down" size={15} className={`site-header__chevron${openDropdown === item.id ? ' is-open' : ''}`} />}
                  </NavLink>
                  {hasChildren && (
                    <div className={`site-header__dropdown${openDropdown === item.id ? ' is-open' : ''}`}>
                      <ul>
                        {children.map((child) => (
                          <li key={child.id}>
                            <NavLink to={child.path} className={({ isActive }) => (isActive ? 'is-active' : '')}>
                              {labelFor(child)}
                              <Icon name="chevron-right" size={14} />
                            </NavLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        <button
          className="site-header__burger"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <Icon name={mobileOpen ? 'x' : 'menu'} size={24} />
        </button>
      </div>

      <div className={`site-header__mobile${mobileOpen ? ' is-open' : ''}`}>
        <ul>
          {visibleItems.map((item) => {
            const children = (item.children || []).filter((c) => !config.navOverrides[c.id]?.hidden)
            const hasChildren = children.length > 0
            const expanded = mobileExpanded.has(item.id)
            return (
              <li key={item.id} className="site-header__mobile-item">
                <div className="site-header__mobile-row">
                  <NavLink to={item.path} className={({ isActive }) => (isActive ? 'is-active' : '')}>
                    {labelFor(item)}
                  </NavLink>
                  {hasChildren && (
                    <button aria-label="Toggle submenu" onClick={() => toggleMobileGroup(item.id)}>
                      <Icon name="chevron-down" size={18} className={expanded ? 'is-open' : ''} />
                    </button>
                  )}
                </div>
                {hasChildren && (
                  <ul className={`site-header__mobile-sub${expanded ? ' is-open' : ''}`}>
                    {children.map((child) => (
                      <li key={child.id}>
                        <NavLink to={child.path} className={({ isActive }) => (isActive ? 'is-active' : '')}>
                          {labelFor(child)}
                        </NavLink>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </header>
  )
}
