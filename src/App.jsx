import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { SiteConfigProvider, useSiteConfig } from './context/SiteConfigContext.jsx'
import fontOptions from './data/fontOptions.js'
import Layout from './components/layout/Layout.jsx'
import PageRenderer from './pages/PageRenderer.jsx'
import AdminApp from './components/admin/AdminApp.jsx'
import './App.css'

// Applies the active theme (colors, fonts, corner radius) to CSS custom
// properties on the document root, so every component that reads
// var(--color-primary) etc. reflects live admin changes instantly.
function ThemeInjector() {
  const { config } = useSiteConfig()

  useEffect(() => {
    const root = document.documentElement
    const c = config.theme.colors
    root.style.setProperty('--color-primary', c.primary)
    root.style.setProperty('--color-primary-dark', c.primaryDark)
    root.style.setProperty('--color-secondary', c.secondary)
    root.style.setProperty('--color-creme', c.creme)
    root.style.setProperty('--color-background', c.background)
    root.style.setProperty('--color-surface', c.surface)
    root.style.setProperty('--color-text', c.text)
    root.style.setProperty('--color-text-muted', c.textMuted)
    root.style.setProperty('--color-border', c.border)

    const preset = fontOptions.find((f) => f.id === config.theme.fontPresetId) || fontOptions[0]
    root.style.setProperty('--font-heading', preset.heading.fallback)
    root.style.setProperty('--font-body', preset.body.fallback)

    const radiusMap = {
      sharp: ['2px', '4px', '6px'],
      soft: ['6px', '10px', '16px'],
      round: ['10px', '18px', '28px'],
    }
    const [sm, md, lg] = radiusMap[config.theme.radius] || radiusMap.soft
    root.style.setProperty('--radius-sm', sm)
    root.style.setProperty('--radius-md', md)
    root.style.setProperty('--radius-lg', lg)

    document.body.style.background = c.background
  }, [config.theme])

  return null
}

export default function App() {
  return (
    <SiteConfigProvider>
      <ThemeInjector />
      <BrowserRouter>
        <Routes>
          <Route path="/admin/*" element={<AdminApp />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<PageRenderer />} />
            <Route path="*" element={<PageRenderer />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SiteConfigProvider>
  )
}
