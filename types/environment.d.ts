namespace NodeJS {
  interface ProcessEnv extends NodeJS.ProcessEnv {
    TWITTER_ID: string;
    TWITTER_SECRET: string;
    NEXTAUTH_SECRET: string;
    NEXTAUTH_URL: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    SECRET: string;
    TWITTER_CONSUMER_KEY: string;
    TWITTER_CONSUMER_SECRET: string;
    TWITTER_CONSUMER_TOKEN: string;
    DISCORD_CLIENT_ID: string;
    DISCORD_CLIENT_SECRET: string;
    DISCORD_TOKEN: string;
    DISCORD_AUTH_URL: string;
    JWT_SECRET: string;
    SCSTwitterID: string;
    SCDiscordID: string;
    NEXT_PUBLIC_FIREBASE_PUBLIC_API_KEY: string;
    NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string;
    NEXT_PUBLIC_FIREBASE_PROJECT_ID: string;
    NEXT_PUBLIC_FIREBASE_DATABASE_URL: string;
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string;
    NEXT_PUBLIC_FIREBASE_SENDER_ID: string;
    NEXT_PUBLIC_FIREBASE_APP_ID: string;
    NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID: string;
  }
}

// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyCE2SFChFE1WvKpL2GFKUfCSTrZPfPbGJI",
//   authDomain: "testro-97c3f.firebaseapp.com",
//   databaseURL: "https://testro-97c3f.firebaseio.com",
//   projectId: "testro-97c3f",
//   storageBucket: "testro-97c3f.appspot.com",
//   messagingSenderId: "1061541542711",
//   appId: "1:1061541542711:web:b27a8fe8038c73750f38b2"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
