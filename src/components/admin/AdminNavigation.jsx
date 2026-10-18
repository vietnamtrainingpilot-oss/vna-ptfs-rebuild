import { useSiteConfig } from '../../context/SiteConfigContext.jsx'
import navigationData from '../../data/navigation.js'
import Icon from '../ui/Icon.jsx'

function VisibilityToggle({ hidden, onChange }) {
  return (
    <label className="field-switch" title={hidden ? 'Hidden from menu' : 'Visible in menu'}>
      <input type="checkbox" checked={!hidden} onChange={(e) => onChange(!e.target.checked)} />
      <span className="field-switch__track"><span className="field-switch__thumb" /></span>
    </label>
  )
}

export default function AdminNavigation() {
  const { config, setNavOverride } = useSiteConfig()

  return (
    <div>
      <div className="admin-screen__header">
        <h1>Navigation</h1>
        <p>Rename any menu item, or temporarily hide sections you're not ready to publish yet. The page itself still exists — it just won't appear in the menu.</p>
      </div>

      <div className="admin-card">
        {navigationData.map((item) => {
          const override = config.navOverrides[item.id] || {}
          return (
            <div key={item.id}>
              <div className="nav-row">
                <Icon name={item.children ? 'file-stack' : 'file-text'} size={16} style={{ color: 'var(--a-text-muted)', flexShrink: 0 }} />
                <input
                  type="text"
                  value={override.label ?? item.label}
                  onChange={(e) => setNavOverride(item.id, { label: e.target.value })}
                />
                <VisibilityToggle hidden={override.hidden} onChange={(hidden) => setNavOverride(item.id, { hidden })} />
              </div>
              {item.children?.map((child) => {
                const childOverride = config.navOverrides[child.id] || {}
                return (
                  <div key={child.id} className="nav-row nav-row--child">
                    <Icon name="chevron-right" size={13} style={{ color: 'var(--a-text-muted)', flexShrink: 0 }} />
                    <input
                      type="text"
                      value={childOverride.label ?? child.label}
                      onChange={(e) => setNavOverride(child.id, { label: e.target.value })}
                    />
                    <VisibilityToggle hidden={childOverride.hidden} onChange={(hidden) => setNavOverride(child.id, { hidden })} />
                  </div>
                )
              })}
            </div>
          )
        })}
      </div>
    </div>
  )
}
