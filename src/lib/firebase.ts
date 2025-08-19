import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import {
  getAuth,
  setPersistence,
  browserLocalPersistence,
  signInAnonymously,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  connectFirestoreEmulator,
  collection,
  type Firestore,
} from "firebase/firestore";

// ---- Config (from Vite env) -------------------------------------------------
const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY as string,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN as string,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID as string,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET as string, // usually "<projectId>.appspot.com"
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID as string,
  appId: import.meta.env.VITE_FIREBASE_APP_ID as string,
};
// Optional emulator flags (set in .env.local if you use emulators)
const USE_EMULATORS = import.meta.env.VITE_USE_FIREBASE_EMULATORS === "1";
const EMULATOR_HOST = import.meta.env.VITE_FIRESTORE_EMULATOR_HOST ?? "localhost";
const EMULATOR_PORT = Number(import.meta.env.VITE_FIRESTORE_EMULATOR_PORT ?? 8080);

// ---- App singletons ----------------------------------------------------------
export const app: FirebaseApp =
  getApps().length > 0 ? getApps()[0] : initializeApp(cfg);

export const auth = getAuth(app);
export const db: Firestore = getFirestore(app);

// Hook up emulators in dev if desired
if (USE_EMULATORS) {
  try {
    connectFirestoreEmulator(db, EMULATOR_HOST, EMULATOR_PORT);
    // If you also spin up the Auth emulator, uncomment below:
    // import { connectAuthEmulator } from "firebase/auth";
    // connectAuthEmulator(auth, `http://${EMULATOR_HOST}:9099`, { disableWarnings: true });
    // console.info("[firebase] Using emulators");
  } catch {
    // no-op if already connected
  }
}

// Persist anon session across reloads (non-blocking)
setPersistence(auth, browserLocalPersistence).catch(() => {});

// ---- ensureAnon(): one-shot login helper ------------------------------------
let anonReady: Promise<User | null> | null = null;

/** Ensures there's an authenticated (anonymous) user.
 *  Returns the current user (or null if unavailable in non-browser env). */
export async function ensureAnon(): Promise<User | null> {
  if (typeof window === "undefined") return null; // SSR/Node: skip
  if (auth.currentUser) return auth.currentUser;

  if (!anonReady) {
    anonReady = new Promise<User | null>((resolve, reject) => {
      const unsub = onAuthStateChanged(
        auth,
        (u) => {
          if (u) {
            unsub();
            resolve(u);
          } else {
            // Not signed in yet → sign in anonymously
            signInAnonymously(auth)
              .then((cred) => {
                unsub();
                resolve(cred.user);
              })
              .catch((err) => {
                unsub();
                reject(err);
              });
          }
        },
        (err) => {
          reject(err);
        }
      );
    }).catch((e) => {
      // Reset so next call can retry
      anonReady = null;
      throw e;
    });
  }
  return anonReady;
}

// ---- Optional: light helpers you’ll reuse -----------------------------------
export const boardsCol = () => collection(db, "boards");
export const winsCol = (boardId: string) => collection(db, "boards", boardId, "wins");

// ---- Optional: analytics (only when supported / not in dev tools) ----------
/* 
import { getAnalytics, isSupported } from "firebase/analytics";
if (typeof window !== "undefined") {
  isSupported().then((ok) => ok && getAnalytics(app));
}
*/

export default { app, auth, db, ensureAnon, boardsCol, winsCol };