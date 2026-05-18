import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
  apiKey: "AIzaSyBcXCareWPVkQKHleZBEa3Y9Hhj8Z0a7oY",
  authDomain: "astrology-3add3.firebaseapp.com",
  projectId: "astrology-3add3",
  storageBucket: "astrology-3add3.firebasestorage.app",
  messagingSenderId: "714650127897",
  appId: "1:714650127897:web:7c17f983e85d40b9eda488",
  measurementId: "G-7SQJK4TV34",
}

const app = initializeApp(firebaseConfig)
export const db  = getFirestore(app)
export const auth = getAuth(app)
export default app
