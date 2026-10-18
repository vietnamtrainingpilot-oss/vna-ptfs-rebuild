import {
  Plane, PlaneTakeoff, PlaneLanding, Globe, Globe2, MapPin, Map,
  Users, User, UserPlus, Shield, ShieldCheck, Award, Star, Gift, Ticket,
  Briefcase, Building, Building2, Phone, Mail, MessageCircle, HelpCircle,
  LifeBuoy, Calendar, Clock, Newspaper, Megaphone, Bell, Utensils, Coffee,
  Wine, Cookie, Luggage, Armchair, Ship, Anchor, Compass, Heart, Sparkles,
  Trophy, Medal, Crown, Gem, CheckCircle, CircleCheck, ThumbsUp, Flag,
  Send, Video, Camera, Music2, FileText, ClipboardList, BookOpen,
  GraduationCap, Wallet, CreditCard, Percent, Handshake, Headphones,
  Radio, Wifi, Monitor, Settings, ChevronRight, ArrowRight, ExternalLink,
  // admin / chrome icons
  Image, Columns2, Grid3x3, LayoutGrid, MousePointerClick, BarChart3, List,
  Table, PlayCircle, Share2, Minus, Plus, Trash2, ChevronUp, ChevronDown,
  Copy, Eye, EyeOff, Lock, LogOut, Save, Upload, Download, RotateCcw,
  Palette, Type, LayoutDashboard, KeyRound, Menu, X, GripVertical, Check,
  Navigation, FileStack, Database, ImageOff, PlusCircle, ArrowUpDown,
  Gamepad2, AtSign, Bold, Italic, Link2, ListOrdered, Heading2, Quote, Code,
} from 'lucide-react'

const ICONS = {
  plane: Plane, 'plane-takeoff': PlaneTakeoff, 'plane-landing': PlaneLanding,
  globe: Globe, 'globe-2': Globe2, 'map-pin': MapPin, map: Map,
  users: Users, user: User, 'user-plus': UserPlus, shield: Shield, 'shield-check': ShieldCheck,
  award: Award, star: Star, gift: Gift, ticket: Ticket,
  briefcase: Briefcase, building: Building, 'building-2': Building2,
  phone: Phone, mail: Mail, 'message-circle': MessageCircle, 'help-circle': HelpCircle,
  'life-buoy': LifeBuoy, calendar: Calendar, clock: Clock, newspaper: Newspaper,
  megaphone: Megaphone, bell: Bell, utensils: Utensils, coffee: Coffee,
  wine: Wine, cookie: Cookie, luggage: Luggage, armchair: Armchair,
  ship: Ship, anchor: Anchor, compass: Compass, heart: Heart, sparkles: Sparkles,
  trophy: Trophy, medal: Medal, crown: Crown, gem: Gem,
  'check-circle': CheckCircle, 'circle-check': CircleCheck, 'thumbs-up': ThumbsUp, flag: Flag,
  send: Send, video: Video, camera: Camera, music: Music2,
  'file-text': FileText, 'clipboard-list': ClipboardList, 'book-open': BookOpen,
  'graduation-cap': GraduationCap, wallet: Wallet, 'credit-card': CreditCard,
  percent: Percent, handshake: Handshake, headphones: Headphones, radio: Radio,
  wifi: Wifi, monitor: Monitor, settings: Settings,
  'chevron-right': ChevronRight, 'arrow-right': ArrowRight, 'external-link': ExternalLink,
  'game-controller': Gamepad2, 'at-sign': AtSign,

  // section-type badges (used in admin "Add Section" menu)
  image: Image, columns: Columns2, 'grid-3x3': Grid3x3, 'layout-grid': LayoutGrid,
  'mouse-pointer-click': MousePointerClick, 'bar-chart-3': BarChart3, list: List,
  table: Table, 'play-circle': PlayCircle, 'share-2': Share2, minus: Minus,

  // admin chrome
  plus: Plus, 'trash-2': Trash2, 'chevron-up': ChevronUp, 'chevron-down': ChevronDown,
  copy: Copy, eye: Eye, 'eye-off': EyeOff, lock: Lock, 'log-out': LogOut, save: Save,
  upload: Upload, download: Download, 'rotate-ccw': RotateCcw, palette: Palette,
  type: Type, 'layout-dashboard': LayoutDashboard, 'key-round': KeyRound,
  menu: Menu, x: X, 'grip-vertical': GripVertical, check: Check,
  navigation: Navigation, 'file-stack': FileStack, database: Database,
  'image-off': ImageOff, 'plus-circle': PlusCircle, 'arrow-up-down': ArrowUpDown,
  bold: Bold, italic: Italic, 'link-2': Link2, 'list-ordered': ListOrdered,
  'heading-2': Heading2, quote: Quote, code: Code,
}

export default function Icon({ name, size = 20, strokeWidth = 1.9, className = '', ...rest }) {
  const Cmp = ICONS[name]
  if (!Cmp) return null
  return <Cmp size={size} strokeWidth={strokeWidth} className={className} aria-hidden="true" {...rest} />
}

export { ICONS }
