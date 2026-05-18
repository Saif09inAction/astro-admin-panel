import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Save, Star } from 'lucide-react'
import { getTestimonials, addTestimonial, updateTestimonial, deleteTestimonial } from '../../../firebase/firestore'

const AVATAR_COLORS = ['#f472b6','#60a5fa','#fbbf24','#34d399','#a78bfa','#f97316']

const DEFAULT_TESTIMONIALS = [
  { name: 'Priya Sharma',    location: 'Delhi',     service: 'Love Problem Solution',  text: 'Dheeraj Shastri Ji solved my love problem within 3 days. Truly miraculous results!', rating: 5, color: '#f472b6' },
  { name: 'Rahul Verma',     location: 'Mumbai',    service: 'Career Guidance',         text: 'My career transformed completely after following his guidance. Highly recommended!', rating: 5, color: '#60a5fa' },
  { name: 'Anita Singh',     location: 'Jaipur',    service: 'Marriage Consultation',   text: 'We were facing many obstacles in our marriage. Shastri Ji removed all hurdles.', rating: 5, color: '#fbbf24' },
  { name: 'Vikram Patel',    location: 'Ahmedabad', service: 'Business Problems',       text: 'My business was at a loss for 2 years. After his remedies, everything changed.', rating: 5, color: '#34d399' },
  { name: 'Sunita Gupta',    location: 'Lucknow',   service: 'Ex Love Back',            text: 'My ex came back within a week. I am so grateful to Dheeraj Shastri Ji.', rating: 5, color: '#a78bfa' },
  { name: 'Amit Joshi',      location: 'Pune',      service: 'Kundli Matching',         text: 'The kundli analysis was incredibly accurate and detailed. Very satisfied.', rating: 5, color: '#f97316' },
]

const inputCls = "w-full border border-white/10 rounded-xl px-4 py-2.5 font-poppins text-sm text-white placeholder-white/25 focus:outline-none focus:border-yellow-400/40 transition-all"
const inputStyle = { background: '#0d1628' }

