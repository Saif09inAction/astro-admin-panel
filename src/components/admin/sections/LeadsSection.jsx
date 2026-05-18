import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Filter, Phone, MessageCircle, Trash2, ChevronDown, Users, X, SortAsc, SortDesc } from 'lucide-react'
import { updateLeadStatus, deleteLead } from '../../../firebase/firestore'

const STATUS_META = {
  new:       { label: 'New',       color: '#60a5fa' },
  contacted: { label: 'Contacted', color: '#fbbf24' },
  converted: { label: 'Converted', color: '#34d399' },
}

function StatusBadge({ status }) {
  const m = STATUS_META[status] || STATUS_META.new
  return (
    <span className="font-poppins text-[10px] px-2.5 py-1 rounded-full"
      style={{ background: `${m.color}12`, color: m.color, border: `1px solid ${m.color}25` }}>
      {m.label}
    </span>
  )
}

/* Desktop table row */
function LeadRow({ lead, onStatusChange, onDelete }) {
  const [updating, setUpdating] = useState(false)
  const ts = lead.createdAt?.toDate?.()
  const date = ts ? ts.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' }) : '—'
  const time = ts ? ts.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) : ''

  const handleStatus = async s => {
    setUpdating(true)
    await onStatusChange(lead.id, s)
    setUpdating(false)
  }

  return (
    <motion.tr
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="border-b border-white/4 hover:bg-white/[0.015] transition-colors group"
    >
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-cinzel text-xs font-bold text-gold-400"
            style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.18)' }}>
            {lead.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-poppins text-sm text-white">{lead.name || '—'}</p>
            <p className="font-poppins text-[10px] text-white/30">{date} {time && `· ${time}`}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-1.5">
          <span className="font-poppins text-sm text-white/60">{lead.phone || '—'}</span>
          {lead.phone && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <a href={`tel:${lead.phone}`} className="text-white/20 hover:text-gold-400 transition-colors">
                <Phone size={11} />
              </a>
              <a href={`https://wa.me/${lead.phone?.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                className="text-white/20 hover:text-green-400 transition-colors">
                <MessageCircle size={11} />
              </a>
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-3.5">
        <span className="font-poppins text-xs text-purple-300 bg-purple-400/8 border border-purple-400/18 px-2.5 py-1 rounded-full">
          {lead.service || lead.problem || '—'}
        </span>
      </td>
      <td className="px-4 py-3.5 max-w-[180px]">
        <p className="font-poppins text-xs text-white/35 truncate" title={lead.message}>{lead.message || '—'}</p>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <StatusBadge status={lead.status} />
          {updating && <div className="w-3 h-3 border border-gold-400/50 border-t-gold-400 rounded-full animate-spin" />}
        </div>
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <select
            value={lead.status || 'new'}
            onChange={e => handleStatus(e.target.value)}
            disabled={updating}
            className="bg-white/5 border border-white/10 rounded-lg px-2 py-1.5 font-poppins text-xs text-white focus:outline-none focus:border-gold-400/30 cursor-pointer disabled:opacity-50 transition-colors"
            style={{ background: '#0a0f1e' }}
          >
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>
          <button
            onClick={() => onDelete(lead.id)}
            className="p-1.5 text-white/15 hover:text-red-400 hover:bg-red-400/8 rounded-lg transition-all"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </td>
    </motion.tr>
  )
}

/* Mobile card */
function LeadCard({ lead, onStatusChange, onDelete }) {
  const [updating, setUpdating] = useState(false)
  const ts = lead.createdAt?.toDate?.()
  const date = ts ? ts.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl p-4"
      style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-cinzel text-sm font-bold text-gold-400"
            style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)' }}>
            {lead.name?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <p className="font-poppins text-sm font-medium text-white">{lead.name || '—'}</p>
            <p className="font-poppins text-[10px] text-white/30">{date}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <StatusBadge status={lead.status} />
          <button onClick={() => onDelete(lead.id)} className="p-1 text-white/15 hover:text-red-400 transition-colors">
            <Trash2 size={13} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <div>
          <p className="font-poppins text-[9px] text-white/25 uppercase tracking-wider mb-0.5">Phone</p>
          <div className="flex items-center gap-1.5">
            <p className="font-poppins text-xs text-white/60">{lead.phone || '—'}</p>
            {lead.phone && (
              <>
                <a href={`tel:${lead.phone}`} className="text-white/20 hover:text-gold-400"><Phone size={11} /></a>
                <a href={`https://wa.me/${lead.phone?.replace(/\D/g,'')}`} target="_blank" rel="noopener noreferrer"
                  className="text-white/20 hover:text-green-400"><MessageCircle size={11} /></a>
              </>
            )}
          </div>
        </div>
        <div>
          <p className="font-poppins text-[9px] text-white/25 uppercase tracking-wider mb-0.5">Service</p>
          <p className="font-poppins text-xs text-purple-300 truncate">{lead.service || lead.problem || '—'}</p>
        </div>
      </div>

      {lead.message && (
        <p className="font-poppins text-[11px] text-white/35 bg-white/3 rounded-lg px-3 py-2 mb-3 leading-relaxed">
          "{lead.message}"
        </p>
      )}

      <select
        value={lead.status || 'new'}
        onChange={e => { setUpdating(true); onStatusChange(lead.id, e.target.value).finally(() => setUpdating(false)) }}
        disabled={updating}
        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 font-poppins text-xs text-white focus:outline-none cursor-pointer"
        style={{ background: '#0a0f1e' }}
      >
        <option value="new">New</option>
        <option value="contacted">Contacted</option>
        <option value="converted">Converted</option>
      </select>
    </motion.div>
  )
}

