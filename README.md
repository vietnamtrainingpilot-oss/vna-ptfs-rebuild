# Vietnam Airlines PTFS — Website

A fully static information website (no booking, no backend) with a built-in
admin panel that can customize everything: theme, logo, navigation labels,
and every page's content — built as flexible content "blocks" you arrange
per page.

Colors and typography default to the official Vietnam Airlines brand
guideline (VNA Blue / Golden-Yellow / Creme, Titillium + Open Sans). Most
pages already carry your real content, ported over from the previous
build. A handful of pages that were previously blank (**Rules**,
**Lotusmiles → Tiers**, **Affiliates → Requirements & Benefits**,
**Flight Board**) now ship with real starting content instead of an empty
page — and **News** ships with three items clearly labeled `[Example]` so
the page isn't blank on day one. Review and edit all of these from the
Admin Panel before you consider the site final — see "What changed in
this rebuild" below for the full list.

## What changed in this rebuild

- **Transparent header over the homepage hero** (was previously built but
  left switched off) — the nav now floats over the hero image and solidifies
  on scroll, matching what full-service carrier sites typically do.
- **Hero treatment**: a slow, subtle zoom on background images, a directional
  gradient (instead of a flat wash) so text stays readable against any photo,
  and a larger, more editorial type scale.
- **Feature Cards can be "featured"** — mark any card in a Feature Cards
  block to make it span two columns with a filled accent icon, so a
  flagship item (a specific aircraft, a specific role, a specific tier)
  reads as more important instead of every card looking identical. Applied
  to "Operating Flights" on the homepage and "Flight Deck" on Careers as a
  starting example — toggle it on any card from Admin.
- **New stats row on the homepage** — 300+ members, 3 airlines, 20+ partner
  communities, 6 operational divisions, pulled from your own existing copy.
- **Filled genuinely-blank pages** (Rules, Lotusmiles Tiers, Affiliates
  Requirements & Benefits, Flight Board) that previously showed an empty
  placeholder — see the note above.
- **Admin password is now hashed**, not stored as plain text — see the
  security section below, it's important.
- Cleaned up a couple of duplicated blank spacer sections on the homepage.

## Getting started locally

```
npm install
npm run dev
```

Open the printed localhost URL. Go to `/admin` to sign in — the starting
password is:

```
ChangeMe-VNA2026
```

**Change this immediately** in Admin → Settings once you're in. See the
security note below.

## Deploying to Netlify

This is a static site — there's no server or database.

1. Push this project to a GitHub repo, or drag-and-drop the project folder
   into Netlify.
2. Build command: `npm run build`
   Publish directory: `dist`
   (both are already set in `netlify.toml`, so a Git-connected site needs no
   manual configuration).
3. Deploy. That's it.

## How content & the admin panel work (read this)

Because there's no backend, the admin panel can't save changes to a
database anywhere — it saves to **your browser's local storage**. This
means:

- While you're editing, everything you do in `/admin` previews live the
  moment you open the site in that same browser. This is genuinely live —
  not a simulation.
- Nobody else (no other visitor, no other device) sees those changes yet.
  They're a local draft.

### Publishing your changes for everyone

1. In Admin → **Import / Export**, click **Export config.json**.
2. Replace the file at `public/content.json` in your project with the
   exported file (keep the filename `content.json`).
3. Commit and redeploy (or drag-and-drop the updated folder into Netlify
   again).

Any visitor who doesn't already have local edits in their browser will now
load your published `content.json` as the starting state. Your own browser
keeps previewing its local draft on top of that until you clear it
(Admin → Import/Export → Reset to Defaults).

This means your workflow is: **edit locally → export → replace
`public/content.json` → redeploy** whenever you want to publish. Treat
`public/content.json` as your site's actual content file going forward —
it's plain JSON, safe to read, edit by hand, or commit to Git like any
other file. `public/content.json` starts as `{}` (meaning "use the built-in
defaults") until you replace it with your first export.

### Admin password & security

The admin login is a lightweight front-end gate, appropriate for keeping
casual visitors out — **it is not real security**. The password is hashed
(SHA-256) rather than stored as plain text, so it's no longer sitting in
the open in `content.json` or in the page source — but since everything
still runs in the browser with no server, a technically determined person
could still bypass the check itself (e.g. via the browser console). Don't
store anything truly sensitive in it, and don't reuse an important
password. If you need real access control, either put the whole site
behind Netlify's password protection (Site settings → Visitor access) as
an additional layer, or move the admin route to a real auth provider
(Netlify Identity, or a serverless function that validates credentials
server-side) — that's a bigger change than this rebuild covers, but it's
the actual fix if the admin panel will ever hold something sensitive.

### Images

The admin panel accepts images two ways:

- **Image URL** (recommended) — paste a link to an image hosted elsewhere
  (Discord CDN, Imgur, GitHub, your own hosting, etc.). Doesn't add to your
  `content.json` size.
- **Upload** — reads the file directly into the config as embedded data.
  Convenient, but large images bloat `content.json` and can slow the site
  down. Keep uploads small (ideally under ~300KB) or use a URL instead for
  anything large, like hero backgrounds or gallery photos.

**Heads up on the ported content:** most images carried over from the
previous build are Discord CDN links (`media.discordapp.net` /
`cdn.discordapp.com`), which include an expiry timestamp in the URL
(the `ex=` query parameter) and **will eventually stop loading** — Discord
attachment links aren't permanent. When one breaks, the site won't show a
broken-image icon (there's a graceful fallback), but the section will look
empty. Re-host anything you want to keep long-term (upload it directly in
Admin, or host it on something permanent) rather than relying on Discord
links surviving indefinitely.

### Formatting text

Every body-text field (Text Block, Image + Text, Feature Cards, CTA Banner,
Accordion answers, and the Hero subheading) supports Markdown — the small
toolbar above each of these fields inserts the syntax for you:

- `**bold**`, `*italic*`
- `[link text](https://...)`
- `- bullet list` / `1. numbered list`
- `### heading` and `> quote`

Content is rendered as real elements (not raw HTML), so it's safe to type
freely — there's no way to inject scripts or markup, even by pasting from
elsewhere.

## Project structure

```
src/
  data/               Fixed nav structure, section-type registry, font/icon options, brand defaults
  context/            SiteConfigContext — the single source of truth for theme + content
  components/
    layout/           Header, Footer, Breadcrumbs, page shell
    ui/               Button, Icon, EmptyState, ImageWithFallback
    sections/         SectionRenderer — every content block's public-facing presentation
    admin/            The entire admin panel (login, layout, per-tab screens, the page/section builder)
  pages/              PageRenderer (generic page resolver) + NotFound
public/
  content.json        Published site content — replace this to publish (see above)
  _redirects          Netlify SPA fallback (also set via netlify.toml)
```

### Adding a new content block type

Content blocks ("sections") are defined once in `src/data/sectionTypes.js`
— give it a default data shape and a field schema, and the admin editor
form is generated automatically. Then add its presentational component to
`src/components/sections/SectionRenderer.jsx`. No other file needs to
change.

### Changing the fixed navigation

The menu structure (pages and their nesting) lives in
`src/data/navigation.js`. Renaming a page's *label* or hiding it should be
done from Admin → Navigation instead (so it's part of your published
content) — only add, remove, or restructure pages themselves here.
