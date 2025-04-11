import { useStore } from './getDiscussions';

export async function getTopic_Disc(user, topic) {
  const { discussions, fetchDiscussions } = useStore();
  await fetchDiscussions();
  const result=[];
  if(topic==""){
    for(const disc in discussions.value){
      if( disc.topic && disc.auteur==user){
        result.push(disc);

      }
    }
    return result;
  }
  else if(user==""){
    for(disc in discussions.value){
      if(disc.topic){
        for(tpc in disc.topic){
          if (tpc==topic){
            result.push(disc);
          }

      }

      }
    }
    return result;
  }

}