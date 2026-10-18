import { useState } from 'react'
import { useSiteConfig } from '../../context/SiteConfigContext.jsx'
import navigationData from '../../data/navigation.js'
import { ImageField, ColorField } from './FieldForm.jsx'
import SectionEditor from './SectionEditor.jsx'
import Icon from '../ui/Icon.jsx'

export default function AdminPages() {
  const { config, getPage, updatePageMeta } = useSiteConfig()
  const [selected, setSelected] = useState({ id: 'home', label: 'Home' })

  const page = getPage(selected.id)

  return (
    <div>
      <div className="admin-screen__header">
        <h1>Pages</h1>
        <p>Select a page, then add and arrange content blocks. Every page starts empty — nothing is published until you add sections here.</p>
      </div>

      <div className="admin-card">
        <h2>Choose a page</h2>
        <div className="page-tree">
          {navigationData.map((item) => {
            const count = getPage(item.id)?.sections?.length || 0
            return (
              <div key={item.id}>
                <div className="page-tree__parent">
                  <button className={`page-tree__btn${selected.id === item.id ? ' is-active' : ''}`} onClick={() => setSelected({ id: item.id, label: item.label })}>
                    <Icon name={item.children ? 'file-stack' : 'file-text'} size={15} />
                    {config.navOverrides[item.id]?.label || item.label}
                    <span className="page-tree__count">{count}</span>
                  </button>
                </div>
                {item.children && (
                  <div className="page-tree__children">
                    {item.children.map((child) => {
                      const childCount = getPage(child.id)?.sections?.length || 0
                      return (
                        <button
                          key={child.id}
                          className={`page-tree__child-btn${selected.id === child.id ? ' is-active' : ''}`}
                          onClick={() => setSelected({ id: child.id, label: child.label })}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                        >
                          <span>{config.navOverrides[child.id]?.label || child.label}</span>
                          <span className="page-tree__count">{childCount}</span>
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="admin-card">
        <h2>Page settings — {config.navOverrides[selected.id]?.label || selected.label}</h2>
        <p className="admin-card__desc">Optional overrides for this specific page.</p>
        <div className="admin-field">
          <label>Page title override</label>
          <input
            type="text"
            placeholder={selected.label}
            value={page.titleOverride}
            onChange={(e) => updatePageMeta(selected.id, { titleOverride: e.target.value })}
          />
        </div>
        <div className="admin-field">
          <label>Meta description (for search engines / link previews)</label>
          <textarea
            rows={2}
            value={page.metaDescription}
            onChange={(e) => updatePageMeta(selected.id, { metaDescription: e.target.value })}
          />
        </div>
        <div className="admin-grid-2">
          <div className="admin-field">
            <label>Background color override</label>
            <ColorField value={page.backgroundColor} onChange={(v) => updatePageMeta(selected.id, { backgroundColor: v })} />
          </div>
          <div className="admin-field">
            <label>Background image override</label>
            <ImageField value={page.backgroundImage} onChange={(v) => updatePageMeta(selected.id, { backgroundImage: v })} />
          </div>
        </div>
      </div>

      <div className="admin-card">
        <h2>Content blocks</h2>
        <p className="admin-card__desc">Drag isn't supported yet — use the up/down arrows on each block to reorder.</p>
        <SectionEditor pageId={selected.id} />
      </div>
    </div>
  )
}