function TestimonialFormModal({ testimonial, onSave, onClose, saving }) {
  const isEdit = !!testimonial?.id
  const [form, setForm] = useState({
    name:     testimonial?.name     || '',
    location: testimonial?.location || '',
    service:  testimonial?.service  || '',
    text:     testimonial?.text     || '',
    rating:   testimonial?.rating   ?? 5,
    color:    testimonial?.color    || AVATAR_COLORS[0],
  })

  const handleSubmit = e => {
    e.preventDefault()
    if (!form.name.trim() || !form.text.trim()) return
    const avatar = (form.name.trim()[0] + (form.name.split(' ')[1]?.[0] || '')).toUpperCase()
    onSave({ ...form, avatar, rating: Number(form.rating) })
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[300] flex items-center justify-center px-4 py-6 overflow-y-auto"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(10px)' }}>
      <motion.div initial={{ scale: 0.92 }} animate={{ scale: 1 }} exit={{ scale: 0.92 }}
        className="w-full max-w-lg rounded-2xl overflow-hidden my-auto"
        style={{ background: '#0a0f1e', border: '1px solid rgba(245,158,11,0.2)' }}>
        <div style={{ height: 2, background: 'linear-gradient(90deg,#a78bfa,#fbbf24)' }} />
        <div className="px-6 py-5">
          <div className="flex items-center justify-between mb-5">
            <p className="font-cinzel text-base font-bold text-white">{isEdit ? 'Edit Testimonial' : 'Add Testimonial'}</p>
            <button onClick={onClose} className="text-white/30 hover:text-white"><X size={18} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-poppins text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">Client Name *</label>
                <input className={inputCls} style={inputStyle} placeholder="Priya Sharma" value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div>
                <label className="font-poppins text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">Location</label>
                <input className={inputCls} style={inputStyle} placeholder="Delhi" value={form.location}
                  onChange={e => setForm(p => ({ ...p, location: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="font-poppins text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">Service</label>
              <input className={inputCls} style={inputStyle} placeholder="Love Problem Solution" value={form.service}
                onChange={e => setForm(p => ({ ...p, service: e.target.value }))} />
            </div>
            <div>
              <label className="font-poppins text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">Testimonial *</label>
              <textarea className={`${inputCls} resize-none`} style={inputStyle} rows={3} placeholder="Write the client's testimonial here…"
                value={form.text} onChange={e => setForm(p => ({ ...p, text: e.target.value }))} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="font-poppins text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">Rating (1–5)</label>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(n => (
                    <button key={n} type="button" onClick={() => setForm(p => ({ ...p, rating: n }))}>
                      <Star size={20} fill={n <= form.rating ? '#f59e0b' : 'none'} className={n <= form.rating ? 'text-gold-400' : 'text-white/20'} />
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="font-poppins text-[10px] text-white/40 uppercase tracking-wider mb-2 block">Avatar Color</label>
                <div className="flex flex-wrap gap-1.5">
                  {AVATAR_COLORS.map(c => (
                    <button key={c} type="button" onClick={() => setForm(p => ({ ...p, color: c }))}
                      className="w-6 h-6 rounded-full border-2 transition-all"
                      style={{ background: c, borderColor: form.color === c ? '#fff' : 'transparent', transform: form.color === c ? 'scale(1.3)' : 'scale(1)' }} />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl font-poppins text-sm text-white/40 border border-white/10 hover:bg-white/5 transition-all">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-poppins text-sm font-semibold disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#fcd34d,#f59e0b)', color: '#030712' }}>
                {saving ? <div className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" /> : <><Save size={14} />{isEdit ? 'Save' : 'Add'}</>}
              </button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  )
}

function TestimonialCard({ t, onEdit, onDelete }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="relative rounded-2xl p-4 group"
      style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${t.color}20` }}>
      <div className="absolute top-0 left-0 right-0 h-px"
        style={{ background: `linear-gradient(90deg,transparent,${t.color}50,transparent)` }} />
      {/* Actions */}
      <div className="absolute top-3 right-3 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button onClick={() => onEdit(t)} className="p-1.5 text-white/20 hover:text-gold-400 hover:bg-gold-400/8 rounded-lg transition-all">
          <Pencil size={12} />
        </button>
        <button onClick={() => onDelete(t.id)} className="p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/8 rounded-lg transition-all">
          <Trash2 size={12} />
        </button>
      </div>
      {/* Stars */}
      <div className="flex gap-0.5 mb-3">
        {Array.from({ length: t.rating || 5 }).map((_, i) => (
          <Star key={i} size={11} fill="#f59e0b" className="text-gold-400" />
        ))}
      </div>
      {/* Text */}
      <p className="font-poppins text-xs text-white/60 leading-relaxed italic mb-4">"{t.text}"</p>
      {/* Avatar row */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full flex items-center justify-center font-cinzel text-[11px] font-bold text-white"
          style={{ background: `linear-gradient(135deg,${t.color}90,${t.color}30)` }}>
          {t.avatar || t.name?.[0]}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-cinzel text-xs font-bold text-white truncate">{t.name}</p>
          <p className="font-poppins text-[9px] text-white/30">{t.location}</p>
        </div>
        <span className="font-poppins text-[9px] px-2 py-0.5 rounded-full shrink-0"
          style={{ background: `${t.color}12`, color: t.color }}>
          {t.service}
        </span>
      </div>
    </motion.div>
  )
}

export default function TestimonialsSection() {
  const [testimonials, setTestimonials] = useState([])
  const [loading,      setLoading]      = useState(true)
  const [modal,        setModal]        = useState(null)
  const [saving,       setSaving]       = useState(false)
  const [deleteId,     setDeleteId]     = useState(null)
  const [seeding,      setSeeding]      = useState(false)

  useEffect(() => {
    getTestimonials()
      .then(setTestimonials)
      .catch(err => console.error('Failed to load testimonials:', err))
      .finally(() => setLoading(false))
  }, [])

  const handleSeedDefaults = async () => {
    setSeeding(true)
    try {
      const added = []
      for (const t of DEFAULT_TESTIMONIALS) {
        const avatar = (t.name[0] + (t.name.split(' ')[1]?.[0] || '')).toUpperCase()
        const ref = await addTestimonial({ ...t, avatar })
        added.push({ id: ref.id, ...t, avatar })
      }
      setTestimonials(added)
    } catch (err) {
      console.error('Seed failed:', err)
    }
    setSeeding(false)
  }

  const handleSave = async data => {
    setSaving(true)
    try {
      if (modal?.id) {
        await updateTestimonial(modal.id, data)
        setTestimonials(prev => prev.map(t => t.id === modal.id ? { ...t, ...data } : t))
      } else {
        const ref = await addTestimonial(data)
        setTestimonials(prev => [{ id: ref.id, ...data }, ...prev])
      }
      setModal(null)
    } catch {}
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!deleteId) return
    await deleteTestimonial(deleteId)
    setTestimonials(prev => prev.filter(t => t.id !== deleteId))
    setDeleteId(null)
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="font-poppins text-xs text-white/35">
          {testimonials.length} review{testimonials.length !== 1 ? 's' : ''} · Changes reflect on website after reload
        </p>
        <button onClick={() => setModal('add')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl font-poppins text-sm font-semibold hover:scale-[1.02] transition-all"
          style={{ background: 'linear-gradient(135deg,#fcd34d,#f59e0b)', color: '#030712' }}>
          <Plus size={15} /> Add Review
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-7 h-7 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="flex flex-col items-center py-16 rounded-2xl"
          style={{ background: 'rgba(255,255,255,0.015)', border: '1px solid rgba(255,255,255,0.05)' }}>
          <Star size={28} className="text-white/15 mb-3" />
          <p className="font-poppins text-sm text-white/30 mb-2">No testimonials in Firestore yet</p>
          <p className="font-poppins text-xs text-white/20 mb-5 text-center max-w-xs">
            Load 6 sample reviews from the website, or add them manually.
          </p>
          <div className="flex gap-3">
            <button
              onClick={handleSeedDefaults}
              disabled={seeding}
              className="flex items-center gap-2 px-4 py-2 rounded-xl font-poppins text-sm font-semibold disabled:opacity-60"
              style={{ background: 'linear-gradient(135deg,#fcd34d,#f59e0b)', color: '#030712' }}
            >
              {seeding ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : '⚡ Load Sample Reviews'}
            </button>
            <button onClick={() => setModal('add')} className="px-4 py-2 rounded-xl font-poppins text-sm text-white/40 border border-white/10 hover:bg-white/5">
              Add Manually
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {testimonials.map(t => (
            <TestimonialCard key={t.id} t={t} onEdit={setModal} onDelete={setDeleteId} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {(modal === 'add' || (modal && modal !== 'add')) && (
          <TestimonialFormModal testimonial={modal === 'add' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} saving={saving} />
        )}
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[300] flex items-center justify-center px-4"
            style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
            <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="w-full max-w-xs rounded-2xl p-6 text-center"
              style={{ background: '#0a0f1e', border: '1px solid rgba(239,68,68,0.25)' }}>
              <Star size={24} className="text-red-400 mx-auto mb-3" />
              <p className="font-cinzel text-sm font-bold text-white mb-2">Delete Review?</p>
              <div className="flex gap-3 mt-5">
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
