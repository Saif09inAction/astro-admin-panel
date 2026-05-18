import { useState, useEffect } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase/config'
import AdminLogin     from './components/admin/AdminLogin'
import AdminDashboard from './components/admin/AdminDashboard'

function Spinner() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#030712' }}>
      <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  const [user,     setUser]     = useState(null)
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      setUser(u)
      setChecking(false)
    })
    return unsub
  }, [])

  if (checking) return <Spinner />
  return user ? <AdminDashboard /> : <AdminLogin />
}
