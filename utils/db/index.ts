import admin from "firebase-admin";
import serviceAccount from "./serviceAccountKey.json";

const serviceAccountCred: any = serviceAccount;
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccountCred),
    });
  } catch (error: any) {
    console.log("Firebase admin initialization error", error.stack);
  }
}

export default admin.firestore();
