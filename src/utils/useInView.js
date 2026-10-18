import { useEffect, useRef, useState } from 'react'

// Reveals an element once it scrolls into view. Fires only once (doesn't
// re-hide on scroll-away — re-triggering on every scroll gets old fast on
// a site people revisit often). Respects prefers-reduced-motion by
// reporting "already in view" immediately, so reduced-motion users never
// see a delayed appearance.
export function useInView({ threshold = 0.15, rootMargin = '0px 0px -10% 0px' } = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold, rootMargin },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return [ref, inView]
}
