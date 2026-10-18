import { useEffect, useState } from 'react'
import Icon from '../ui/Icon.jsx'
import Button from '../ui/Button.jsx'
import ImageWithFallback from '../ui/ImageWithFallback.jsx'
import Markdown from '../ui/Markdown.jsx'
import { useInView } from '../../utils/useInView.js'
import './SectionRenderer.css'

function SectionHeading({ text, align = 'left' }) {
  if (!text) return null
  return <h2 className={`sr-heading align-${align}`}>{text}</h2>
}

// ---- Hero -----------------------------------------------------------
function Hero({ data }) {
  const { eyebrow, heading, subheading, backgroundImage, overlay, align = 'left', height = 'large', buttons = [] } = data
  return (
    <section className={`sr-hero sr-hero--${height} align-${align}`}>
      {backgroundImage && <div className="sr-hero__media" style={{ backgroundImage: `url(${backgroundImage})` }} />}
      {(overlay || !backgroundImage) && <div className={`sr-hero__overlay sr-hero__overlay--${align}`} />}
      <div className="sr-hero__fade" />
      <div className="container sr-hero__inner">
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        {heading && <h1 className="sr-hero__heading">{heading}</h1>}
        {subheading && <p className="sr-hero__subheading"><Markdown inline>{subheading}</Markdown></p>}
        {buttons.length > 0 && (
          <div className={`row wrap gap-3 sr-hero__buttons align-${align}`}>
            {buttons.map((b, i) => <Button key={i} link={b.link} style={b.style}>{b.label}</Button>)}
          </div>
        )}
      </div>
    </section>
  )
}

// ---- Rich Text --------------------------------------------------------
function RichText({ data }) {
  const { heading, body, align = 'left', width = 'normal' } = data
  return (
    <section className="section container">
      <div className={`sr-richtext sr-richtext--${width} align-${align}`}>
        <SectionHeading text={heading} align={align} />
        <Markdown>{body}</Markdown>
      </div>
    </section>
  )
}

