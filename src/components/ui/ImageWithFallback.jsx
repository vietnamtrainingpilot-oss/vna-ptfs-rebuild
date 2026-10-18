import { useState } from 'react'
import Icon from './Icon.jsx'
import './ImageWithFallback.css'

export default function ImageWithFallback({ src, alt = '', className = '', ratio, style }) {
  const [errored, setErrored] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const showPlaceholder = !src || errored

  return (
    <div className={`img-fallback ${className}`} style={{ aspectRatio: ratio || undefined, ...style }}>
      {showPlaceholder ? (
        <div className="img-fallback__placeholder">
          <Icon name="image-off" size={22} strokeWidth={1.6} />
        </div>
      ) : (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={loaded ? 'is-loaded' : ''}
          loading="lazy"
        />
      )}
    </div>
  )
}
