import navigation, { flattenPages } from './navigation.js'

// ---------------------------------------------------------------------
// Brand tokens below are sourced directly from the Vietnam Airlines
// Brand Guidelines PDF (Corporate Colors, p.16 / Support Typography,
// p.34-36): VNA Blue = PMS 308C / RGB(0,95,110), Golden-Yellow =
// PMS 7407C / RGB(230,180,65), Creme = PMS 9064C / RGB(250,250,235).
// Open Sans is stated in the guideline as the typeface used on VNA's
// own website; Titillium is the guideline's secondary/display face.
// Every value here is fully editable from Admin → Theme & Design.
// ---------------------------------------------------------------------

const emptyPages = {}
for (const page of flattenPages(navigation)) {
  emptyPages[page.id] = {
    sections: [],
    titleOverride: '',
    backgroundImage: '',
    backgroundColor: '',
    metaDescription: '',
  }
}

const defaultSiteConfig = {
  meta: { version: 1 },

  identity: {
    siteName: 'Vietnam Airlines PTFS',
    tagline: '',
    logo: { image: '', alt: 'Vietnam Airlines PTFS' },
    favicon: { image: '' },
  },

  theme: {
    fontPresetId: 'titillium-open-sans',
    colors: {
      primary: '#005F6E',     // VNA Blue — PMS 308C
      primaryDark: '#003C46', // derived deeper shade, used for footer / dark sections
      secondary: '#E6B441',   // Golden-Yellow — PMS 7407C
      creme: '#FAFAEB',       // Creme — PMS 9064C
      background: '#FFFFFF',
      surface: '#F4F6F7',
      text: '#13222B',
      textMuted: '#5B6B74',
      border: '#E1E7EA',
    },
    radius: 'soft',           // 'sharp' | 'soft' | 'round'
    headerStyle: 'transparent', // 'solid' | 'transparent' — floats over the homepage hero, solidifies on scroll
    backgroundImage: '',      // optional global page-background image
  },

  navOverrides: {
    // navId: { hidden: false, label: '' }
  },

  pages: emptyPages,

  admin: {
    // SHA-256 hash, never a plaintext password — see utils/crypto.js and
    // Admin → Settings for why this still isn't real security on a static
    // site. This fallback hash matches "ChangeMe-VNA2026"; change it from
    // Admin → Settings the moment the site is live.
    passwordHash: 'e636017fd049d40ae357baa8883a600c058a55e7a1e1eee7457e52c773efbd3c',
  },
}

export default defaultSiteConfig
