/* eslint-disable no-unused-vars */
import {doc, setDoc} from "firebase/firestore";
import { useStore } from './getDiscussions';

export async function post_reply( author, reply,parent_id) {
      const { discussions, fetchDiscussions } = useStore();
      if (discussions.value.length === 0) {
        await fetchDiscussions();
      }
      const replyId = `${parent_id}_${Date.now()}`;
      await setDoc(doc(db, "discussions",replyId), {
        auteur: author,
        contenu: reply,
        date: Date.now(),
        parent:`/discussion/${parent_id}`,

      });

  
}