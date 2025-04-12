import { db } from '@/firebase';
export async function postDiscussion(post, router) {
    console.log("Posting a discussion", post);
    // definition of post
    /*
        post: {
            auteur: String // The username
            topic: Set // You should cast it into a list
            titre: String,
            contenu: String,
        }
        The only thing left is to add the date and generate an id for the discussion
    */
   post.topic=[...post.topic];
   post={
    ...post,
    date:Date().now,
   }
   const docRef = await addDoc(collection(db, "discussions"), post);
    router.push('/');
}