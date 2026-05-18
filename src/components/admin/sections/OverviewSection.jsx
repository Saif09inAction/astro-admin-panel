import { motion } from 'framer-motion'
import { Users, TrendingUp, Clock, CheckCircle, Sparkles, Star, Activity } from 'lucide-react'

function StatCard({ icon: Icon, label, value, delta, color, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className="relative rounded-2xl p-5 overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}
    >
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${color}50, transparent)` }} />
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
          <Icon size={18} style={{ color }} />
        </div>
        {delta !== undefined && (
          <span className="font-poppins text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${color}12`, color }}>
            {delta}
          </span>
        )}
      </div>
      <p className="font-cinzel text-2xl font-bold text-white mb-1">{value}</p>
      <p className="font-poppins text-xs text-white/40">{label}</p>
    </motion.div>
  )
}

function RecentLeadRow({ lead, i }) {
  const ts = lead.createdAt?.toDate?.()
  const timeAgo = ts ? formatTimeAgo(ts) : '—'
  const statusColor = { new: '#60a5fa', contacted: '#fbbf24', converted: '#34d399' }[lead.status] || '#60a5fa'

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.05 * i }}
      className="flex items-center gap-3 py-3 border-b border-white/4 last:border-0"
    >
      <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-cinzel text-xs font-bold text-gold-400"
        style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
        {lead.name?.[0]?.toUpperCase() || '?'}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-poppins text-sm text-white truncate">{lead.name || '—'}</p>
        <p className="font-poppins text-[10px] text-white/30 truncate">{lead.service || lead.problem || '—'}</p>
      </div>
      <div className="text-right shrink-0">
        <span className="font-poppins text-[10px] px-2 py-0.5 rounded-full" style={{ background: `${statusColor}15`, color: statusColor, border: `1px solid ${statusColor}25` }}>
          {lead.status || 'new'}
        </span>
        <p className="font-poppins text-[9px] text-white/25 mt-1">{timeAgo}</p>
      </div>
    </motion.div>
  )
}

function formatTimeAgo(date) {
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60) return 'Just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export default function OverviewSection({ leads }) {
  const total     = leads.length
  const newLeads  = leads.filter(l => l.status === 'new').length
  const contacted = leads.filter(l => l.status === 'contacted').length
  const converted = leads.filter(l => l.status === 'converted').length
  const rate      = total > 0 ? Math.round((converted / total) * 100) : 0
  const recent    = [...leads].slice(0, 6)

  const stats = [
    { icon: Users,       label: 'Total Leads',    value: total,     color: '#60a5fa', delay: 0 },
    { icon: Clock,       label: 'New Leads',       value: newLeads,  color: '#fbbf24', delta: 'Pending', delay: 0.05 },
    { icon: TrendingUp,  label: 'Contacted',       value: contacted, color: '#f97316', delay: 0.1 },
    { icon: CheckCircle, label: 'Converted',       value: converted, color: '#34d399', delta: `${rate}%`, delay: 0.15 },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="font-cinzel text-xl font-bold text-white">Welcome back 🙏</h2>
        <p className="font-poppins text-sm text-white/35 mt-1">Here's what's happening with your leads today.</p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => <StatCard key={s.label} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent leads */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="font-cinzel text-sm font-bold text-white">Recent Leads</p>
            <Activity size={14} className="text-white/20" />
          </div>
          {recent.length === 0 ? (
            <p className="font-poppins text-xs text-white/30 py-4 text-center">No leads yet</p>
          ) : (
            recent.map((l, i) => <RecentLeadRow key={l.id} lead={l} i={i} />)
          )}
        </div>

        {/* Conversion funnel */}
        <div className="rounded-2xl p-5" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center justify-between mb-4">
            <p className="font-cinzel text-sm font-bold text-white">Pipeline</p>
            <span className="font-poppins text-[10px] text-white/25">{rate}% conversion</span>
          </div>
          <div className="space-y-3">
            {[
              { label: 'New',       value: newLeads,  max: total, color: '#60a5fa' },
              { label: 'Contacted', value: contacted, max: total, color: '#fbbf24' },
              { label: 'Converted', value: converted, max: total, color: '#34d399' },
            ].map(({ label, value, max, color }) => (
              <div key={label}>
                <div className="flex justify-between mb-1">
                  <span className="font-poppins text-xs text-white/50">{label}</span>
                  <span className="font-poppins text-xs text-white/50">{value}</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: max > 0 ? `${(value / max) * 100}%` : '0%' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{ background: color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Quick service breakdown */}
          <div className="mt-5 pt-4 border-t border-white/5">
            <p className="font-poppins text-[10px] text-white/25 uppercase tracking-wider mb-3">Top Services</p>
            {Object.entries(
              leads.reduce((acc, l) => {
                const key = l.service || l.problem || 'Other'
                acc[key] = (acc[key] || 0) + 1
                return acc
              }, {})
            )
              .sort((a, b) => b[1] - a[1])
              .slice(0, 4)
              .map(([name, count]) => (
                <div key={name} className="flex items-center justify-between py-1">
                  <span className="font-poppins text-xs text-white/50 truncate flex-1 mr-2">{name}</span>
                  <span className="font-poppins text-xs text-gold-400 shrink-0">{count}</span>
                </div>
              ))
            }
            {leads.length === 0 && <p className="font-poppins text-xs text-white/25 text-center py-2">No data yet</p>}
          </div>
        </div>
      </div>
    </div>
  )
}
