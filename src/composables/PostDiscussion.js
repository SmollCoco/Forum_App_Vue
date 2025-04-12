export function postDiscussion(post, router) {
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
    // At the end we go to the home page
    router.push('/');
}