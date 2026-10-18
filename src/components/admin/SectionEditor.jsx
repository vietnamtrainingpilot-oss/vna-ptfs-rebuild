import { useState } from 'react'
import { useSiteConfig } from '../../context/SiteConfigContext.jsx'
import sectionTypes from '../../data/sectionTypes.js'
import FieldForm from './FieldForm.jsx'
import Icon from '../ui/Icon.jsx'

export default function SectionEditor({ pageId }) {
  const { getPage, addSection, updateSectionData, removeSection, duplicateSection, moveSection } = useSiteConfig()
  const [expanded, setExpanded] = useState(new Set())
  const [menuOpen, setMenuOpen] = useState(false)
  const page = getPage(pageId)

  function toggle(id) {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  function handleAdd(type) {
    const id = addSection(pageId, type)
    setMenuOpen(false)
    if (id) setExpanded((prev) => new Set(prev).add(id))
  }

  return (
    <div>
      {page.sections.length === 0 && (
        <p className="empty-hint">No sections yet — add the first one below to start building this page.</p>
      )}

      {page.sections.map((section, i) => {
        const def = sectionTypes[section.type]
        if (!def) return null
        const isOpen = expanded.has(section.id)
        return (
          <div className="section-card" key={section.id}>
            <div className="section-card__head">
              <span className="section-card__icon"><Icon name={def.icon} size={16} /></span>
              <button className="section-card__title" onClick={() => toggle(section.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', padding: 0 }}>
                <strong>{def.label}</strong>
                <span>{def.description}</span>
              </button>
              <div className="section-card__actions">
                <button className="icon-btn" title="Move up" onClick={() => moveSection(pageId, section.id, -1)} disabled={i === 0}><Icon name="chevron-up" size={15} /></button>
                <button className="icon-btn" title="Move down" onClick={() => moveSection(pageId, section.id, 1)} disabled={i === page.sections.length - 1}><Icon name="chevron-down" size={15} /></button>
                <button className="icon-btn" title="Duplicate" onClick={() => duplicateSection(pageId, section.id)}><Icon name="copy" size={15} /></button>
                <button className="icon-btn icon-btn--danger" title="Delete" onClick={() => removeSection(pageId, section.id)}><Icon name="trash-2" size={15} /></button>
                <button className="icon-btn" title={isOpen ? 'Collapse' : 'Edit'} onClick={() => toggle(section.id)}><Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={15} /></button>
              </div>
            </div>
            {isOpen && (
              <div className="section-card__body">
                <FieldForm fields={def.fields} values={section.data} onChange={(v) => updateSectionData(pageId, section.id, v)} />
              </div>
            )}
          </div>
        )
      })}

      {menuOpen && (
        <div className="add-section-menu">
          {Object.entries(sectionTypes).map(([type, def]) => (
            <button key={type} onClick={() => handleAdd(type)}>
              <Icon name={def.icon} size={18} />
              <span><strong>{def.label}</strong><span>{def.description}</span></span>
            </button>
          ))}
        </div>
      )}
      <button className="add-section-btn" onClick={() => setMenuOpen((v) => !v)}>
        <Icon name={menuOpen ? 'x' : 'plus'} size={16} /> {menuOpen ? 'Close' : 'Add Section'}
      </button>
    </div>
  )
}
