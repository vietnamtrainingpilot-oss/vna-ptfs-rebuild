import { Link, useLocation } from 'react-router-dom'
import navigationData, { flattenPages } from '../data/navigation.js'
import { useSiteConfig } from '../context/SiteConfigContext.jsx'
import Breadcrumbs from '../components/layout/Breadcrumbs.jsx'
import SectionRenderer from '../components/sections/SectionRenderer.jsx'
import EmptyState from '../components/ui/EmptyState.jsx'
import Icon from '../components/ui/Icon.jsx'
import NotFound from './NotFound.jsx'

function PageTitleBar({ title }) {
  return (
    <div className="container page-title-bar">
      <h1>{title}</h1>
    </div>
  )
}

function HubIndex({ navItem, config }) {
  const children = (navItem.children || []).filter((c) => !config.navOverrides[c.id]?.hidden)
  if (children.length === 0) {
    return <EmptyState icon="layout-dashboard" title="Nothing here yet" message="Sections for this page haven't been added in the admin panel yet." />
  }
  return (
    <div className="section container">
      <div className="grid grid-3 hub-index">
        {children.map((child) => (
          <Link key={child.id} to={child.path} className="card card--hoverable hub-index__card">
            <span>{config.navOverrides[child.id]?.label || child.label}</span>
            <Icon name="arrow-right" size={18} />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default function PageRenderer() {
  const location = useLocation()
  const { config, getPage } = useSiteConfig()
  const allPages = flattenPages(navigationData)
  const current = allPages.find((p) => p.path === location.pathname)

  if (!current) return <NotFound />

  const page = getPage(current.id)
  const labelOf = (id, fallback) => config.navOverrides[id]?.label || fallback

  const trail = []
  if (current.id !== 'home') {
    trail.push({ label: 'Home', path: '/' })
    if (current.parentId) {
      const parentNav = navigationData.find((n) => n.id === current.parentId)
      if (parentNav) trail.push({ label: labelOf(parentNav.id, parentNav.label), path: parentNav.path })
    }
    trail.push({ label: labelOf(current.id, current.label), path: current.path })
  }

  const hasHeroFirst = page.sections[0]?.type === 'hero'
  const title = page.titleOverride || current.label
  const navItem = current.isHub ? navigationData.find((n) => n.id === current.id) : null

  return (
    <>
      {trail.length > 0 && <Breadcrumbs trail={trail} />}
      {!hasHeroFirst && current.id !== 'home' && <PageTitleBar title={title} />}

      {page.sections.length > 0 ? (
        page.sections.map((section) => <SectionRenderer key={section.id} section={section} />)
      ) : current.isHub ? (
        <HubIndex navItem={navItem} config={config} />
      ) : (
        <EmptyState
          icon="file-text"
          title="No content has been added to this page yet"
          message={`"${title}" is part of the site structure and ready to go — add sections to it from the admin panel.`}
          adminHint="Open Admin Panel"
        />
      )}
    </>
  )
}
