/* eslint-disable no-unused-vars */
import {doc, setDoc} from "firebase/firestore";

export async function post_reply(router, route, author, parent, reply, depth_parent, parent_name,list) {
  console.log("hi");
  // the date should be Date.now()
  // The function provides a parent and a content
  // The author should be the person connected thus making the authentication necessary
  await setDoc(doc(db, "discussions", "aya123"), {
    auteur: "aya",
    contenu: "some content",
    date: Date.now(),
    titre:"test",
    topic:["ai","web"],
  });
  if (route.path == `/discussion/${parent}`) {router.go();}
 else {router.push(`/discussion/${parent}`);}
}