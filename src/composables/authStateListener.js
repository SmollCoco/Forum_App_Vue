import { onAuthStateChanged } from "firebase/auth";
import { auth } from '@/firebase';
auth.onAuthStateChanged(user => {
  if (user) {
      // User is logged in; you can fetch additional data if needed.
      console.log("user logged in");
      return true
  } else {
      // No user is logged in.
      console.log("user not logged in");
      return false
  }
});
