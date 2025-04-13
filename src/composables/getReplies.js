import { useStore } from "./getDiscussions";

const visited = new Set();

export async function getReplies(idref, replies = []) {
    const { discussions, fetchDiscussions } = useStore();

    if (discussions.value.length === 0) {
        await fetchDiscussions();
    }

    for (let disc of discussions.value) {
        if (disc.parent === idref && !visited.has(disc.id)) {
            visited.add(disc.id);
            replies.push(disc);
            await getReplies(disc.id, replies);
        }
    }

    return replies;
}
