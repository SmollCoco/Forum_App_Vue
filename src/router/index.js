import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import DiscussionView from "../views/DiscussionView.vue";
import ProfileView from "../views/ProfileView.vue";
import PostView from "@/views/PostView.vue";
import EditProfileView from "@/views/EditProfileView.vue";
import AdminView from "@/views/AdminView.vue";
import { auth } from "@/firebase";
import { getUserInfo } from "@/composables/useUserInfo";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: "/",
            name: "Home",
            component: HomeView,
        },
        {
            path: "/login",
            name: "Login",
            component: LoginView,
        },
        {
            path: "/register",
            name: "Register",
            component: RegisterView,
        },
        {
            path: "/profile/:username",
            name: "Profile",
            component: ProfileView,
            props: true,
        },
        {
            path: "/profile/edit",
            name: "EditProfile",
            component: EditProfileView,
        },
        {
            path: "/discussion/:id",
            name: "Discussion",
            component: DiscussionView,
        },
        {
            path: "/discussion/topic/:topic",
            name: "TopicDiscussions",
            component: HomeView,
            props: true,
        },
        {
            path: "/submit/:username",
            name: "CreatePost",
            component: PostView,
            props: true,
        },
        {
            path: "/modify/:username/:id",
            name: "ModifyPost",
            component: PostView,
            props: true,
        },
        {
            path: "/admin",
            name: "Admin",
            component: AdminView,
        },
    ],
});

router.beforeEach((to, from, next) => {
    const isAuthenticated = !!auth.currentUser;

    if (to.name === "Admin") {
        auth.onAuthStateChanged(async (user) => {
            if (user) {
                const userInfo = await getUserInfo(user.displayName);
                if (userInfo?.isAdmin) {
                    next();
                } else {
                    alert("Access denied. Admins only.");
                    next({ name: "Home" });
                }
            } else {
                alert("You must be logged in to access this page.");
                next({ name: "Login" });
            }
        });
    } else if (
        (to.name === "EditProfile" || to.name === "Profile") &&
        !isAuthenticated
    ) {
        // Wait for Firebase to initialize auth state
        auth.onAuthStateChanged((user) => {
            if (user) {
                next(); // Proceed if the user is authenticated
            } else {
                alert("You must be logged in to access this page.");
                next({ name: "Login" }); // Redirect to login if not authenticated
            }
        });
    } else {
        next(); // Proceed for all other routes
    }
});

export default router;
 