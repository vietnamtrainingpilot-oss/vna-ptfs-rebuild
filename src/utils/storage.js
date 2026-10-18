const CONFIG_KEY = 'vnaptfs_site_config_v1'
const AUTH_KEY = 'vnaptfs_admin_auth_v1'

export function loadConfig() {
  try {
    const raw = localStorage.getItem(CONFIG_KEY)
    if (!raw) return null
    return JSON.parse(raw)
  } catch (err) {
    console.error('Failed to read saved site config, ignoring it:', err)
    return null
  }
}

export function saveConfig(config) {
  try {
    localStorage.setItem(CONFIG_KEY, JSON.stringify(config))
    return true
  } catch (err) {
    console.error('Failed to save site config (storage full or unavailable):', err)
    return false
  }
}

export function clearConfig() {
  localStorage.removeItem(CONFIG_KEY)
}

export function isAdminAuthed() {
  return sessionStorage.getItem(AUTH_KEY) === '1'
}

export function setAdminAuthed(value) {
  if (value) sessionStorage.setItem(AUTH_KEY, '1')
  else sessionStorage.removeItem(AUTH_KEY)
}

// Rough byte-size estimate of the JSON-serialized config, for the
// storage-usage indicator in the admin Data tab (localStorage caps
// out around 5MB in most browsers).
export function configSizeKB(config) {
  try {
    return Math.round(new Blob([JSON.stringify(config)]).size / 1024)
  } catch {
    return 0
  }
}
