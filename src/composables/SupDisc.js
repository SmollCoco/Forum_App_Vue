/* eslint-disable no-unused-vars */
import { db } from '@/firebase';
import { doc, deleteDoc } from "firebase/firestore";
import { useRouter } from 'vue-router';
import { getReplies } from './getReplies';

 export async function DeleteDisc(id, router) {
    let replies = [];
    await getReplies(id, replies);
    for(let reply of replies)  await deleteDoc(doc(db,"discussions",reply.id));
    await deleteDoc(doc(db,"discussions",id));
    console.log(id);
    router.go();
 }
