import { db } from "@/firebase";
import { doc, updateDoc, increment } from "firebase/firestore";

/**
 * Reports a discussion by incrementing the report count in Firestore.
 * Ensures a user can report a discussion only once by using local storage.
 * @param {string} discussionId - The ID of the discussion to report.
 */
export async function reportDiscussion(discussionId) {
    try {
        // Check if the user has already reported this discussion
        const reportedDiscussions =
            JSON.parse(localStorage.getItem("reportedDiscussions")) || [];
        if (reportedDiscussions.includes(discussionId)) {
            alert("You have already reported this discussion.");
            return;
        }

        // Increment the report count in the discussions collection
        const discussionRef = doc(db, "discussions", discussionId);
        await updateDoc(discussionRef, {
            reported: increment(1), // Increment the report count
        });

        // Add the discussion ID to the local storage
        reportedDiscussions.push(discussionId);
        localStorage.setItem(
            "reportedDiscussions",
            JSON.stringify(reportedDiscussions)
        );

        alert("Discussion reported successfully.");
    } catch (error) {
        console.error("Error reporting discussion:", error);
        alert("Failed to report discussion. Please try again.");
    }
}
