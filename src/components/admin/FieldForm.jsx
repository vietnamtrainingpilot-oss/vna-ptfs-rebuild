import { useRef, useState } from 'react'
import Icon from '../ui/Icon.jsx'
import iconOptions from '../../data/iconOptions.js'
import './admin.css'

export function defaultValueFor(field) {
  switch (field.type) {
    case 'boolean': return field.default ?? false
    case 'select': return field.default ?? (field.options?.[0]?.value ?? '')
    case 'list': return []
    case 'group': return defaultsForFields(field.fields)
    default: return field.default ?? ''
  }
}
export function defaultsForFields(fields) {
  return Object.fromEntries(fields.map((f) => [f.key, defaultValueFor(f)]))
}

export function ImageField({ value, onChange }) {
  const [warn, setWarn] = useState('')

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    if (file.size > 1.2 * 1024 * 1024) {
      setWarn('That file is large — prefer an image URL where possible to keep the site fast.')
    } else {
      setWarn('')
    }
    const reader = new FileReader()
    reader.onload = () => onChange(reader.result)
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="field-image">
      <div className="field-image__preview">
        {value ? <img src={value} alt="" /> : <Icon name="image-off" size={20} />}
      </div>
      <div className="field-image__controls">
        <input
          type="text"
          placeholder="Paste an image URL…"
          value={value?.startsWith('data:') ? '' : value || ''}
          onChange={(e) => onChange(e.target.value)}
        />
        <div className="row gap-2">
          <label className="admin-btn admin-btn--sm">
            <Icon name="upload" size={14} /> Upload
            <input type="file" accept="image/*" onChange={handleFile} hidden />
          </label>
          {value && (
            <button type="button" className="admin-btn admin-btn--sm admin-btn--ghost" onClick={() => onChange('')}>
              <Icon name="trash-2" size={14} /> Clear
            </button>
          )}
        </div>
        {warn && <p className="field-image__warn">{warn}</p>}
      </div>
    </div>
  )
}

