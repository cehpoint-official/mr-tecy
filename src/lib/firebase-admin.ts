import "server-only";
import { initializeApp, getApps, cert, getApp, App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

let app: App;

if (!getApps().length) {
    if (!serviceAccount) {
        throw new Error(
            "FIREBASE_SERVICE_ACCOUNT_KEY is not configured. " +
            "Please add it to your .env.local file. " +
            "Get it from Firebase Console > Project Settings > Service Accounts > Generate New Private Key"
        );
    }

    app = initializeApp({
        credential: cert(serviceAccount),
    });
} else {
    app = getApp();
}

export const adminDb = getFirestore(app);
