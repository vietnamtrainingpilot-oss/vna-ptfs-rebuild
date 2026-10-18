// Curated font pairings selectable from Admin → Theme & Design.
// `googleFamily` values map directly to Google Fonts API family names.
// Keep this list short and vetted rather than exposing "any font" —
// every option here has been checked for a solid Vietnamese character set.

const fontOptions = [
  {
    id: 'titillium-open-sans',
    label: 'Titillium Web + Open Sans',
    note: 'The official VNA brand pairing — Titillium for headings, Open Sans for body (Open Sans is the typeface VNA\'s own website uses).',
    heading: { family: 'Titillium Web', googleFamily: 'Titillium+Web:wght@400;600;700', fallback: "'Titillium Web', 'Segoe UI', sans-serif" },
    body: { family: 'Open Sans', googleFamily: 'Open+Sans:wght@400;500;600;700', fallback: "'Open Sans', 'Segoe UI', sans-serif" },
  },
  {
    id: 'be-vietnam-pro',
    label: 'Be Vietnam Pro',
    note: 'One typeface for everything, full native Vietnamese diacritic support. Good if headings will often be in Vietnamese.',
    heading: { family: 'Be Vietnam Pro', googleFamily: 'Be+Vietnam+Pro:wght@600;700;800', fallback: "'Be Vietnam Pro', 'Segoe UI', sans-serif" },
    body: { family: 'Be Vietnam Pro', googleFamily: 'Be+Vietnam+Pro:wght@400;500;600', fallback: "'Be Vietnam Pro', 'Segoe UI', sans-serif" },
  },
  {
    id: 'montserrat-inter',
    label: 'Montserrat + Inter',
    note: 'Bolder, more geometric heading style with a neutral, highly-legible body face.',
    heading: { family: 'Montserrat', googleFamily: 'Montserrat:wght@600;700;800', fallback: "'Montserrat', 'Segoe UI', sans-serif" },
    body: { family: 'Inter', googleFamily: 'Inter:wght@400;500;600', fallback: "'Inter', 'Segoe UI', sans-serif" },
  },
  {
    id: 'playfair-source-sans',
    label: 'Playfair Display + Source Sans 3',
    note: 'A more editorial, premium-travel feel with a serif display face.',
    heading: { family: 'Playfair Display', googleFamily: 'Playfair+Display:wght@600;700', fallback: "'Playfair Display', Georgia, serif" },
    body: { family: 'Source Sans 3', googleFamily: 'Source+Sans+3:wght@400;500;600', fallback: "'Source Sans 3', 'Segoe UI', sans-serif" },
  },
]

export default fontOptions
