import { useSiteConfig } from '../../context/SiteConfigContext.jsx'
import AdminLogin from './AdminLogin.jsx'
import AdminLayout from './AdminLayout.jsx'

export default function AdminApp() {
  const { isAuthed } = useSiteConfig()
  return isAuthed ? <AdminLayout /> : <AdminLogin />
}
