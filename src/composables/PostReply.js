/* eslint-disable no-unused-vars */
import {doc, setDoc} from "firebase/firestore";

export function post_reply(router, route, author, parent, reply, depth_parent, parent_name,list) {
  console.log("hi");
  // From what i know, a response has an author a content, a date, a parent_id
  // the date should be Date.now()
  // The function provides a parent and a content
  // The author should be the person connected thus making the authentication necessary
  if (route.path == `/discussion/${parent}`) {router.go();}
 else {router.push(`/discussion/${parent}`);}
}