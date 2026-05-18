import { useState } from 'react'
import { motion } from 'framer-motion'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../firebase/config'
import { Star, Lock, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [show, setShow] = useState(false)

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, form.email, form.password)
      onLogin?.()
    } catch (err) {
      setError('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-navy-950 flex items-center justify-center px-4"
      style={{ background: 'radial-gradient(ellipse at center, #0f1729 0%, #030712 70%)' }}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full border border-gold-400/50 flex items-center justify-center mx-auto mb-4"
            style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.1) 0%, transparent 70%)' }}>
            <Star size={24} className="text-gold-400" fill="#f59e0b" />
          </div>
          <h1 className="font-cinzel text-2xl font-bold text-white">Admin Panel</h1>
          <p className="font-poppins text-sm text-white/40 mt-1">Pandit Ji Vedic Astrology</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="glass border border-white/8 rounded-3xl p-8 space-y-5"
        >
          <div>
            <label className="font-poppins text-xs text-white/50 uppercase tracking-wider mb-2 block">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
              placeholder="admin@panditji.com"
              required
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-poppins text-sm text-white placeholder-white/25 focus:outline-none focus:border-gold-400/50 focus:bg-gold-400/5 transition-all"
            />
          </div>

          <div>
            <label className="font-poppins text-xs text-white/50 uppercase tracking-wider mb-2 block">Password</label>
            <div className="relative">
              <input
                type={show ? 'text' : 'password'}
                value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                placeholder="••••••••"
                required
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 font-poppins text-sm text-white placeholder-white/25 focus:outline-none focus:border-gold-400/50 focus:bg-gold-400/5 transition-all pr-11"
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors"
              >
                {show ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="font-poppins text-xs text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg px-4 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-gold-400 to-gold-500 text-navy-950 font-poppins font-semibold py-3.5 rounded-xl text-sm hover:shadow-xl hover:shadow-gold-500/25 transition-all hover:scale-[1.01] disabled:opacity-60"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-navy-950/30 border-t-navy-950 rounded-full animate-spin" />
            ) : (
              <>
                <Lock size={16} />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="text-center font-poppins text-xs text-white/20 mt-6">
          Secure admin access only. Unauthorized access is prohibited.
        </p>
      </motion.div>
    </div>
  )
}
