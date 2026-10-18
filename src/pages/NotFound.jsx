import Button from '../components/ui/Button.jsx'

export default function NotFound() {
  return (
    <div className="container section" style={{ textAlign: 'center' }}>
      <span className="eyebrow">404</span>
      <h1>Page not found</h1>
      <p style={{ color: 'var(--color-text-muted)', marginTop: 'var(--space-3)' }}>
        The page you're looking for doesn't exist or may have moved.
      </p>
      <div style={{ marginTop: 'var(--space-6)' }}>
        <Button link="/">Back to Home</Button>
      </div>
    </div>
  )
}
