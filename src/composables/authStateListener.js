import { auth } from '@/firebase';
auth.onAuthStateChanged(user => {
  if (user) {
      // User is logged in; you can fetch additional data if needed.
      return true
  } else {
      // No user is logged in.
      return false
  }
});
