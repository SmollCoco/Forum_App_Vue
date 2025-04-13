import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase";

export function authStateListener(callback) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            console.log("User logged in");
            callback(true);
        } else {
            console.log("User not logged in");
            callback(false);
        }
    });
}
