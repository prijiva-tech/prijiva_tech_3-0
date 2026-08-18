/**
 * ====================================================================
 * PRIJIVA - FIREBASE CLIENT CONFIGURATION & DATA LAYER
 * Authentication & Cloud Firestore Methods
 * ====================================================================
 */

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import {
  getFirestore,
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// Web app Firebase configuration (Zero secret keys stored)
const firebaseConfig = {
  apiKey: "AIzaSyBYyTSkvh3fZfQRfSzMKtscquOwvxIPZDQ",
  authDomain: "prijiva-v3.firebaseapp.com",
  projectId: "prijiva-v3",
  storageBucket: "prijiva-v3.firebasestorage.app",
  messagingSenderId: "1020692427568",
  appId: "1:1020692427568:web:bd95974151a422f549cef5",
  measurementId: "G-XMEQLH8GD0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

/**
 * Sign in admin user with email and password
 */
export async function signInAdmin(email, password) {
  return signInWithEmailAndPassword(auth, email, password);
}

/**
 * Sign out current admin user
 */
export async function signOutAdmin() {
  return signOut(auth);
}

/**
 * Subscribe to auth state changes
 */
export function onAuthStateChange(callback) {
  return onAuthStateChanged(auth, callback);
}

/**
 * Check if a user is an approved, active admin in Firestore
 * Looks up /admins/{uid} and asserts active === true
 */
export async function checkAdminStatus(uid) {
  try {
    const adminDocRef = doc(db, "admins", uid);
    const adminDocSnap = await getDoc(adminDocRef);

    if (adminDocSnap.exists()) {
      const data = adminDocSnap.data();
      if (data.active === true) {
        return {
          isApproved: true,
          adminData: data
        };
      }
    }
    return {
      isApproved: false,
      adminData: null
    };
  } catch (error) {
    console.error("Error verifying admin approval:", error);
    return {
      isApproved: false,
      adminData: null,
      error
    };
  }
}

/**
 * Public Query: Fetch all events where status == 'published'
 */
export async function getPublishedEvents() {
  try {
    const eventsRef = collection(db, "events");
    const q = query(
      eventsRef,
      where("status", "==", "published")
    );
    const querySnapshot = await getDocs(q);
    const events = [];
    querySnapshot.forEach((docSnap) => {
      events.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });
    return events;
  } catch (error) {
    console.warn("Firestore public event fetch fallback:", error);
    return null;
  }
}

/**
 * Public Query: Fetch single published event by ID
 */
export async function getPublishedEventById(eventId) {
  try {
    const eventDocRef = doc(db, "events", eventId);
    const eventDocSnap = await getDoc(eventDocRef);
    if (eventDocSnap.exists()) {
      const data = eventDocSnap.data();
      if (data.status === "published") {
        return {
          id: eventDocSnap.id,
          ...data
        };
      }
    }
    return null;
  } catch (error) {
    console.warn("Firestore single event fetch fallback:", error);
    return null;
  }
}

/**
 * Admin Query: Fetch all events for the dashboard (All statuses)
 */
export async function getAllAdminEvents() {
  try {
    const eventsRef = collection(db, "events");
    const q = query(eventsRef);
    const querySnapshot = await getDocs(q);
    const events = [];
    querySnapshot.forEach((docSnap) => {
      events.push({
        id: docSnap.id,
        ...docSnap.data()
      });
    });
    return events;
  } catch (error) {
    console.error("Error fetching admin events:", error);
    throw error;
  }
}

/**
 * Create a new event document in Firestore
 */
export async function createEvent(eventData, adminInfo) {
  const eventsRef = collection(db, "events");
  const payload = {
    ...eventData,
    status: eventData.status || "draft",
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: {
      uid: adminInfo.uid,
      email: adminInfo.email,
      name: adminInfo.name || "Department Head"
    }
  };
  return addDoc(eventsRef, payload);
}

/**
 * Update an existing event document
 */
export async function updateEvent(eventId, eventData) {
  const eventDocRef = doc(db, "events", eventId);
  const payload = {
    ...eventData,
    updatedAt: serverTimestamp()
  };
  return updateDoc(eventDocRef, payload);
}

/**
 * Delete an event document
 */
export async function deleteEvent(eventId) {
  const eventDocRef = doc(db, "events", eventId);
  return deleteDoc(eventDocRef);
}

/**
 * Get current authenticated user's Firebase ID Token
 */
export async function getCurrentUserToken() {
  if (auth.currentUser) {
    return auth.currentUser.getIdToken(true);
  }
  return null;
}

// Configurable Cloudflare Worker Signer URL
window.PRIJIVA_WORKER_URL = window.PRIJIVA_WORKER_URL || "https://prijiva-upload-signer.prijivatech.workers.dev";

// Global registry for standard script access
window.PriJivaFirebase = window.PrijivaFirebase = {
  app,
  auth,
  db,
  signInAdmin,
  signOutAdmin,
  onAuthStateChange,
  getCurrentUserToken,
  checkAdminStatus,
  getPublishedEvents,
  getPublishedEventById,
  getAllAdminEvents,
  createEvent,
  updateEvent,
  deleteEvent
};
