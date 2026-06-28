import { cert, getApps, initializeApp, type App } from "firebase-admin/app";

let firebaseApp: App | null = null;

export function getFirebaseAdmin(): App | null {
  if (firebaseApp) return firebaseApp;
  if (getApps().length > 0) {
    firebaseApp = getApps()[0]!;
    return firebaseApp;
  }

  const projectId = process.env["FIREBASE_PROJECT_ID"];
  const clientEmail = process.env["FIREBASE_CLIENT_EMAIL"];
  const privateKey = process.env["FIREBASE_PRIVATE_KEY"]?.replace(/\\n/g, "\n");

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  firebaseApp = initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
  });

  return firebaseApp;
}

export function isFirebaseConfigured(): boolean {
  return getFirebaseAdmin() !== null;
}
