import { signOut } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "vue-router";

const logout = async () => {
    const router = useRouter();
    if (auth.currentUser) {
        try {
            await signOut(auth);
            console.log("User signed out");
            alert("Logged out");
            router.replace("/");
        } catch (error) {
            console.error("Error signing out:", error);
        }
    } else {
        console.log("No user is currently logged in");
        alert("No user is logged in");
    }
};

export default logout;
