import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Save, Sparkles, Star } from 'lucide-react'
import { getServices, addService, updateService, deleteService } from '../../../firebase/firestore'

const ACCENT_COLORS = [
  '#f472b6', '#60a5fa', '#fbbf24', '#34d399', '#a78bfa',
  '#f97316', '#e879f9', '#22d3ee', '#fb7185', '#4ade80',
]

/* Default services that mirror the main website */
const DEFAULT_SERVICES = [
  { title: 'Love Problem Solution',  desc: 'Reunite with lost love through ancient Vedic remedies. Guaranteed results within 24 hours.', accent: '#f472b6', tag: 'Most Popular', featured: true,  order: 1 },
  { title: 'Ex Love Back',           desc: 'Restore broken bonds and reunite permanently. Powerful spiritual remedies with real results.', accent: '#fb923c', tag: 'High Demand',  featured: true,  order: 2 },
  { title: 'Marriage Consultation',  desc: 'Perfect timing, compatibility & removing all obstacles.', accent: '#fbbf24', tag: '', featured: false, order: 3 },
  { title: 'Career Guidance',        desc: 'Align your career with your cosmic destiny.', accent: '#60a5fa', tag: '', featured: false, order: 4 },
  { title: 'Kundli Matching',        desc: 'Deep birth chart analysis for a harmonious marriage.', accent: '#a78bfa', tag: '', featured: false, order: 5 },
  { title: 'Business Problems',      desc: 'Remove planetary blocks and attract lasting prosperity.', accent: '#34d399', tag: '', featured: false, order: 6 },
  { title: 'Family Disputes',        desc: 'Restore peace and harmony within your family.', accent: '#f97316', tag: '', featured: false, order: 7 },
  { title: 'Black Magic Protection', desc: 'Neutralise negative energies and evil eye permanently.', accent: '#94a3b8', tag: '', featured: false, order: 8 },
]

const inputCls = "w-full border border-white/10 rounded-xl px-4 py-2.5 font-poppins text-sm text-white placeholder-white/25 focus:outline-none focus:border-yellow-400/40 transition-all"
const inputStyle = { background: '#0d1628' }

