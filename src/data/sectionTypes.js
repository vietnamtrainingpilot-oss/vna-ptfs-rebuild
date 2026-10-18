// The Page Builder's block registry.
//
// Every page in the site is just an ordered list of "sections", each one
// `{ id, type, data }`. `type` looks up an entry here. `fields` describes
// the editable shape of `data` and drives the generic admin form
// (components/admin/FieldForm.jsx) — add a field here and it automatically
// gets an editor, no bespoke admin UI needed. `render` is handled centrally
// in components/sections/SectionRenderer.jsx (kept separate so this file
// stays pure data).

const BUTTON_STYLE_OPTIONS = [
  { value: 'primary', label: 'Primary (filled)' },
  { value: 'secondary', label: 'Secondary (outline)' },
  { value: 'ghost', label: 'Ghost (text only)' },
]

const ALIGN_OPTIONS = [
  { value: 'left', label: 'Left' },
  { value: 'center', label: 'Center' },
  { value: 'right', label: 'Right' },
]

const buttonFields = [
  { key: 'label', type: 'text', label: 'Button label', placeholder: 'e.g. View Positions' },
  { key: 'link', type: 'url', label: 'Link', placeholder: 'https:// or /page-path' },
  { key: 'style', type: 'select', label: 'Style', options: BUTTON_STYLE_OPTIONS, default: 'primary' },
]

