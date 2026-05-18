import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Save, CheckCircle, Phone, MessageCircle, Info, AlertCircle } from 'lucide-react'
import { getSettings, saveSettings } from '../../../firebase/firestore'

export default function SettingsSection() {
  const [phoneRaw, setPhoneRaw] = useState('')
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [error,    setError]    = useState('')

  useEffect(() => {
    getSettings()
      .then(data => {
        if (data?.phoneRaw) setPhoneRaw(data.phoneRaw)
        else setPhoneRaw('917257857609') // default
      })
      .catch(() => setPhoneRaw('917257857609'))
      .finally(() => setLoading(false))
  }, [])

  const digits = phoneRaw.replace(/\D/g, '')
  const isValid = digits.length >= 10 && digits.length <= 15
  const previewWhatsApp = `https://wa.me/${digits}`
  const previewCall     = `tel:+${digits}`
  const previewDisplay  = digits.length === 12
    ? `+${digits.slice(0,2)} ${digits.slice(2,7)} ${digits.slice(7)}`
    : `+${digits}`

  const handleSave = async e => {
    e.preventDefault()
    if (!isValid) { setError('Enter a valid number with country code (10–15 digits, no + or spaces)'); return }
    setError('')
    setSaving(true)
    try {
      await saveSettings({
        phoneRaw:     digits,
        phoneDisplay: previewDisplay,
        phoneTel:     previewCall,
        whatsappBase: previewWhatsApp,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      console.error('Save failed:', err)
      setError('Failed to save. Check your internet connection.')
    }
    setSaving(false)
  }

  if (loading) return (
    <div className="flex items-center justify-center py-16">
      <div className="w-7 h-7 border-2 border-yellow-400/30 border-t-yellow-400 rounded-full animate-spin" />
    </div>
  )

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-xl">

      {/* Info banner */}
      <div className="flex items-start gap-3 rounded-xl px-4 py-3"
        style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.15)' }}>
        <Info size={14} className="text-yellow-400 shrink-0 mt-0.5" />
        <p className="font-poppins text-xs text-white/50 leading-relaxed">
          Update the mobile number below. All WhatsApp buttons and call links on the website will automatically use the new number.
        </p>
      </div>

      {/* Phone input card */}
      <div className="rounded-2xl overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.1)' }}>
            <Phone size={14} className="text-yellow-400" />
          </div>
          <p className="font-cinzel text-sm font-bold text-white">Mobile Number</p>
        </div>
        <div className="px-5 py-5 space-y-5">
          <div>
            <label className="font-poppins text-[10px] text-white/40 uppercase tracking-wider mb-2 block">
              WhatsApp / Call Number (digits only, include country code)
            </label>
            <div className="relative">
              <MessageCircle size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30 pointer-events-none" />
              <input
                type="tel"
                value={phoneRaw}
                onChange={e => { setPhoneRaw(e.target.value.replace(/[^\d]/g, '')); setError('') }}
                placeholder="917257857609"
                maxLength={15}
                className="w-full border rounded-xl pl-9 pr-4 py-3 font-poppins text-base font-semibold text-white placeholder-white/20 focus:outline-none transition-all"
                style={{
                  background: '#0d1628',
                  borderColor: error ? 'rgba(239,68,68,0.4)' : isValid && digits.length > 0 ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)',
                  letterSpacing: '0.05em',
                }}
              />
            </div>
            <p className="font-poppins text-[10px] text-white/25 mt-1.5">
              Include country code — no +, spaces, or dashes. Example: <span className="text-white/40">917257857609</span> (India)
            </p>
            {error && (
              <div className="flex items-center gap-2 mt-2">
                <AlertCircle size={12} className="text-red-400" />
                <p className="font-poppins text-xs text-red-400">{error}</p>
              </div>
            )}
          </div>

          {/* Live preview */}
          {digits.length >= 10 && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl p-4 space-y-2.5"
              style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.12)' }}
            >
              <p className="font-poppins text-[10px] text-white/30 uppercase tracking-wider mb-3">Live Preview</p>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(34,197,94,0.12)' }}>
                  <MessageCircle size={12} className="text-green-400" />
                </div>
                <div>
                  <p className="font-poppins text-[10px] text-white/30 uppercase tracking-wider">WhatsApp Link</p>
                  <p className="font-poppins text-xs text-green-400 font-medium">{previewWhatsApp}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(96,165,250,0.12)' }}>
                  <Phone size={12} className="text-blue-400" />
                </div>
                <div>
                  <p className="font-poppins text-[10px] text-white/30 uppercase tracking-wider">Call Link</p>
                  <p className="font-poppins text-xs text-blue-400 font-medium">{previewCall}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'rgba(245,158,11,0.12)' }}>
                  <Phone size={12} className="text-yellow-400" />
                </div>
                <div>
                  <p className="font-poppins text-[10px] text-white/30 uppercase tracking-wider">Display Number</p>
                  <p className="font-poppins text-xs text-yellow-400 font-medium">{previewDisplay}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={saving || !isValid}
          className="flex items-center gap-2 px-7 py-3 rounded-xl font-poppins text-sm font-semibold disabled:opacity-50 transition-all hover:scale-[1.02]"
          style={{ background: 'linear-gradient(135deg,#fcd34d,#f59e0b)', color: '#030712' }}
        >
          {saving
            ? <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            : <><Save size={15} /> Save Number</>}
        </button>

        {saved && (
          <motion.div
            initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-1.5 text-emerald-400"
          >
            <CheckCircle size={15} />
            <span className="font-poppins text-sm">Saved! All links updated.</span>
          </motion.div>
        )}
      </div>
    </form>
  )
}
