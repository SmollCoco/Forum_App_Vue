import { useStore } from "./getDiscussions";

/**
 * Fetches a discussion by its ID.
 * @param {string} DiscId - The ID of the discussion to fetch.
 * @returns {Object|string} - The discussion object if found, or a "no id matched" message.
 */
export async function getdiscId(DiscId) {
    const { discussions, fetchDiscussions } = useStore();

    // Fetch discussions if the store is empty
    if (discussions.value.length === 0) {
        await fetchDiscussions();
    }

    // Search for the discussion by ID
    for (let disc of discussions.value) {
        if (disc.id === DiscId) {
            console.log(disc);
            return disc;
        }
    }

    // Return a message if no matching ID is found
    return "no id matched";
}
