import { motion, AnimatePresence } from 'framer-motion'
import { signOut } from 'firebase/auth'
import { auth } from '../../firebase/config'
import {
  LayoutDashboard, Users, Sparkles, Star, Settings, LogOut, X, ChevronLeft, ChevronRight,
} from 'lucide-react'

const navItems = [
  { id: 'overview',      label: 'Overview',      icon: LayoutDashboard },
  { id: 'leads',         label: 'Leads',         icon: Users },
  { id: 'services',      label: 'Services',      icon: Sparkles },
  { id: 'testimonials',  label: 'Testimonials',  icon: Star },
  { id: 'settings',      label: 'Settings',      icon: Settings },
]

function NavLink({ item, active, collapsed, onClick }) {
  const { id, label, icon: Icon } = item
  return (
    <button
      onClick={() => onClick(id)}
      title={collapsed ? label : ''}
      className={`
        w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left
        font-poppins text-sm transition-all duration-200
        ${active
          ? 'bg-gold-400/12 text-gold-400 border border-gold-400/20'
          : 'text-white/45 hover:text-white hover:bg-white/5 border border-transparent'}
      `}
    >
      <Icon size={17} className="shrink-0" />
      {!collapsed && <span className="truncate">{label}</span>}
      {!collapsed && active && (
        <span className="ml-auto w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0" />
      )}
    </button>
  )
}

export default function Sidebar({ active, onNavigate, collapsed, onToggleCollapse, mobileOpen, onMobileClose }) {
  const content = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/6 ${collapsed ? 'justify-center' : ''}`}>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ background: 'linear-gradient(135deg,rgba(245,158,11,0.2),rgba(245,158,11,0.05))', border: '1px solid rgba(245,158,11,0.3)' }}
        >
          <span className="font-cinzel text-base text-gold-400">ॐ</span>
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-cinzel text-[12px] font-bold text-white leading-tight">Dheeraj Shastri Ji</p>
            <p className="font-poppins text-[10px] text-white/30 tracking-wider uppercase">Admin Panel</p>
          </div>
        )}
        {!collapsed && (
          <button
            onClick={onToggleCollapse}
            className="ml-auto p-1 text-white/20 hover:text-white/50 transition-colors lg:flex hidden"
          >
            <ChevronLeft size={15} />
          </button>
        )}
      </div>

      {/* Collapsed expand button */}
      {collapsed && (
        <button
          onClick={onToggleCollapse}
          className="mx-auto mt-2 p-1 text-white/20 hover:text-white/50 transition-colors hidden lg:flex"
        >
          <ChevronRight size={15} />
        </button>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.id}
            item={item}
            active={active === item.id}
            collapsed={collapsed}
            onClick={(id) => { onNavigate(id); onMobileClose?.() }}
          />
        ))}
      </nav>

      {/* Sign out */}
      <div className="px-3 py-4 border-t border-white/6">
        <button
          onClick={() => signOut(auth)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl font-poppins text-sm text-white/30 hover:text-red-400 hover:bg-red-400/5 transition-all ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Sign Out' : ''}
        >
          <LogOut size={17} className="shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col h-screen sticky top-0 shrink-0 transition-all duration-300 border-r border-white/6 ${collapsed ? 'w-[64px]' : 'w-[220px]'}`}
        style={{ background: 'rgba(5,9,22,0.98)' }}
      >
        {content}
      </aside>

      {/* Mobile overlay sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onMobileClose}
              className="fixed inset-0 z-[110] lg:hidden"
              style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
            />
            <motion.aside
              initial={{ x: -240 }}
              animate={{ x: 0 }}
              exit={{ x: -240 }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              className="fixed top-0 left-0 z-[120] h-full w-[220px] flex flex-col lg:hidden border-r border-white/6"
              style={{ background: 'rgba(5,9,22,0.99)' }}
            >
              <button
                onClick={onMobileClose}
                className="absolute right-3 top-4 p-1.5 text-white/30 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
              {content}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
