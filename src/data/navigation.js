// Fixed site navigation structure.
// Each top-level item is either a direct page (no children) or a "hub"
// (has children). Hubs automatically get their own route too, so every
// link in the menu always resolves to a real page.
//
// `id` must be unique and stable — it's the key content is stored under
// in siteConfig.pages, so don't rename these once content has been added.

const navigation = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'rules', label: 'Rules', path: '/rules' },
  {
    id: 'about',
    label: 'About Us',
    path: '/about',
    children: [
      { id: 'about-server', label: 'Our Server', path: '/about/our-server' },
      { id: 'about-socials', label: 'Socials', path: '/about/socials' },
      { id: 'about-fleet', label: 'Fleet', path: '/about/fleet' },
      { id: 'about-pacific', label: 'Pacific Airlines', path: '/about/pacific-airlines' },
      { id: 'about-vasco', label: 'VASCO', path: '/about/vasco' },
    ],
  },
  {
    id: 'lotusmiles',
    label: 'Lotusmiles',
    path: '/lotusmiles',
    children: [
      { id: 'lotusmiles-intro', label: 'Introduction', path: '/lotusmiles/introduction' },
      { id: 'lotusmiles-about', label: 'About Lotusmiles in Vietnam Airlines PTFS', path: '/lotusmiles/about' },
      { id: 'lotusmiles-howto', label: 'How to get Lotusmiles', path: '/lotusmiles/how-to-get' },
    ],
  },
  {
    id: 'affiliates',
    label: 'Affiliates',
    path: '/affiliates',
    children: [
      { id: 'affiliates-intro', label: 'Introduction', path: '/affiliates/introduction' },
      { id: 'affiliates-skyteam', label: 'Skyteam', path: '/affiliates/skyteam' },
      { id: 'affiliates-requirements', label: 'Partnership Requirements & Benefits', path: '/affiliates/partnership-requirements' },
      { id: 'affiliates-tiers', label: 'Partnership Tiers', path: '/affiliates/partnership-tiers' },
      { id: 'affiliates-ours', label: 'Our Affiliates', path: '/affiliates/our-affiliates' },
    ],
  },
  { id: 'support', label: 'Support', path: '/support' },
  {
    id: 'careers',
    label: 'Careers',
    path: '/careers',
    children: [
      { id: 'careers-intro', label: 'Careers Introduction', path: '/careers/introduction' },
      { id: 'careers-positions', label: 'Positions', path: '/careers/positions' },
      { id: 'careers-results', label: 'Results', path: '/careers/results' },
      { id: 'careers-direct-entry', label: 'Direct Entry', path: '/careers/direct-entry' },
    ],
  },
  { id: 'news', label: 'News', path: '/news' },
  {
    id: 'flight-info',
    label: 'Flight Information',
    path: '/flight-information',
    children: [
      { id: 'flights', label: 'Flights', path: '/flight-information/flights' },
      { id: 'skyteam-flights', label: 'Skyteam Flights', path: '/flight-information/skyteam-flights' },
      { id: 'partner-flights', label: 'Partner Flights', path: '/flight-information/partner-flights' },
      { id: 'flight-board', label: 'Flight Board', path: '/flight-information/flight-board' },
      { id: 'meals-drinks', label: 'Meals & Drinks', path: '/flight-information/meals-drinks' },
    ],
  },
]

// Flatten to a lookup list of every routable page (hubs + children + home)
export function flattenPages(nav = navigation) {
  const list = []
  for (const item of nav) {
    list.push({ id: item.id, label: item.label, path: item.path, isHub: !!item.children?.length, parentId: null })
    if (item.children) {
      for (const child of item.children) {
        list.push({ id: child.id, label: child.label, path: child.path, isHub: false, parentId: item.id })
      }
    }
  }
  return list
}

export default navigation
