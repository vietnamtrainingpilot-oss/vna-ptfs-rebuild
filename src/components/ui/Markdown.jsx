import MarkdownToJsx from 'markdown-to-jsx/react'
import './Markdown.css'

// Renders admin-authored markdown as real React elements — bold, italic,
// links, lists, headings, blockquotes, inline code. Raw HTML in the source
// is intentionally left unparsed (disableParsingRawHTML) so pasted content
// can never inject arbitrary markup, and links/images go through the
// library's built-in URL sanitizer.
//
// `inline`: renders without a wrapping <p>, for short one-line fields like
// a hero subheading, where a paragraph's block margins would look wrong.
export default function Markdown({ children, inline = false, className = '' }) {
  if (!children) return null
  return (
    <MarkdownToJsx
      className={`md-content${inline ? ' md-content--inline' : ''}${className ? ` ${className}` : ''}`}
      options={{
        forceInline: inline,
        disableParsingRawHTML: true,
        overrides: {
          a: { props: { target: '_blank', rel: 'noopener noreferrer' } },
        },
      }}
    >
      {children}
    </MarkdownToJsx>
  )
}
