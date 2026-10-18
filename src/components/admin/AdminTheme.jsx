import { useSiteConfig } from '../../context/SiteConfigContext.jsx'
import fontOptions from '../../data/fontOptions.js'
import { ImageField, ColorField } from './FieldForm.jsx'
import Icon from '../ui/Icon.jsx'

const COLOR_FIELDS = [
  { key: 'primary', label: 'Primary (VNA Blue)' },
  { key: 'primaryDark', label: 'Primary — dark shade (footer/dark sections)' },
  { key: 'secondary', label: 'Secondary / accent (Gold)' },
  { key: 'creme', label: 'Creme (supplementary)' },
  { key: 'background', label: 'Page background' },
  { key: 'surface', label: 'Surface (cards, subtle panels)' },
  { key: 'text', label: 'Text' },
  { key: 'textMuted', label: 'Muted text' },
  { key: 'border', label: 'Borders' },
]

const RADIUS_OPTIONS = [
  { value: 'sharp', label: 'Sharp' },
  { value: 'soft', label: 'Soft (default)' },
  { value: 'round', label: 'Rounded' },
]

export default function AdminTheme() {
  const { config, updateTheme, updateThemeColors } = useSiteConfig()
  const { theme } = config

  return (
    <div>
      <div className="admin-screen__header">
        <h1>Theme &amp; Design</h1>
        <p>Colors and typography default to the official Vietnam Airlines brand guideline — change anything below.</p>
      </div>

      <div className="admin-card">
        <h2>Typography</h2>
        <p className="admin-card__desc">Pick a heading + body font pairing. All options include full Vietnamese diacritic support.</p>
        <div className="admin-grid-2">
          {fontOptions.map((preset) => (
            <button
              key={preset.id}
              onClick={() => updateTheme({ fontPresetId: preset.id })}
              className="admin-card"
              style={{
                textAlign: 'left', cursor: 'pointer', marginBottom: 0,
                borderColor: theme.fontPresetId === preset.id ? 'var(--a-accent)' : 'var(--a-border)',
                boxShadow: theme.fontPresetId === preset.id ? '0 0 0 2px var(--a-accent)' : 'none',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '1.2rem', fontFamily: preset.heading.fallback }}>{preset.label}</strong>
                {theme.fontPresetId === preset.id && <Icon name="check-circle" size={18} />}
              </div>
              <p style={{ fontFamily: preset.body.fallback, fontSize: '0.85rem', color: 'var(--a-text-muted)', marginTop: '0.4rem' }}>{preset.note}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h2>Brand colors</h2>
        <p className="admin-card__desc">Defaults are sourced from the official brand guideline (PMS 308C, PMS 7407C, PMS 9064C).</p>
        <div className="admin-grid-2">
          {COLOR_FIELDS.map((f) => (
            <div className="admin-field" key={f.key}>
              <label>{f.label}</label>
              <ColorField value={theme.colors[f.key]} onChange={(v) => updateThemeColors({ [f.key]: v })} />
            </div>
          ))}
        </div>
      </div>

      <div className="admin-card">
        <h2>Shape & header style</h2>
        <div className="admin-grid-2">
          <div className="admin-field">
            <label>Corner radius</label>
            <select value={theme.radius} onChange={(e) => updateTheme({ radius: e.target.value })}>
              {RADIUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <div className="admin-field">
            <label>Header style</label>
            <select value={theme.headerStyle} onChange={(e) => updateTheme({ headerStyle: e.target.value })}>
              <option value="solid">Always solid</option>
              <option value="transparent">Transparent over hero banners</option>
            </select>
            <p className="admin-field__hint">"Transparent" only applies on pages that start with a Hero Banner section.</p>
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Global background image</h2>
        <p className="admin-card__desc">Optional — applies behind every page unless a page sets its own background in the Pages editor.</p>
        <ImageField value={theme.backgroundImage} onChange={(v) => updateTheme({ backgroundImage: v })} />
      </div>
    </div>
  )
}
