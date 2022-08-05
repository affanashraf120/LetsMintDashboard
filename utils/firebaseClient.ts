import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import FirebaseCredentials from "./firebaseCredentials";

const apps = getApps();
if (!apps.length) {
  initializeApp(FirebaseCredentials);
}

export const auth = getAuth();