function ServiceFormModal({ service, onSave, onClose, saving }) {
  const isEdit = !!service?.id
  const [form, setForm] = useState({
    title:    service?.title    || '',
    desc:     service?.desc     || '',
    accent:   service?.accent   || ACCENT_COLORS[0],
    featured: service?.featured ?? false,
    order:    service?.order    ?? 99,
    tag:      service?.tag      || '',
  })

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.title.trim()) return
    onSave({ ...form, order: Number(form.order) || 99 })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center px-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}
    >
      <motion.div
        initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
        className="w-full max-w-lg rounded-2xl overflow-hidden"
        style={{ background: '#0a0f1e', border: '1px solid rgba(245,158,11,0.2)' }}
      >
        <div style={{ height: 2, background: 'linear-gradient(90deg,#a78bfa,#fbbf24)' }} />
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            <p className="font-cinzel text-base font-bold text-white">{isEdit ? 'Edit Service' : 'Add Service'}</p>
            <button onClick={onClose} className="text-white/30 hover:text-white"><X size={18} /></button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="font-poppins text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">Service Name *</label>
              <input className={inputCls} style={inputStyle} placeholder="e.g. Love Problem Solution"
                value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} required />
            </div>
            <div>
              <label className="font-poppins text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">Description</label>
              <textarea className={`${inputCls} resize-none`} style={inputStyle} rows={2}
                placeholder="Brief service description…"
                value={form.desc} onChange={e => setForm(p => ({ ...p, desc: e.target.value }))} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-poppins text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">Badge Tag</label>
                <input className={inputCls} style={inputStyle} placeholder="e.g. Most Popular"
                  value={form.tag} onChange={e => setForm(p => ({ ...p, tag: e.target.value }))} />
              </div>
              <div>
                <label className="font-poppins text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">Sort Order</label>
                <input type="number" className={inputCls} style={inputStyle} value={form.order}
                  onChange={e => setForm(p => ({ ...p, order: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="font-poppins text-[10px] text-white/40 uppercase tracking-wider mb-2 block">Accent Color</label>
              <div className="flex flex-wrap gap-2">
                {ACCENT_COLORS.map(c => (
                  <button key={c} type="button" onClick={() => setForm(p => ({ ...p, accent: c }))}
                    className="w-7 h-7 rounded-full transition-all border-2"
                    style={{ background: c, borderColor: form.accent === c ? '#fff' : 'transparent', transform: form.accent === c ? 'scale(1.25)' : 'scale(1)' }}
                  />
                ))}
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setForm(p => ({ ...p, featured: !p.featured }))}
                className={`w-10 h-5 rounded-full transition-all relative ${form.featured ? 'bg-yellow-400' : 'bg-white/15'}`}
              >
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${form.featured ? 'left-5' : 'left-0.5'}`} />
              </div>
              <span className="font-poppins text-sm text-white/60">Featured card (larger, shown first)</span>
            </label>

            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose}
                className="flex-1 py-2.5 rounded-xl font-poppins text-sm text-white/40 border border-white/10 hover:bg-white/5 transition-all">
                Cancel
              </button>
              <button type="submit" disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-poppins text-sm font-semibold transition-all disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#fcd34d,#f59e0b)', color: '#030712' }}>
                {saving
                  ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  : <><Save size={14} />{isEdit ? 'Save Changes' : 'Add Service'}</>}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ServiceCard({ service, onEdit, onDelete }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl p-4 group"
      style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${service.accent}20` }}
    >
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg,transparent,${service.accent}50,transparent)` }} />
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: `${service.accent}15`, border: `1px solid ${service.accent}28` }}>
            <Sparkles size={17} style={{ color: service.accent }} />
          </div>
          <div>
            <p className="font-cinzel text-sm font-bold text-white">{service.title}</p>
            {service.tag && (
              <span className="font-poppins text-[9px] tracking-wider uppercase px-1.5 py-0.5 rounded-full"
                style={{ background: `${service.accent}15`, color: service.accent }}>
                {service.tag}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(service)} className="p-1.5 text-white/25 hover:text-yellow-400 hover:bg-yellow-400/8 rounded-lg transition-all">
            <Pencil size={13} />
          </button>
          <button onClick={() => onDelete(service.id)} className="p-1.5 text-white/25 hover:text-red-400 hover:bg-red-400/8 rounded-lg transition-all">
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <p className="font-poppins text-xs text-white/40 leading-relaxed">{service.desc || 'No description'}</p>
      <div className="flex items-center gap-2 mt-3">
        {service.featured && (
          <span className="flex items-center gap-1 font-poppins text-[9px] text-yellow-400 bg-yellow-400/8 px-2 py-0.5 rounded-full">
            <Star size={9} fill="currentColor" /> Featured
          </span>
        )}
        <span className="font-poppins text-[9px] text-white/20 ml-auto">#{service.order}</span>
      </div>
    </motion.div>
  )
}

export default function ServicesSection() {
  const [services, setServices] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [modal,    setModal]    = useState(null)
  const [saving,   setSaving]   = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [seeding,  setSeeding]  = useState(false)

  useEffect(() => {
    getServices()
      .then(data => setServices(data))
      .catch(err => console.error('Failed to load services:', err))
      .finally(() => setLoading(false))
  }, [])

  /* Auto-seed default services if Firestore is empty */
  const handleSeedDefaults = async () => {
    setSeeding(true)
    try {
      const added = []
      for (const s of DEFAULT_SERVICES) {
        const ref = await addService(s)
        added.push({ id: ref.id, ...s })
      }
      setServices(added)
    } catch (err) {
      console.error('Seed failed:', err)
    }
    setSeeding(false)
  }

  const handleSave = async (data) => {
    setSaving(true)
    try {
      if (modal?.id) {
        await updateService(modal.id, data)
        setServices(prev => prev.map(s => s.id === modal.id ? { ...s, ...data } : s))
      } else {
        const ref = await addService(data)
        setServices(prev => [...prev, { id: ref.id, ...data }])
      }
      setModal(null)
    } catch (err) {
      console.error('Save failed:', err)
    }
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteService(deleteId)
    setServices(prev => prev.filter(s => s.id !== deleteId))
    setDeleteId(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="font-poppins text-xs text-white/35 mt-0.5">
          {services.length} service{services.length !== 1 ? 's' : ''} · Changes reflect on the website after reload
        </p>
        <button
          onClick={() => setModal('add')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-poppins text-sm font-semibold transition-all hover:scale-[1.02]"
          style={{ background: 'linear-gradient(135deg,#fcd34d,#f59e0b)', color: '#030712' }}
        >
          <Plus size={15} /> Add Service
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-7 h-7 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
        </div>
      ) : services.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Sparkles size={28} className="text-white/15 mb-3" />
          <p className="font-poppins text-sm text-white/30 mb-2">No services in Firestore yet</p>
          <p className="font-poppins text-xs text-white/20 mb-5 text-center max-w-xs">
            Load the 8 default services from your website, or add them manually.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleSeedDefaults}
              disabled={seeding}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-poppins text-sm font-semibold disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#fcd34d,#f59e0b)', color: '#030712' }}
            >
              {seeding ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : '⚡ Load Default Services'}
            </button>
            <button onClick={() => setModal('add')} className="px-4 py-2 rounded-xl font-poppins text-sm text-white/40 border border-white/10 hover:bg-white/5">
              Add Manually
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {services.map(s => (
            <ServiceCard key={s.id} service={s} onEdit={setModal} onDelete={setDeleteId} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {(modal === 'add' || (modal && modal !== 'add')) && (
          <ServiceFormModal
            service={modal === 'add' ? null : modal}
            onSave={handleSave}
            onClose={() => setModal(null)}
            saving={saving}
          />
        )}
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="w-full max-w-xs rounded-2xl p-6 text-center"
              style={{ background: '#0a0f1e', border: '1px solid rgba(239,68,68,0.25)' }}>
              <Trash2 size={24} className="text-red-400 mx-auto mb-3" />
              <p className="font-cinzel text-sm font-bold text-white mb-2">Delete Service?</p>
              <p className="font-poppins text-xs text-white/40 mb-5">This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteId(null)} className="flex-1 py-2 rounded-xl font-poppins text-sm text-white/40 border border-white/10">Cancel</button>
                <button onClick={handleDelete} className="flex-1 py-2 rounded-xl font-poppins text-sm text-white bg-red-500 hover:bg-red-600 transition-all">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
