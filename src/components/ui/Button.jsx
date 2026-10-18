import { Link } from 'react-router-dom'
import Icon from './Icon.jsx'
import './Button.css'

// Renders a Link for internal paths ("/", "/about/fleet"), a plain <a> for
// external URLs, or a <button> when no link is given (e.g. admin actions).
export default function Button({ children, link, style = 'primary', size = 'md', icon, iconRight, onClick, type = 'button', className = '', disabled = false }) {
  const classes = `btn btn--${style} btn--${size} ${className}`.trim()
  const content = (
    <>
      {icon && <Icon name={icon} size={size === 'sm' ? 16 : 18} />}
      {children && <span>{children}</span>}
      {iconRight && <Icon name={iconRight} size={size === 'sm' ? 16 : 18} />}
    </>
  )

  if (link) {
    const isExternal = /^https?:\/\//.test(link) || link.startsWith('mailto:') || link.startsWith('tel:')
    if (isExternal) {
      return (
        <a href={link} className={classes} target="_blank" rel="noopener noreferrer">
          {content}
        </a>
      )
    }
    return (
      <Link to={link || '#'} className={classes}>
        {content}
      </Link>
    )
  }

  return (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  )
}
