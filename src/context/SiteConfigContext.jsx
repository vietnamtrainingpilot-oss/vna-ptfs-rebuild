import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react'
import defaultSiteConfig from '../data/defaultSiteConfig.js'
import sectionTypes from '../data/sectionTypes.js'
import fontOptions from '../data/fontOptions.js'
import { loadConfig, saveConfig, clearConfig, isAdminAuthed, setAdminAuthed } from '../utils/storage.js'
import { loadFontPreset } from '../utils/googleFonts.js'
import { sha256Hex } from '../utils/crypto.js'

const SiteConfigContext = createContext(null)

function isPlainObject(v) {
  return v !== null && typeof v === 'object' && !Array.isArray(v)
}

// Merges `override` onto `base`. Objects are merged key-by-key
// (so brand-new pages/fields introduced later still get their
// defaults); arrays and primitives in `override` fully replace `base`.
function deepMerge(base, override) {
  if (override === undefined || override === null) return base
  if (isPlainObject(base) && isPlainObject(override)) {
    const result = { ...base }
    for (const key of Object.keys(override)) {
      result[key] = deepMerge(base[key], override[key])
    }
    return result
  }
  return override
}

function newId(prefix = 'sec') {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`
}

export function SiteConfigProvider({ children }) {
  const [config, setConfig] = useState(() => deepMerge(defaultSiteConfig, loadConfig()))
  const [isAuthed, setIsAuthed] = useState(() => isAdminAuthed())
  const [lastSavedAt, setLastSavedAt] = useState(null)

  // First-visit-in-this-browser bootstrap: if there's no local draft yet,
  // pull the published baseline from public/content.json (this is the file
  // the admin overwrites with an exported config + redeploy — see
  // Admin -> Import/Export). Browsers that already have a local draft keep
  // editing from that draft instead, so this never clobbers live edits.
  useEffect(() => {
    if (loadConfig()) return
    fetch('/content.json')
      .then((r) => (r.ok ? r.json() : null))
      .then((json) => {
        if (json && Object.keys(json).length > 0) {
          setConfig((c) => deepMerge(c, json))
        }
      })
      .catch(() => {})
  }, [])

  useEffect(() => {
    saveConfig(config)
    setLastSavedAt(Date.now())
  }, [config])

  useEffect(() => {
    const preset = fontOptions.find((f) => f.id === config.theme.fontPresetId) || fontOptions[0]
    loadFontPreset(preset)
  }, [config.theme.fontPresetId])

  // ---- identity & theme -------------------------------------------------
  const updateIdentity = useCallback((patch) => {
    setConfig((c) => ({ ...c, identity: { ...c.identity, ...patch } }))
  }, [])

  const updateTheme = useCallback((patch) => {
    setConfig((c) => ({ ...c, theme: { ...c.theme, ...patch } }))
  }, [])

  const updateThemeColors = useCallback((patch) => {
    setConfig((c) => ({ ...c, theme: { ...c.theme, colors: { ...c.theme.colors, ...patch } } }))
  }, [])

  // ---- navigation overrides ----------------------------------------------
  const setNavOverride = useCallback((navId, patch) => {
    setConfig((c) => ({
      ...c,
      navOverrides: { ...c.navOverrides, [navId]: { ...(c.navOverrides[navId] || {}), ...patch } },
    }))
  }, [])

  // ---- page content -------------------------------------------------------
  const getPage = useCallback((pageId) => config.pages[pageId] || { sections: [], titleOverride: '', backgroundImage: '', backgroundColor: '', metaDescription: '' }, [config.pages])

  const updatePageMeta = useCallback((pageId, patch) => {
    setConfig((c) => ({
      ...c,
      pages: { ...c.pages, [pageId]: { ...(c.pages[pageId] || { sections: [] }), ...patch } },
    }))
  }, [])

  const addSection = useCallback((pageId, type, atIndex) => {
    const def = sectionTypes[type]
    if (!def) return
    const section = { id: newId(type), type, data: def.defaultData() }
    setConfig((c) => {
      const page = c.pages[pageId] || { sections: [] }
      const sections = [...page.sections]
      if (typeof atIndex === 'number') sections.splice(atIndex, 0, section)
      else sections.push(section)
      return { ...c, pages: { ...c.pages, [pageId]: { ...page, sections } } }
    })
    return section.id
  }, [])

  const updateSectionData = useCallback((pageId, sectionId, data) => {
    setConfig((c) => {
      const page = c.pages[pageId]
      if (!page) return c
      const sections = page.sections.map((s) => (s.id === sectionId ? { ...s, data } : s))
      return { ...c, pages: { ...c.pages, [pageId]: { ...page, sections } } }
    })
  }, [])

  const removeSection = useCallback((pageId, sectionId) => {
    setConfig((c) => {
      const page = c.pages[pageId]
      if (!page) return c
      return { ...c, pages: { ...c.pages, [pageId]: { ...page, sections: page.sections.filter((s) => s.id !== sectionId) } } }
    })
  }, [])

  const duplicateSection = useCallback((pageId, sectionId) => {
    setConfig((c) => {
      const page = c.pages[pageId]
      if (!page) return c
      const idx = page.sections.findIndex((s) => s.id === sectionId)
      if (idx === -1) return c
      const copy = { ...page.sections[idx], id: newId(page.sections[idx].type) }
      const sections = [...page.sections]
      sections.splice(idx + 1, 0, copy)
      return { ...c, pages: { ...c.pages, [pageId]: { ...page, sections } } }
    })
  }, [])

  const moveSection = useCallback((pageId, sectionId, direction) => {
    setConfig((c) => {
      const page = c.pages[pageId]
      if (!page) return c
      const idx = page.sections.findIndex((s) => s.id === sectionId)
      const newIdx = idx + direction
      if (idx === -1 || newIdx < 0 || newIdx >= page.sections.length) return c
      const sections = [...page.sections]
      const [moved] = sections.splice(idx, 1)
      sections.splice(newIdx, 0, moved)
      return { ...c, pages: { ...c.pages, [pageId]: { ...page, sections } } }
    })
  }, [])

  // ---- admin auth -----------------------------------------------------
  // Passwords are never stored or compared in plaintext — see
  // utils/crypto.js for why this still isn't "real" security on a
  // static site, and Admin → Settings for the caveat shown to admins.
  const login = useCallback(async (password) => {
    const hash = await sha256Hex(password)
    const ok = hash === config.admin.passwordHash
    if (ok) {
      setAdminAuthed(true)
      setIsAuthed(true)
    }
    return ok
  }, [config.admin.passwordHash])

  const logout = useCallback(() => {
    setAdminAuthed(false)
    setIsAuthed(false)
  }, [])

  const changePassword = useCallback(async (currentPassword, newPassword) => {
    const currentHash = await sha256Hex(currentPassword)
    if (currentHash !== config.admin.passwordHash) return false
    if (!newPassword || newPassword.length < 8) return false
    const newHash = await sha256Hex(newPassword)
    setConfig((c) => ({ ...c, admin: { ...c.admin, passwordHash: newHash } }))
    return true
  }, [config.admin.passwordHash])

  // ---- import / export / reset ----------------------------------------
  const exportConfig = useCallback(() => {
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'vnaptfs-site-config.json'
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }, [config])

  const importConfig = useCallback((jsonText) => {
    try {
      const parsed = JSON.parse(jsonText)
      if (!isPlainObject(parsed)) throw new Error('File is not a valid config object')
      setConfig(deepMerge(defaultSiteConfig, parsed))
      return { ok: true }
    } catch (err) {
      return { ok: false, error: err.message }
    }
  }, [])

  const resetConfig = useCallback(() => {
    clearConfig()
    setConfig(defaultSiteConfig)
  }, [])

  const value = useMemo(() => ({
    config, lastSavedAt, isAuthed,
    updateIdentity, updateTheme, updateThemeColors, setNavOverride,
    getPage, updatePageMeta, addSection, updateSectionData, removeSection, duplicateSection, moveSection,
    login, logout, changePassword,
    exportConfig, importConfig, resetConfig,
  }), [config, lastSavedAt, isAuthed, updateIdentity, updateTheme, updateThemeColors, setNavOverride, getPage, updatePageMeta, addSection, updateSectionData, removeSection, duplicateSection, moveSection, login, logout, changePassword, exportConfig, importConfig, resetConfig])

  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>
}

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext)
  if (!ctx) throw new Error('useSiteConfig must be used within a SiteConfigProvider')
  return ctx
}
