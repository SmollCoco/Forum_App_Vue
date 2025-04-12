import { signOut } from "firebase/auth";
import { auth } from "@/firebase";

const logout = async () => {
    if (auth.currentUser) {
        try {
            await signOut(auth);
            console.log("User signed out");
            alert("Logged out");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    } else {
        console.log("No user is currently logged in");
        alert("No user is logged in");
    }
};

export default logout;
