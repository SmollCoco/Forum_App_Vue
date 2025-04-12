import { useStore } from "./getDiscussions";

export async function getReplies(idref, replies = []) {
    const { discussions, fetchDiscussions } = useStore();

    if (discussions.value.length === 0) {
        await fetchDiscussions();
    }

    for (let disc of discussions.value) {
        if (disc.parent === idref) {
            // Fixed parent check
            replies.push(disc);
            await getReplies(disc.id, replies);
        }
    }

    return replies;
}
