import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBSdlbM8mjdmAMEg8R6cSTP1OpvenMCGL8",
  authDomain: "forum-app-vue.firebaseapp.com",
  projectId: "forum-app-vue",
  storageBucket: "forum-app-vue.firebasestorage.app",
  messagingSenderId: "546066211595",
  appId: "1:546066211595:web:085821682db29d29ae380e"
};

// Initialize Firebase
// The messagingSenderId in the firebaseConfig should match the one provided in your Firebase project settings.
const app = initializeApp(firebaseConfig);

// Export services
export const auth = getAuth(app);
export const db = getFirestore(app);
// export const storage = getStorage(app);


