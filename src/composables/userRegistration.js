// src/services/authService.js (for example)
import { auth, db } from '@/firebase';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export async function registerUser(email, password, name, pfpPath, isAdmin) {
  try {
    // Create the authentication record
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Save additional user details to Firestore under a "users" collection
    await setDoc(doc(db, "users", user.uid), {
      email,
      isAdmin,
      name,
      pfpPath,
      createdAt: serverTimestamp()
    });
    
    return user;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
}
