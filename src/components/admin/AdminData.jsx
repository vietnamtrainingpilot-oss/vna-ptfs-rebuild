import { useRef, useState } from 'react'
import { useSiteConfig } from '../../context/SiteConfigContext.jsx'
import { configSizeKB } from '../../utils/storage.js'
import Icon from '../ui/Icon.jsx'

export default function AdminData() {
  const { config, exportConfig, importConfig, resetConfig } = useSiteConfig()
  const fileRef = useRef(null)
  const [message, setMessage] = useState(null)
  const [confirmingReset, setConfirmingReset] = useState(false)

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = importConfig(reader.result)
      setMessage(result.ok ? { type: 'success', text: 'Config imported — your local preview now reflects it.' } : { type: 'error', text: `Import failed: ${result.error}` })
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handleReset() {
    resetConfig()
    setConfirmingReset(false)
    setMessage({ type: 'success', text: 'Reset to defaults.' })
  }

  return (
    <div>
      <div className="admin-screen__header">
        <h1>Import / Export</h1>
        <p>This site has no backend — everything you build here lives in this browser until you publish it.</p>
      </div>

      <div className="admin-card">
        <h2>1. Export your config</h2>
        <p className="admin-card__desc">Downloads everything — theme, navigation and every page's content — as one JSON file ({configSizeKB(config)} KB).</p>
        <button className="admin-btn" onClick={exportConfig}><Icon name="download" size={16} /> Export config.json</button>
      </div>

      <div className="admin-card">
        <h2>2. Publish it for everyone</h2>
        <p className="admin-card__desc">
          Take the exported file and use it to replace <code>public/content.json</code> in your project
          (keep the same filename), then redeploy on Netlify. New visitors — and any browser without local
          edits — will load that as the published site. Your own browser keeps previewing its local draft
          until you clear it.
        </p>
      </div>

      <div className="admin-card">
        <h2>Import a config file</h2>
        <p className="admin-card__desc">Load a previously exported (or edited) config into this browser's live preview — useful for restoring a backup or continuing edits on another device.</p>
        {message && (
          <p style={{ fontSize: '0.85rem', marginBottom: '0.75rem', color: message.type === 'error' ? 'var(--a-danger)' : 'var(--a-success)' }}>
            {message.text}
          </p>
        )}
        <button className="admin-btn admin-btn--ghost" onClick={() => fileRef.current?.click()}>
          <Icon name="upload" size={16} /> Choose file…
        </button>
        <input ref={fileRef} type="file" accept="application/json" hidden onChange={handleFile} />
      </div>

      <div className="admin-card">
        <h2>Reset to defaults</h2>
        <p className="admin-card__desc">Clears your local draft and returns to the default brand theme with empty pages. This cannot be undone — export a backup first if you're not sure.</p>
        {confirmingReset ? (
          <div className="row gap-2">
            <button className="admin-btn admin-btn--danger" onClick={handleReset}>Yes, reset everything</button>
            <button className="admin-btn admin-btn--ghost" onClick={() => setConfirmingReset(false)}>Cancel</button>
          </div>
        ) : (
          <button className="admin-btn admin-btn--danger" onClick={() => setConfirmingReset(true)}>
            <Icon name="rotate-ccw" size={16} /> Reset to defaults
          </button>
        )}
      </div>
    </div>
  )
}
