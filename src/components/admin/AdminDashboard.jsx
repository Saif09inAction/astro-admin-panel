import { useState, useEffect, useCallback } from 'react'
import AdminLayout from './AdminLayout'
import OverviewSection      from './sections/OverviewSection'
import LeadsSection         from './sections/LeadsSection'
import ServicesSection      from './sections/ServicesSection'
import TestimonialsSection  from './sections/TestimonialsSection'
import SettingsSection      from './sections/SettingsSection'
import { getLeads } from '../../firebase/firestore'

const SECTION_META = {
  overview:     { title: 'Overview',      subtitle: 'Dashboard summary' },
  leads:        { title: 'Lead Management', subtitle: 'View, search, and update leads' },
  services:     { title: 'Services',       subtitle: 'Manage your service offerings' },
  testimonials: { title: 'Testimonials',   subtitle: 'Manage client reviews' },
  settings:     { title: 'Settings',       subtitle: 'Configure website details' },
}

export default function AdminDashboard() {
  const [section,    setSection]    = useState('overview')
  const [leads,      setLeads]      = useState([])
  const [loading,    setLoading]    = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchLeads = useCallback(async () => {
    setRefreshing(true)
    try { setLeads(await getLeads()) } catch {}
    setRefreshing(false)
    setLoading(false)
  }, [])

  useEffect(() => { fetchLeads() }, [fetchLeads])

  const meta = SECTION_META[section] || SECTION_META.overview

  return (
    <AdminLayout
      active={section}
      onNavigate={setSection}
      title={meta.title}
      subtitle={meta.subtitle}
      onRefresh={section === 'overview' || section === 'leads' ? fetchLeads : undefined}
      refreshing={refreshing}
    >
      {loading && (section === 'overview' || section === 'leads') ? (
        <div className="flex items-center justify-center h-48">
          <div className="w-8 h-8 border-2 border-gold-400/30 border-t-gold-400 rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {section === 'overview'     && <OverviewSection leads={leads} />}
          {section === 'leads'        && <LeadsSection leads={leads} onLeadsChange={setLeads} />}
          {section === 'services'     && <ServicesSection />}
          {section === 'testimonials' && <TestimonialsSection />}
          {section === 'settings'     && <SettingsSection />}
        </>
      )}
    </AdminLayout>
  )
}