// ---- Image + Text -----------------------------------------------------
function ImageText({ data }) {
  const { heading, body, image, imagePosition = 'left', buttons = [] } = data
  return (
    <section className="section container">
      <div className={`sr-imagetext sr-imagetext--${imagePosition}`}>
        <div className="sr-imagetext__media"><ImageWithFallback src={image} ratio="4/3" /></div>
        <div className="sr-imagetext__text">
          <SectionHeading text={heading} />
          <Markdown>{body}</Markdown>
          {buttons.length > 0 && (
            <div className="row wrap gap-3" style={{ marginTop: 'var(--space-4)' }}>
              {buttons.map((b, i) => <Button key={i} link={b.link} style={b.style}>{b.label}</Button>)}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

// ---- Gallery ------------------------------------------------------------
function Gallery({ data }) {
  const { heading, images = [] } = data
  if (images.length === 0 && !heading) return null
  return (
    <section className="section container">
      <SectionHeading text={heading} />
      {images.length > 0 && (
        <div className="grid grid-3 sr-gallery">
          {images.map((img, i) => (
            <figure key={i} className="sr-gallery__item">
              <ImageWithFallback src={img.image} alt={img.caption} ratio="4/3" />
              {img.caption && <figcaption>{img.caption}</figcaption>}
            </figure>
          ))}
        </div>
      )}
    </section>
  )
}

// ---- Feature Cards ------------------------------------------------------
// Featured items span two grid tracks and get a filled icon chip, so a
// flagship item (the mainline aircraft, the top rank, the lead role) reads
// as more important instead of every card competing at equal weight.
function FeatureCards({ data }) {
  const { heading, layout = 'grid', columns = '3', items = [] } = data
  return (
    <section className="section container">
      <SectionHeading text={heading} />
      <div className={layout === 'grid' ? `grid grid-${columns} sr-feature-grid` : 'stack gap-4'}>
        {items.map((item, i) => (
          <div
            key={i}
            className={`card card--hoverable sr-feature-card sr-feature-card--${layout}${item.featured ? ' sr-feature-card--featured' : ''}`}
          >
            {item.image ? (
              <div className="sr-feature-card__image"><ImageWithFallback src={item.image} ratio="16/9" /></div>
            ) : item.icon ? (
              <div className="sr-feature-card__icon"><Icon name={item.icon} size={item.featured ? 26 : 22} /></div>
            ) : null}
            <div className="sr-feature-card__body">
              {item.title && <h3>{item.title}</h3>}
              {item.text && <Markdown>{item.text}</Markdown>}
              {item.link && <Button link={item.link} style="ghost" iconRight="arrow-right" size="sm">Learn more</Button>}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ---- Button Row ----------------------------------------------------------
function ButtonRowBlock({ data }) {
  const { align = 'center', buttons = [] } = data
  if (buttons.length === 0) return null
  return (
    <section className="section container">
      <div className={`row wrap gap-3 align-${align}`} style={{ justifyContent: align === 'center' ? 'center' : align === 'right' ? 'flex-end' : 'flex-start' }}>
        {buttons.map((b, i) => <Button key={i} link={b.link} style={b.style}>{b.label}</Button>)}
      </div>
    </section>
  )
}

// ---- CTA Banner ------------------------------------------------------------
function CtaBanner({ data }) {
  const { heading, body, tone = 'brand', button } = data
  return (
    <section className={`sr-cta sr-cta--${tone}`}>
      <div className="container sr-cta__inner">
        <div>
          {heading && <h2>{heading}</h2>}
          {body && <Markdown>{body}</Markdown>}
        </div>
        {button?.label && <Button link={button.link} style={button.style || 'primary'}>{button.label}</Button>}
      </div>
    </section>
  )
}

// ---- Stats Row --------------------------------------------------------------
function AnimatedValue({ value }) {
  const [ref, inView] = useInView({ threshold: 0.4 })
  const match = typeof value === 'string' ? value.match(/^(\D*)([\d,.]+)(\D*)$/) : null
  const [display, setDisplay] = useState(match ? `${match[1]}0${match[3]}` : value)

  useEffect(() => {
    if (!inView || !match) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplay(value)
      return
    }
    const [, prefix, numStr, suffix] = match
    const target = parseFloat(numStr.replace(/,/g, ''))
    const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0
    if (Number.isNaN(target)) { setDisplay(value); return }

    const duration = 1100
    const start = performance.now()
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)
    let raf
    function tick(now) {
      const progress = Math.min(1, (now - start) / duration)
      const current = target * easeOutCubic(progress)
      setDisplay(`${prefix}${current.toLocaleString(undefined, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}${suffix}`)
      if (progress < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  return <div ref={ref} className="sr-stats__value">{match ? display : value}</div>
}
function StatsRow({ data }) {
  const { items = [] } = data
  if (items.length === 0) return null
  return (
    <section className="section container">
      <div className="grid sr-stats" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map((s, i) => (
          <div key={i} className="sr-stats__item">
            <AnimatedValue value={s.value} />
            <div className="sr-stats__label">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}

// ---- Accordion ----------------------------------------------------------------
function AccordionItem({ item }) {
  const [open, setOpen] = useState(false)
  return (
    <div className={`sr-accordion__item${open ? ' is-open' : ''}`}>
      <button className="sr-accordion__trigger" onClick={() => setOpen((v) => !v)} aria-expanded={open}>
        <span>{item.question}</span>
        <Icon name="plus" size={18} className="sr-accordion__icon" />
      </button>
      <div className="sr-accordion__panel-wrap">
        <div className="sr-accordion__panel-inner">
          <div className="sr-accordion__panel"><Markdown>{item.answer}</Markdown></div>
        </div>
      </div>
    </div>
  )
}
function AccordionBlock({ data }) {
  const { heading, items = [] } = data
  return (
    <section className="section container">
      <SectionHeading text={heading} />
      <div className="sr-accordion">
        {items.map((item, i) => <AccordionItem key={i} item={item} />)}
      </div>
    </section>
  )
}

// ---- Table -----------------------------------------------------------------
function TableBlock({ data }) {
  const { heading, columns = [], rows = [] } = data
  return (
    <section className="section container">
      <SectionHeading text={heading} />
      <div className="sr-table-wrap">
        <table className="sr-table">
          {columns.length > 0 && (
            <thead><tr>{columns.map((c, i) => <th key={i}>{c.label}</th>)}</tr></thead>
          )}
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>{(row.cells || []).map((cell, j) => <td key={j}>{cell.value}</td>)}</tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}

// ---- Video Embed -----------------------------------------------------------
function VideoEmbedBlock({ data }) {
  const { heading, url, caption } = data
  return (
    <section className="section container">
      <SectionHeading text={heading} />
      <div className="sr-video">
        {url ? (
          <iframe src={url} title={heading || 'Video'} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
        ) : (
          <div className="sr-video__placeholder"><Icon name="play-circle" size={30} /></div>
        )}
      </div>
      {caption && <p className="sr-video__caption">{caption}</p>}
    </section>
  )
}

// ---- Social Links -------------------------------------------------------------
const PLATFORM_ICON = {
  discord: 'message-circle', youtube: 'video', instagram: 'camera', tiktok: 'music',
  twitter: 'at-sign', facebook: 'share-2', roblox: 'game-controller', twitch: 'radio', website: 'globe',
}
const PLATFORM_LABEL = {
  discord: 'Discord', youtube: 'YouTube', instagram: 'Instagram', tiktok: 'TikTok',
  twitter: 'X / Twitter', facebook: 'Facebook', roblox: 'Roblox', twitch: 'Twitch', website: 'Website',
}
function SocialLinksBlock({ data }) {
  const { heading, items = [] } = data
  if (items.length === 0) return null
  return (
    <section className="section container">
      <SectionHeading text={heading} />
      <div className="row wrap gap-3">
        {items.map((item, i) => (
          <a key={i} href={item.url || '#'} target="_blank" rel="noopener noreferrer" className="sr-social-link">
            <Icon name={PLATFORM_ICON[item.platform] || 'globe'} size={18} />
            <span>{item.label || PLATFORM_LABEL[item.platform] || 'Link'}</span>
          </a>
        ))}
      </div>
    </section>
  )
}

// ---- Divider --------------------------------------------------------------------
function DividerBlock({ data }) {
  const { style = 'line', size = 'medium' } = data
  return <div className={`sr-divider sr-divider--${size}${style === 'line' ? ' sr-divider--line' : ''}`} />
}

const RENDERERS = {
  hero: Hero,
  richText: RichText,
  imageText: ImageText,
  gallery: Gallery,
  featureCards: FeatureCards,
  buttonRow: ButtonRowBlock,
  ctaBanner: CtaBanner,
  statsRow: StatsRow,
  accordion: AccordionBlock,
  table: TableBlock,
  videoEmbed: VideoEmbedBlock,
  socialLinks: SocialLinksBlock,
  divider: DividerBlock,
}

export default function SectionRenderer({ section }) {
  const [ref, inView] = useInView()
  const Cmp = RENDERERS[section.type]
  if (!Cmp) return null

  // Hero always sits at the top of the page and is visible on first paint,
  // so it gets its own on-load stagger (see .sr-hero children in the CSS)
  // instead of a scroll-triggered reveal.
  if (section.type === 'hero') return <Cmp data={section.data} />

  return (
    <div ref={ref} className={`sr-reveal${inView ? ' is-in' : ''}`}>
      <Cmp data={section.data} />
    </div>
  )
}
