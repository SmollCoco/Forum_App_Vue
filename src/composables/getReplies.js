import { useStore } from "./getDiscussions";

var replies = [];

export async function getReplies(idref) {
    const { discussions, fetchDiscussions } = useStore();

  if (discussions.value.length === 0) {
    await fetchDiscussions();
  }
  console.log("Found discussions", discussions.value.length);
  for (let disc of discussions.value.reverse()) {
    console.log("discussion", disc, "idref", idref, "parent", disc.parent);
    if (disc.parent && disc.parent.id === idref) {
      console.log("Condition is met");
      replies.push(disc);
      await getReplies(disc.id);
    }
    console.log("Condition is not met");

  }
  return replies;
}