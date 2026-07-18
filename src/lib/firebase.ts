import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

/** True once real Firebase project keys are supplied via env vars — cloud sync stays off until then. */
export const isCloudSyncConfigured = Boolean(config.apiKey && config.projectId && config.appId);

// The Firebase SDK is ~500KB, so it's only ever fetched (dynamic import) when cloud sync is
// configured AND actually used — pilots who never set this up pay zero bundle cost for it.

let appPromise: Promise<FirebaseApp> | null = null;

async function getApp(): Promise<FirebaseApp> {
  if (!appPromise) {
    appPromise = import("firebase/app").then(({ initializeApp }) => initializeApp(config));
  }
  return appPromise;
}

export async function getFirebaseAuth(): Promise<Auth> {
  const [{ getAuth }, app] = await Promise.all([import("firebase/auth"), getApp()]);
  return getAuth(app);
}

export async function getFirebaseDb(): Promise<Firestore> {
  const [{ getFirestore }, app] = await Promise.all([import("firebase/firestore"), getApp()]);
  return getFirestore(app);
}
