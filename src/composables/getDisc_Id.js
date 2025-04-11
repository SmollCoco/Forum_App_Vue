import { useStore } from './getDiscussions';

export async function getReplies(DiscId) {
  const { discussions, fetchDiscussions } = useStore();

  if (discussions.value.length === 0) {
    await fetchDiscussions();
  }

  for (let disc of discussions.value) {
    if(disc.id==DiscId){
        return disc;
    }
  }
  return "no id matched";

}
