import { useState } from 'react'
import { useSiteConfig } from '../../context/SiteConfigContext.jsx'
import { ImageField } from './FieldForm.jsx'

export default function AdminIdentity() {
  const { config, updateIdentity } = useSiteConfig()
  const { siteName, tagline, logo, favicon } = config.identity
  const [name, setName] = useState(siteName)

  return (
    <div>
      <div className="admin-screen__header">
        <h1>Site Identity</h1>
        <p>Your site's name, logo and favicon — used in the header, footer and browser tab.</p>
      </div>

      <div className="admin-card">
        <h2>Basics</h2>
        <p className="admin-card__desc">The site name appears in the header, footer and browser tab title.</p>
        <div className="admin-field">
          <label>Site name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} onBlur={() => updateIdentity({ siteName: name })} />
        </div>
        <div className="admin-field">
          <label>Tagline (optional)</label>
          <input
            type="text"
            placeholder="Shown under the logo in the footer"
            value={tagline}
            onChange={(e) => updateIdentity({ tagline: e.target.value })}
          />
        </div>
      </div>

      <div className="admin-card">
        <h2>Logo</h2>
        <p className="admin-card__desc">Shown in the header and footer. Without one, a placeholder mark is used.</p>
        <ImageField value={logo.image} onChange={(v) => updateIdentity({ logo: { ...logo, image: v } })} />
        <div className="admin-field" style={{ marginTop: '0.9rem' }}>
          <label>Logo alt text</label>
          <input type="text" value={logo.alt} onChange={(e) => updateIdentity({ logo: { ...logo, alt: e.target.value } })} />
        </div>
      </div>

      <div className="admin-card">
        <h2>Favicon</h2>
        <p className="admin-card__desc">The small icon shown in browser tabs. Square images work best (e.g. 512×512px). Note: browser tabs won't refresh the favicon until the site is redeployed.</p>
        <ImageField value={favicon.image} onChange={(v) => updateIdentity({ favicon: { ...favicon, image: v } })} />
      </div>
    </div>
  )
}