/* Delete confirmation modal */
function DeleteConfirm({ onConfirm, onCancel }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1,   opacity: 1 }}
        exit={{ scale: 0.9,    opacity: 0 }}
        className="w-full max-w-sm rounded-2xl p-6 text-center"
        style={{ background: '#0a0f1e', border: '1px solid rgba(239,68,68,0.25)' }}
      >
        <div className="w-12 h-12 rounded-full bg-red-400/10 border border-red-400/25 flex items-center justify-center mx-auto mb-4">
          <Trash2 size={20} className="text-red-400" />
        </div>
        <p className="font-cinzel text-base font-bold text-white mb-2">Delete Lead?</p>
        <p className="font-poppins text-sm text-white/40 mb-6">This action cannot be undone.</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 py-2.5 rounded-xl font-poppins text-sm text-white/50 border border-white/10 hover:bg-white/5 transition-all">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 py-2.5 rounded-xl font-poppins text-sm text-white bg-red-500 hover:bg-red-600 transition-all">
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function LeadsSection({ leads, onLeadsChange }) {
  const [search,      setSearch]      = useState('')
  const [statusFilter,setStatusFilter]= useState('all')
  const [sortOrder,   setSortOrder]   = useState('desc')
  const [deleteId,    setDeleteId]    = useState(null)

  const handleStatusChange = async (id, status) => {
    await updateLeadStatus(id, status)
    onLeadsChange(prev => prev.map(l => l.id === id ? { ...l, status } : l))
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteLead(deleteId)
    onLeadsChange(prev => prev.filter(l => l.id !== deleteId))
    setDeleteId(null)
  }

  const filtered = leads
    .filter(l => statusFilter === 'all' || l.status === statusFilter)
    .filter(l => {
      if (!search) return true
      const q = search.toLowerCase()
      return (
        l.name?.toLowerCase().includes(q) ||
        l.phone?.includes(q) ||
        (l.service || l.problem)?.toLowerCase().includes(q)
      )
    })
    .sort((a, b) => {
      const ta = a.createdAt?.toDate?.()?.getTime() || 0
      const tb = b.createdAt?.toDate?.()?.getTime() || 0
      return sortOrder === 'desc' ? tb - ta : ta - tb
    })

  const stats = [
    { label: 'Total',     value: leads.length,                                color: '#60a5fa' },
    { label: 'New',       value: leads.filter(l=>l.status==='new').length,       color: '#fbbf24' },
    { label: 'Contacted', value: leads.filter(l=>l.status==='contacted').length, color: '#f97316' },
    { label: 'Converted', value: leads.filter(l=>l.status==='converted').length, color: '#34d399' },
  ]

  return (
    <div className="space-y-5">
      {/* Mini stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {stats.map(({ label, value, color }) => (
          <div key={label} className="rounded-xl px-4 py-3 flex items-center gap-3"
            style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${color}18` }}>
            <span className="w-2 h-2 rounded-full shrink-0" style={{ background: color, boxShadow: `0 0 6px ${color}` }} />
            <div>
              <p className="font-cinzel text-lg font-bold text-white">{value}</p>
              <p className="font-poppins text-[10px] text-white/35">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
          <input
            type="text"
            placeholder="Search name, phone, service…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white/4 border border-white/8 rounded-xl pl-9 pr-4 py-2.5 font-poppins text-sm text-white placeholder-white/20 focus:outline-none focus:border-gold-400/30 transition-all"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/25 hover:text-white">
              <X size={14} />
            </button>
          )}
        </div>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="bg-white/4 border border-white/8 rounded-xl px-3 py-2.5 font-poppins text-sm text-white focus:outline-none focus:border-gold-400/30 cursor-pointer flex-1 sm:flex-none"
            style={{ background: '#0a0f1e' }}
          >
            <option value="all">All Status</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="converted">Converted</option>
          </select>
          <button
            onClick={() => setSortOrder(v => v === 'desc' ? 'asc' : 'desc')}
            className="px-3 py-2.5 rounded-xl border border-white/8 text-white/40 hover:text-white hover:border-white/20 transition-all"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            {sortOrder === 'desc' ? <SortDesc size={15} /> : <SortAsc size={15} />}
          </button>
        </div>
      </div>

      {/* Results label */}
      <p className="font-poppins text-xs text-white/25">
        {filtered.length} {filtered.length === 1 ? 'result' : 'results'}
        {search && ` for "${search}"`}
      </p>

      {/* Desktop table */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Users size={28} className="text-white/15 mb-3" />
          <p className="font-poppins text-sm text-white/30">
            {leads.length === 0 ? "No leads yet — they'll appear here after someone submits the form." : 'No results match your filters.'}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block rounded-2xl overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/6">
                    {['Client', 'Phone', 'Service', 'Message', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-4 py-3 text-left font-poppins text-[10px] text-white/30 uppercase tracking-widest font-medium">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(lead => (
                    <LeadRow key={lead.id} lead={lead} onStatusChange={handleStatusChange} onDelete={setDeleteId} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {filtered.map(lead => (
              <LeadCard key={lead.id} lead={lead} onStatusChange={handleStatusChange} onDelete={setDeleteId} />
            ))}
          </div>
        </>
      )}

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteId && <DeleteConfirm onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />}
      </AnimatePresence>
    </div>
  )
}
