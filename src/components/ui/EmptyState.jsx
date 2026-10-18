import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import './EmptyState.css'

export default function EmptyState({ icon = 'file-text', title, message, adminHint, adminLink }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon"><Icon name={icon} size={30} strokeWidth={1.6} /></div>
      <h3 className="empty-state__title">{title}</h3>
      {message && <p className="empty-state__message">{message}</p>}
      {adminHint && (
        <Link to={adminLink || '/admin'} className="empty-state__admin-link">
          <Icon name="layout-dashboard" size={16} /> {adminHint}
        </Link>
      )}
    </div>
  )
}
