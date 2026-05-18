import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, CheckCircle, Phone, MessageCircle, Clock, Type, Info } from 'lucide-react'
import { getSettings, saveSettings } from '../../../firebase/firestore'
import { PHONE_DISPLAY, PHONE_RAW, WHATSAPP_BASE, PANDIT_NAME } from '../../../constants'

const inputCls = "w-full bg-white/4 border border-white/10 rounded-xl px-4 py-3 font-poppins text-sm text-white placeholder-white/25 focus:outline-none focus:border-gold-400/30 transition-all"

function SettingsGroup({ title, icon: Icon, children }) {
  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
        <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)' }}>
          <Icon size={14} className="text-gold-400" />
        </div>
        <p className="font-cinzel text-sm font-bold text-white">{title}</p>
      </div>
      <div className="px-5 py-5 space-y-4">{children}</div>
    </div>
  )
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="font-poppins text-[10px] text-white/40 uppercase tracking-wider mb-1.5 block">{label}</label>
      {children}
      {hint && <p className="font-poppins text-[10px] text-white/25 mt-1 leading-relaxed">{hint}</p>}
    </div>
  )
}

export default function SettingsSection() {
  const [form, setForm] = useState({
    panditName:   PANDIT_NAME,
    phoneRaw:     PHONE_RAW,
    phoneDisplay: PHONE_DISPLAY,
    whatsappBase: WHATSAPP_BASE,
    hours:        '8 AM – 9 PM IST, 7 Days',
    ctaText:      'Free WhatsApp Consultation',
    consultText:  'I need your consultation.',
  })
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  useEffect(() => {
    getSettings()
      .then(data => { if (data) setForm(p => ({ ...p, ...data })) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const set = (key) => (e) => setForm(p => ({ ...p, [key]: e.target.value }))

  const handleSave = async e => {
    e.preventDefault()
    setSaving(true)
    try {
      // Keep phoneTel and whatsappBase in sync
      const phoneTel     = `tel:+${form.phoneRaw.replace(/\D/g,'')}`
      const whatsappBase = `https://wa.me/${form.phoneRaw.replace(/\D/g,'')}`
      await saveSettings({ ...form, phoneTel, whatsappBase })
      setForm(p => ({ ...p, phoneTel, whatsappBase }))
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch {}
    setSaving(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="w-7 h-7 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
    </div>
  )

  return (
    <form onSubmit={handleSave} className="space-y-5 max-w-2xl">

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl px-4 py-3" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
        <Info size={14} className="text-gold-400 shrink-0 mt-0.5" />
        <p className="font-poppins text-xs text-white/50 leading-relaxed">
          Settings are stored in Firebase and loaded by the website on every visit. Changes go live for new visitors immediately.
        </p>
      </div>

      {/* Contact settings */}
      <SettingsGroup title="Contact Details" icon={Phone}>
        <Field label="Pandit Ji's Name" hint="Displayed across the website">
          <input className={inputCls} value={form.panditName} onChange={set('panditName')} />
        </Field>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="WhatsApp / Phone Number (digits only)"
            hint="e.g. 917257857609 — include country code, no + or spaces">
            <div className="relative">
              <MessageCircle size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
              <input className={`${inputCls} pl-9`} value={form.phoneRaw} onChange={set('phoneRaw')}
                placeholder="917257857609" />
            </div>
          </Field>
          <Field label="Display Number" hint="Shown on buttons and contact cards">
            <div className="relative">
              <Phone size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
              <input className={`${inputCls} pl-9`} value={form.phoneDisplay} onChange={set('phoneDisplay')}
                placeholder="+91 72578 57609" />
            </div>
          </Field>
        </div>
        <Field label="Business Hours" hint="Shown in footer and contact section">
          <div className="relative">
            <Clock size={13} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/25" />
            <input className={`${inputCls} pl-9`} value={form.hours} onChange={set('hours')}
              placeholder="8 AM – 9 PM IST, 7 Days" />
          </div>
        </Field>
      </SettingsGroup>

      {/* CTA settings */}
      <SettingsGroup title="Call-to-Action Text" icon={Type}>
        <Field label="Primary CTA Button Text" hint="Used on the main WhatsApp consultation button">
          <input className={inputCls} value={form.ctaText} onChange={set('ctaText')}
            placeholder="Free WhatsApp Consultation" />
        </Field>
        <Field label="WhatsApp Pre-filled Message Suffix"
          hint='After the service name. e.g. "Hello Pandit Ji, I need consultation regarding Love Problem Solution. [your text]"'>
          <textarea className={`${inputCls} resize-none`} rows={2} value={form.consultText} onChange={set('consultText')}
            placeholder="I need your consultation." />
        </Field>
      </SettingsGroup>

      {/* Preview */}
      <div className="rounded-2xl px-5 py-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="font-poppins text-[10px] text-white/30 uppercase tracking-wider mb-3">WhatsApp Message Preview</p>
        <p className="font-poppins text-sm text-white/60 leading-relaxed">
          "Hello <span className="text-gold-400">{form.panditName}</span>, I need consultation regarding <span className="text-purple-300">[Service Name]</span>. {form.consultText}"
        </p>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-poppins text-sm font-semibold disabled:opacity-60 transition-all hover:scale-[1.02]"
          style={{ background: 'linear-gradient(135deg,#fcd34d,#f59e0b)', color: '#030712' }}
        >
          {saving ? (
            <div className="w-4 h-4 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
          ) : (
            <><Save size={15} /> Save Settings</>
          )}
        </button>

        {saved && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1.5 text-emerald-400"
          >
            <CheckCircle size={15} />
            <span className="font-poppins text-sm">Saved!</span>
          </motion.div>
        )}
      </div>
    </form>
  )
}
