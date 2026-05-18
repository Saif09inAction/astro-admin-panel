import { useState } from 'react'
import { motion } from 'framer-motion'
import { Menu, RefreshCw, Bell } from 'lucide-react'
import Sidebar from './Sidebar'

function AdminHeader({ onMenuOpen, title, subtitle, onRefresh, refreshing }) {
  return (
    <header
      className="sticky top-0 z-50 px-4 md:px-6 h-14 flex items-center justify-between border-b border-white/6"
      style={{ background: 'rgba(5,9,22,0.95)', backdropFilter: 'blur(16px)' }}
    >
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuOpen}
          className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center text-white/40 hover:text-white hover:bg-white/8 transition-all"
        >
          <Menu size={18} />
        </button>
        <div>
          <h1 className="font-cinzel text-[14px] font-bold text-white leading-tight">{title}</h1>
          {subtitle && <p className="font-poppins text-[10px] text-white/30">{subtitle}</p>}
        </div>
      </div>

      <div className="flex items-center gap-2">
        {onRefresh && (
          <button
            onClick={onRefresh}
            disabled={refreshing}
            className="flex items-center gap-1.5 font-poppins text-xs text-white/40 hover:text-white transition-colors px-3 py-1.5 rounded-lg hover:bg-white/5"
          >
            <RefreshCw size={13} className={refreshing ? 'animate-spin' : ''} />
            <span className="hidden sm:block">Refresh</span>
          </button>
        )}
        <div className="w-7 h-7 rounded-lg flex items-center justify-center border border-white/8 cursor-pointer hover:border-gold-400/30 transition-colors">
          <Bell size={13} className="text-white/30" />
        </div>
      </div>
    </header>
  )
}

export default function AdminLayout({ active, onNavigate, title, subtitle, onRefresh, refreshing, children }) {
  const [collapsed,   setCollapsed]   = useState(false)
  const [mobileOpen,  setMobileOpen]  = useState(false)

  return (
    <div className="min-h-screen flex" style={{ background: '#030712' }}>
      <Sidebar
        active={active}
        onNavigate={onNavigate}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(v => !v)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          onMenuOpen={() => setMobileOpen(true)}
          title={title}
          subtitle={subtitle}
          onRefresh={onRefresh}
          refreshing={refreshing}
        />
        <motion.main
          key={active}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="flex-1 overflow-auto p-4 md:p-6"
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
