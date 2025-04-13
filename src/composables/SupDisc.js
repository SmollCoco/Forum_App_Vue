/* eslint-disable no-unused-vars */
import { db } from "@/firebase";
import { doc, deleteDoc, getDoc } from "firebase/firestore";
import { useRouter } from "vue-router";
import { getReplies } from "./getReplies";
import { auth } from "@/firebase";
import { getUserInfo } from "./useUserInfo";

export async function DeleteDisc(id, router) {
    const user = auth.currentUser;
    if (!user) {
        alert("You must be logged in to delete a discussion.");
        return;
    }

    // Fetch the discussion document
    const discussionDoc = await getDoc(doc(db, "discussions", id));
    if (!discussionDoc.exists()) {
        alert("Discussion not found.");
        return;
    }

    const discussionData = discussionDoc.data();

    // Check if the user is the owner or an admin
    const userInfo = await getUserInfo(user.displayName);
    if (!userInfo) {
        alert("User information could not be retrieved.");
        return;
    }

    if (discussionData.auteur !== user.displayName && !userInfo.isAdmin) {
        alert("You do not have permission to delete this discussion.");
        return;
    }

    // Delete all replies and the discussion
    let replies = [];
    await getReplies(id, replies);
    for (let reply of replies) {
        await deleteDoc(doc(db, "discussions", reply.id));
    }
    await deleteDoc(doc(db, "discussions", id));
    console.log(`Discussion ${id} deleted.`);
    router.go();
}
