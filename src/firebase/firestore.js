import { db } from './config'
import {
  collection, addDoc, getDocs, getDoc, setDoc, updateDoc, deleteDoc,
  doc, serverTimestamp, query, orderBy, where, limit
} from 'firebase/firestore'

/* ─────────────────────────────────────────────
   LEADS
───────────────────────────────────────────── */
export async function submitLead(data) {
  const docRef = await addDoc(collection(db, 'leads'), {
    ...data,
    status: 'new',
    createdAt: serverTimestamp(),
  })
  return docRef
}

export async function getLeads() {
  const q = query(collection(db, 'leads'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function updateLeadStatus(id, status) {
  return updateDoc(doc(db, 'leads', id), { status })
}

export async function deleteLead(id) {
  return deleteDoc(doc(db, 'leads', id))
}

/* ─────────────────────────────────────────────
   SERVICES
───────────────────────────────────────────── */
export async function getServices() {
  const q = query(collection(db, 'services'), orderBy('order', 'asc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function addService(data) {
  return addDoc(collection(db, 'services'), { ...data, createdAt: serverTimestamp() })
}

export async function updateService(id, data) {
  return updateDoc(doc(db, 'services', id), data)
}

export async function deleteService(id) {
  return deleteDoc(doc(db, 'services', id))
}

/* ─────────────────────────────────────────────
   TESTIMONIALS
───────────────────────────────────────────── */
export async function getTestimonials() {
  const q = query(collection(db, 'testimonials'), orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function addTestimonial(data) {
  return addDoc(collection(db, 'testimonials'), { ...data, createdAt: serverTimestamp() })
}

export async function updateTestimonial(id, data) {
  return updateDoc(doc(db, 'testimonials', id), data)
}

export async function deleteTestimonial(id) {
  return deleteDoc(doc(db, 'testimonials', id))
}

/* ─────────────────────────────────────────────
   SETTINGS (single doc: settings/main)
───────────────────────────────────────────── */
export async function getSettings() {
  const snap = await getDoc(doc(db, 'settings', 'main'))
  return snap.exists() ? snap.data() : null
}

export async function saveSettings(data) {
  return setDoc(doc(db, 'settings', 'main'), data, { merge: true })
}
