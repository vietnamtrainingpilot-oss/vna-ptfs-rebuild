import { useEffect, useMemo } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import navigationData, { flattenPages } from '../../data/navigation.js'
import { useSiteConfig } from '../../context/SiteConfigContext.jsx'
import Header from './Header.jsx'
import Footer from './Footer.jsx'
import BackToTop from './BackToTop.jsx'

export default function Layout() {
  const { config, getPage } = useSiteConfig()
  const location = useLocation()

  const allPages = useMemo(() => flattenPages(navigationData), [])
  const currentPage = allPages.find((p) => p.path === location.pathname)
  const page = currentPage ? getPage(currentPage.id) : null
  const heroMode = page?.sections?.[0]?.type === 'hero'

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [location.pathname])

  useEffect(() => {
    const title = page?.titleOverride || currentPage?.label
    document.title = title ? `${title} — ${config.identity.siteName}` : config.identity.siteName
  }, [currentPage, page, config.identity.siteName])

  const mainStyle = {}
  if (page?.backgroundColor) mainStyle.backgroundColor = page.backgroundColor
  if (page?.backgroundImage) {
    mainStyle.backgroundImage = `url(${page.backgroundImage})`
    mainStyle.backgroundSize = 'cover'
    mainStyle.backgroundPosition = 'top center'
    mainStyle.backgroundAttachment = 'fixed'
  } else if (config.theme.backgroundImage) {
    mainStyle.backgroundImage = `url(${config.theme.backgroundImage})`
    mainStyle.backgroundSize = 'cover'
    mainStyle.backgroundPosition = 'top center'
    mainStyle.backgroundAttachment = 'fixed'
  }

  return (
    <div className="site-shell">
      <Header heroMode={heroMode} />
      <main style={mainStyle}>
        <div key={location.pathname} className="page-enter">
          <Outlet />
        </div>
      </main>
      <Footer />
      <BackToTop />
    </div>
  )
}
