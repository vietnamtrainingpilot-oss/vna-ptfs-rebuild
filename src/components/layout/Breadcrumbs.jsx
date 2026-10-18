import { Link } from 'react-router-dom'
import Icon from '../ui/Icon.jsx'
import './Breadcrumbs.css'

export default function Breadcrumbs({ trail }) {
  if (!trail || trail.length < 2) return null
  return (
    <nav className="breadcrumbs container" aria-label="Breadcrumb">
      <ol>
        {trail.map((crumb, i) => (
          <li key={crumb.path}>
            {i > 0 && <Icon name="chevron-right" size={13} />}
            {i === trail.length - 1 ? (
              <span aria-current="page">{crumb.label}</span>
            ) : (
              <Link to={crumb.path}>{crumb.label}</Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
