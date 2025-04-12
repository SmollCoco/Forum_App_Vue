// src/composables/userRegistration.js
import { auth, db } from '@/firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

/**
 * registerUser creates both the Firebase Auth user and a Firestore record
 * for that user. If your Firestore rules forbid changing isAdmin, you can
 * still pass "isAdmin: false" on creation. 
 */
export async function registerUser(email, password, name, pfp) {
  try {
    // 1) Create the user in Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // 2) Immediately store user data in Firestore
    //    We'll put isAdmin = false by default, if you want
    await setDoc(doc(db, 'users', user.uid), {
      email: email,
      name: name,
      pfp: pfp,
      isAdmin: false, // or omit it if you want to set it manually in Firestore console
      createdAt: serverTimestamp()
    });

    return user; // might be helpful to return the user object
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}
