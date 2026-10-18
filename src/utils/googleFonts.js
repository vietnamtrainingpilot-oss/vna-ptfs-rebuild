const LINK_ID = 'vnaptfs-google-fonts'

// Loads the given font preset's Google Fonts families via a single
// dynamically-managed <link> tag, replacing any previously loaded one.
export function loadFontPreset(preset) {
  if (!preset) return
  const families = new Set([preset.heading.googleFamily, preset.body.googleFamily])
  const href = `https://fonts.googleapis.com/css2?${[...families].map((f) => `family=${f}`).join('&')}&display=swap`

  let link = document.getElementById(LINK_ID)
  if (!link) {
    link = document.createElement('link')
    link.id = LINK_ID
    link.rel = 'stylesheet'
    document.head.appendChild(link)
  }
  if (link.href !== href) link.href = href
}
