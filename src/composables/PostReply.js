/* eslint-disable no-unused-vars */
import { db } from '@/firebase';
import { collection, doc, addDoc, Timestamp } from "firebase/firestore";

export async function post_reply( author, reply,parent_id,depth,parent_name, router) {
  const post={
        auteur: author,
        contenu: reply,
        date: Timestamp.fromDate(new Date(Date.now())),
        parent: doc(db, "discussions", parent_id),
        parentName:parent_name,
        depth:depth,

      }

      const docRef = await addDoc(collection(db, "discussions"), post);
      router.go();
  
}