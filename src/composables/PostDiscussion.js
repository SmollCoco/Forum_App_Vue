import { db } from "@/firebase";
import { addDoc, collection, setDoc, Timestamp, doc } from "firebase/firestore";

/**
 * Creates a new discussion and saves it to Firestore.
 * @param {Object} post - The discussion object containing the details.
 * @param {Object} router - The Vue Router instance for navigation.
 */
export async function postDiscussion(post, router) {
    console.log("Posting a discussion", post);

    // Convert the topic Set to an array
    post.topic = [...post.topic];

    // Add the current timestamp to the post
    post = {
        ...post,
        date: Timestamp.fromDate(new Date(Date.now())),
    };

    try {
        // Add the discussion to the Firestore "discussions" collection
        const docRef = await addDoc(collection(db, "discussions"), post);
        console.log("Discussion posted with ID:", docRef.id);

        // Redirect to the home page
        router.push("/");
    } catch (error) {
        console.error("Error posting discussion:", error);
        alert("Failed to post discussion. Please try again.");
    }
}

/**
 * Modifies an existing discussion in Firestore.
 * @param {Object} post - The updated discussion object.
 * @param {Object} router - The Vue Router instance for navigation.
 * @param {string} discussionId - The ID of the discussion to modify.
 */
export async function postModification(post, router, discussionId) {
    // Convert the topic Set to an array
    post.topic = [...post.topic];

    // Add the current timestamp to the post
    post = {
        ...post,
        date: Timestamp.fromDate(new Date(Date.now())),
    };

    try {
        // Update the discussion in the Firestore "discussions" collection
        const docRef = await setDoc(doc(db, "discussions", discussionId), post);
        console.log("Discussion modified with ID:", discussionId);

        // Redirect to the home page
        router.push("/");
    } catch (error) {
        console.error("Error modifying discussion:", error);
        alert("Failed to modify discussion. Please try again.");
    }
}