function IconField({ value, onChange }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="field-icon">
      <button type="button" className="field-icon__trigger" onClick={() => setOpen((v) => !v)}>
        {value ? <Icon name={value} size={18} /> : <Icon name="image-off" size={18} />}
        <span>{value || 'Choose icon'}</span>
        <Icon name={open ? 'chevron-up' : 'chevron-down'} size={14} />
      </button>
      {open && (
        <div className="field-icon__panel">
          {iconOptions.map((key) => (
            <button
              type="button"
              key={key}
              className={`field-icon__opt${value === key ? ' is-selected' : ''}`}
              title={key}
              onClick={() => { onChange(key); setOpen(false) }}
            >
              <Icon name={key} size={17} />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function ColorField({ value, onChange }) {
  return (
    <div className="field-color">
      <input type="color" value={value || '#000000'} onChange={(e) => onChange(e.target.value)} />
      <input type="text" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder="#000000" />
    </div>
  )
}

// Plain-textarea + toolbar editor for markdown-capable fields. Manipulates
// the raw markdown text directly via the textarea's selection range, so
// "Bold" wraps whatever's selected in **, "Bullet list" prefixes every
// selected line with "- ", etc — standard markdown-editor behavior.
function MarkdownField({ value, onChange, rows = 5, placeholder, inline = false }) {
  const textareaRef = useRef(null)
  const text = value || ''

  function wrapSelection(marker) {
    const el = textareaRef.current
    if (!el) return
    const { selectionStart, selectionEnd } = el
    const selected = text.slice(selectionStart, selectionEnd) || 'text'
    const next = text.slice(0, selectionStart) + marker + selected + marker + text.slice(selectionEnd)
    onChange(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(selectionStart + marker.length, selectionStart + marker.length + selected.length)
    })
  }

  function prefixLines(makePrefix) {
    const el = textareaRef.current
    if (!el) return
    const { selectionStart, selectionEnd } = el
    const lineStart = text.lastIndexOf('\n', selectionStart - 1) + 1
    let lineEnd = text.indexOf('\n', selectionEnd)
    if (lineEnd === -1) lineEnd = text.length
    const lines = text.slice(lineStart, lineEnd).split('\n')
    const prefixed = lines.map((line, i) => `${typeof makePrefix === 'function' ? makePrefix(i) : makePrefix}${line}`).join('\n')
    const next = text.slice(0, lineStart) + prefixed + text.slice(lineEnd)
    onChange(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(lineStart, lineStart + prefixed.length)
    })
  }

  function insertLink() {
    const el = textareaRef.current
    if (!el) return
    const { selectionStart, selectionEnd } = el
    const selected = text.slice(selectionStart, selectionEnd) || 'link text'
    const next = text.slice(0, selectionStart) + `[${selected}](https://)` + text.slice(selectionEnd)
    onChange(next)
    requestAnimationFrame(() => {
      el.focus()
      const urlStart = selectionStart + selected.length + 3
      el.setSelectionRange(urlStart, urlStart + 8)
    })
  }

  return (
    <div className="md-field">
      <div className="md-field__toolbar">
        <button type="button" title="Bold" onClick={() => wrapSelection('**')}><Icon name="bold" size={15} /></button>
        <button type="button" title="Italic" onClick={() => wrapSelection('*')}><Icon name="italic" size={15} /></button>
        <button type="button" title="Link" onClick={insertLink}><Icon name="link-2" size={15} /></button>
        {!inline && (
          <>
            <span className="md-field__divider" />
            <button type="button" title="Bullet list" onClick={() => prefixLines('- ')}><Icon name="list" size={15} /></button>
            <button type="button" title="Numbered list" onClick={() => prefixLines((i) => `${i + 1}. `)}><Icon name="list-ordered" size={15} /></button>
            <span className="md-field__divider" />
            <button type="button" title="Heading" onClick={() => prefixLines('### ')}><Icon name="heading-2" size={15} /></button>
            <button type="button" title="Quote" onClick={() => prefixLines('> ')}><Icon name="quote" size={15} /></button>
          </>
        )}
      </div>
      <textarea
        ref={textareaRef}
        rows={inline ? 2 : rows}
        value={text}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
      />
      <p className="md-field__hint">
        {inline ? 'Supports **bold**, *italic* and [links](url).' : 'Markdown supported — **bold**, *italic*, [links](url), lists, headings and quotes.'}
      </p>
    </div>
  )
}

function ListField({ field, value = [], onChange }) {
  const [expanded, setExpanded] = useState(() => new Set())
  const max = field.max

  function toggle(i) {
    setExpanded((prev) => {
      const next = new Set(prev)
      next.has(i) ? next.delete(i) : next.add(i)
      return next
    })
  }
  function addItem() {
    const item = defaultsForFields(field.fields)
    onChange([...value, item])
    setExpanded((prev) => new Set(prev).add(value.length))
  }
  function updateItem(i, newItem) {
    const next = [...value]
    next[i] = newItem
    onChange(next)
  }
  function removeItem(i) {
    onChange(value.filter((_, idx) => idx !== i))
  }
  function moveItem(i, dir) {
    const j = i + dir
    if (j < 0 || j >= value.length) return
    const next = [...value]
    ;[next[i], next[j]] = [next[j], next[i]]
    onChange(next)
  }

  const textFieldKey = field.fields.find((f) => f.type === 'text')?.key

  return (
    <div className="field-list">
      {value.map((item, i) => {
        const isOpen = expanded.has(i)
        const summary = (textFieldKey && item[textFieldKey]) || `${field.itemLabel || 'Item'} ${i + 1}`
        return (
          <div className="field-list__item" key={i}>
            <div className="field-list__item-head">
              <button type="button" className="field-list__item-title" onClick={() => toggle(i)}>
                <Icon name={isOpen ? 'chevron-up' : 'chevron-down'} size={14} />
                <span>{summary}</span>
              </button>
              <div className="row gap-1">
                <button type="button" className="icon-btn" title="Move up" onClick={() => moveItem(i, -1)} disabled={i === 0}><Icon name="chevron-up" size={15} /></button>
                <button type="button" className="icon-btn" title="Move down" onClick={() => moveItem(i, 1)} disabled={i === value.length - 1}><Icon name="chevron-down" size={15} /></button>
                <button type="button" className="icon-btn icon-btn--danger" title="Remove" onClick={() => removeItem(i)}><Icon name="trash-2" size={15} /></button>
              </div>
            </div>
            {isOpen && (
              <div className="field-list__item-body">
                <FieldForm fields={field.fields} values={item} onChange={(v) => updateItem(i, v)} />
              </div>
            )}
          </div>
        )
      })}
      {(!max || value.length < max) && (
        <button type="button" className="admin-btn admin-btn--sm field-list__add" onClick={addItem}>
          <Icon name="plus" size={14} /> Add {field.itemLabel || 'Item'}
        </button>
      )}
    </div>
  )
}

function FieldRow({ field, value, onChange }) {
  switch (field.type) {
    case 'text':
      return <input type="text" value={value || ''} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />
    case 'url':
      return <input type="text" value={value || ''} placeholder={field.placeholder || 'https://…'} onChange={(e) => onChange(e.target.value)} />
    case 'textarea':
      return <textarea rows={field.rows || 4} value={value || ''} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />
    case 'markdown':
      return <MarkdownField value={value} onChange={onChange} rows={field.rows} placeholder={field.placeholder} inline={field.inline} />
    case 'number':
      return <input type="number" value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
    case 'boolean':
      return (
        <label className="field-switch">
          <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
          <span className="field-switch__track"><span className="field-switch__thumb" /></span>
        </label>
      )
    case 'select':
      return (
        <select value={value ?? field.default ?? ''} onChange={(e) => onChange(e.target.value)}>
          {field.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
        </select>
      )
    case 'color':
      return <ColorField value={value} onChange={onChange} />
    case 'image':
      return <ImageField value={value} onChange={onChange} />
    case 'icon':
      return <IconField value={value} onChange={onChange} />
    case 'list':
      return <ListField field={field} value={value || []} onChange={onChange} />
    case 'group':
      return <div className="field-group"><FieldForm fields={field.fields} values={value || {}} onChange={onChange} /></div>
    default:
      return null
  }
}

// Renders a form for an arbitrary field schema (see sectionTypes.js) against
// a plain `values` object, calling onChange(nextValues) on any edit.
// Used recursively for nested lists/groups (e.g. table rows -> cells).
export default function FieldForm({ fields, values, onChange }) {
  function set(key, val) {
    onChange({ ...values, [key]: val })
  }
  return (
    <div className="field-form">
      {fields.map((field) => (
        <div className={`field field--${field.type}`} key={field.key}>
          <label className="field__label">{field.label}</label>
          <FieldRow field={field} value={values[field.key]} onChange={(v) => set(field.key, v)} />
        </div>
      ))}
    </div>
  )
}
