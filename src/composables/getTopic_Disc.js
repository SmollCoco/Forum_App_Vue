import { useStore } from './getDiscussions';

export async function getTopic_Disc(user, tpc) {
  const { discussions, fetchDiscussions } = useStore();
  await fetchDiscussions();
  const result=[];
  if(tpc=="" && user){
    for(const disc of discussions.value){
      if( disc.topic && disc.auteur==user){
        result.push(disc);

      }
    }
  }
  else if (user === "" && tpc) {
    for (const disc of discussions.value) {
      if (disc.topic && disc.topic.includes(tpc)) {
        result.push(disc);
      }
    }
  }
  else{
    return [];
  }
  return result;
}