export function postDiscussion(post, router) {
    console.log("Posting a discussion", post);
    // definition of post
    /*
        post: {
            id: String // The username
            topics: Set // You should cast it into a list
            title: String,
            content: String,
        }
        The only thing left is to add the date and generate an id for the discussion
    */
    // At the end we go to the home page
    router.push('/');
}