const sectionTypes = {
  hero: {
    label: 'Hero Banner',
    description: 'Large top-of-page banner with a heading, background image and buttons.',
    icon: 'image',
    defaultData: () => ({
      eyebrow: '', heading: '', subheading: '',
      backgroundImage: '', overlay: true, align: 'left', height: 'large',
      buttons: [],
    }),
    fields: [
      { key: 'eyebrow', type: 'text', label: 'Eyebrow (small label above heading)', placeholder: 'e.g. Vietnam Airlines PTFS' },
      { key: 'heading', type: 'text', label: 'Heading' },
      { key: 'subheading', type: 'markdown', label: 'Subheading', inline: true },
      { key: 'backgroundImage', type: 'image', label: 'Background image' },
      { key: 'overlay', type: 'boolean', label: 'Darken image for text readability', default: true },
      { key: 'align', type: 'select', label: 'Text alignment', options: ALIGN_OPTIONS, default: 'left' },
      { key: 'height', type: 'select', label: 'Banner height', options: [{ value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }], default: 'large' },
      { key: 'buttons', type: 'list', label: 'Buttons', itemLabel: 'Button', max: 3, fields: buttonFields },
    ],
  },

  richText: {
    label: 'Text Block',
    description: 'A heading with a block of body copy.',
    icon: 'file-text',
    defaultData: () => ({ heading: '', body: '', align: 'left', width: 'normal' }),
    fields: [
      { key: 'heading', type: 'text', label: 'Heading (optional)' },
      { key: 'body', type: 'markdown', label: 'Body text', rows: 8 },
      { key: 'align', type: 'select', label: 'Alignment', options: ALIGN_OPTIONS, default: 'left' },
      { key: 'width', type: 'select', label: 'Column width', options: [{ value: 'normal', label: 'Normal' }, { value: 'narrow', label: 'Narrow (easier reading)' }, { value: 'full', label: 'Full width' }], default: 'normal' },
    ],
  },

  imageText: {
    label: 'Image + Text',
    description: 'A two-column layout pairing an image with text — good for introducing a topic.',
    icon: 'columns',
    defaultData: () => ({ heading: '', body: '', image: '', imagePosition: 'left', buttons: [] }),
    fields: [
      { key: 'image', type: 'image', label: 'Image' },
      { key: 'imagePosition', type: 'select', label: 'Image position', options: [{ value: 'left', label: 'Left' }, { value: 'right', label: 'Right' }], default: 'left' },
      { key: 'heading', type: 'text', label: 'Heading' },
      { key: 'body', type: 'markdown', label: 'Body text', rows: 6 },
      { key: 'buttons', type: 'list', label: 'Buttons', itemLabel: 'Button', max: 2, fields: buttonFields },
    ],
  },

  gallery: {
    label: 'Image Gallery',
    description: 'A responsive grid of images with optional captions.',
    icon: 'grid-3x3',
    defaultData: () => ({ heading: '', images: [] }),
    fields: [
      { key: 'heading', type: 'text', label: 'Heading (optional)' },
      { key: 'images', type: 'list', label: 'Images', itemLabel: 'Image', fields: [
        { key: 'image', type: 'image', label: 'Image' },
        { key: 'caption', type: 'text', label: 'Caption (optional)' },
      ] },
    ],
  },

  featureCards: {
    label: 'Feature Cards',
    description: 'Icon + title + text, repeated — as a grid or a stacked list. Use for benefits, requirements, steps, or highlights.',
    icon: 'layout-grid',
    defaultData: () => ({ heading: '', layout: 'grid', columns: '3', items: [] }),
    fields: [
      { key: 'heading', type: 'text', label: 'Heading (optional)' },
      { key: 'layout', type: 'select', label: 'Layout', options: [{ value: 'grid', label: 'Grid' }, { value: 'list', label: 'Stacked list' }], default: 'grid' },
      { key: 'columns', type: 'select', label: 'Grid columns', options: [{ value: '2', label: '2' }, { value: '3', label: '3' }, { value: '4', label: '4' }], default: '3' },
      { key: 'items', type: 'list', label: 'Cards', itemLabel: 'Card', fields: [
        { key: 'icon', type: 'icon', label: 'Icon' },
        { key: 'image', type: 'image', label: 'Image (optional, used instead of icon)' },
        { key: 'title', type: 'text', label: 'Title' },
        { key: 'text', type: 'markdown', label: 'Text', rows: 3 },
        { key: 'link', type: 'url', label: 'Link (optional)' },
        { key: 'featured', type: 'boolean', label: 'Feature this card (larger, spans two columns)', default: false },
      ] },
    ],
  },

  buttonRow: {
    label: 'Button Row',
    description: 'A standalone row of call-to-action buttons.',
    icon: 'mouse-pointer-click',
    defaultData: () => ({ align: 'center', buttons: [] }),
    fields: [
      { key: 'align', type: 'select', label: 'Alignment', options: ALIGN_OPTIONS, default: 'center' },
      { key: 'buttons', type: 'list', label: 'Buttons', itemLabel: 'Button', max: 5, fields: buttonFields },
    ],
  },

  ctaBanner: {
    label: 'Call-to-Action Banner',
    description: 'A colored strip with a heading, text and one button — good for prompting the next step.',
    icon: 'megaphone',
    defaultData: () => ({ heading: '', body: '', button: { label: '', link: '', style: 'primary' }, tone: 'brand' }),
    fields: [
      { key: 'heading', type: 'text', label: 'Heading' },
      { key: 'body', type: 'markdown', label: 'Text', rows: 3 },
      { key: 'tone', type: 'select', label: 'Background tone', options: [{ value: 'brand', label: 'Brand blue' }, { value: 'gold', label: 'Brand gold' }, { value: 'subtle', label: 'Subtle / light' }], default: 'brand' },
      { key: 'button', type: 'group', label: 'Button', fields: buttonFields },
    ],
  },

  statsRow: {
    label: 'Stats Row',
    description: 'A row of highlighted numbers with labels.',
    icon: 'bar-chart-3',
    defaultData: () => ({ items: [] }),
    fields: [
      { key: 'items', type: 'list', label: 'Stats', itemLabel: 'Stat', max: 6, fields: [
        { key: 'value', type: 'text', label: 'Value', placeholder: 'e.g. 24' },
        { key: 'label', type: 'text', label: 'Label', placeholder: 'e.g. Aircraft in fleet' },
      ] },
    ],
  },

  accordion: {
    label: 'Accordion / FAQ',
    description: 'Expandable question-and-answer or topic list. Good for Rules, Support and policy pages.',
    icon: 'list',
    defaultData: () => ({ heading: '', items: [] }),
    fields: [
      { key: 'heading', type: 'text', label: 'Heading (optional)' },
      { key: 'items', type: 'list', label: 'Items', itemLabel: 'Item', fields: [
        { key: 'question', type: 'text', label: 'Title / question' },
        { key: 'answer', type: 'markdown', label: 'Answer / details', rows: 4 },
      ] },
    ],
  },

  table: {
    label: 'Table',
    description: 'A structured data table — good for the fleet list, flight board, positions and results.',
    icon: 'table',
    defaultData: () => ({ heading: '', columns: [], rows: [] }),
    fields: [
      { key: 'heading', type: 'text', label: 'Heading (optional)' },
      { key: 'columns', type: 'list', label: 'Columns', itemLabel: 'Column', fields: [
        { key: 'label', type: 'text', label: 'Column header' },
      ] },
      { key: 'rows', type: 'list', label: 'Rows', itemLabel: 'Row', fields: [
        { key: 'cells', type: 'list', label: 'Cells (one per column, in order)', itemLabel: 'Cell', fields: [
          { key: 'value', type: 'text', label: 'Value' },
        ] },
      ] },
    ],
  },

  videoEmbed: {
    label: 'Video Embed',
    description: 'An embedded YouTube / video link.',
    icon: 'play-circle',
    defaultData: () => ({ heading: '', url: '', caption: '' }),
    fields: [
      { key: 'heading', type: 'text', label: 'Heading (optional)' },
      { key: 'url', type: 'url', label: 'Video URL (YouTube embed link)', placeholder: 'https://www.youtube.com/embed/...' },
      { key: 'caption', type: 'text', label: 'Caption (optional)' },
    ],
  },

  socialLinks: {
    label: 'Social Links',
    description: 'A row of social / community platform links with icons.',
    icon: 'share-2',
    defaultData: () => ({ heading: '', items: [] }),
    fields: [
      { key: 'heading', type: 'text', label: 'Heading (optional)' },
      { key: 'items', type: 'list', label: 'Links', itemLabel: 'Link', fields: [
        { key: 'platform', type: 'select', label: 'Platform', options: [
          { value: 'discord', label: 'Discord' }, { value: 'youtube', label: 'YouTube' },
          { value: 'instagram', label: 'Instagram' }, { value: 'tiktok', label: 'TikTok' },
          { value: 'twitter', label: 'X / Twitter' }, { value: 'facebook', label: 'Facebook' },
          { value: 'roblox', label: 'Roblox' }, { value: 'twitch', label: 'Twitch' },
          { value: 'website', label: 'Website / Other' },
        ], default: 'discord' },
        { key: 'label', type: 'text', label: 'Display label (optional)' },
        { key: 'url', type: 'url', label: 'Link' },
      ] },
    ],
  },

  divider: {
    label: 'Divider / Spacer',
    description: 'A visual break between sections.',
    icon: 'minus',
    defaultData: () => ({ style: 'line', size: 'medium' }),
    fields: [
      { key: 'style', type: 'select', label: 'Style', options: [{ value: 'line', label: 'Line' }, { value: 'space', label: 'Blank space only' } ], default: 'line' },
      { key: 'size', type: 'select', label: 'Size', options: [{ value: 'small', label: 'Small' }, { value: 'medium', label: 'Medium' }, { value: 'large', label: 'Large' }], default: 'medium' },
    ],
  },
}

export default sectionTypes
