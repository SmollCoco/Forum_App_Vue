import { signOut } from "firebase/auth";

const logout = async () => {
  await signOut(auth);
    console.log("User signed out");
    alert("Logged out");
};
