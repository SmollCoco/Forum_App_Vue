import { createRouter, createWebHistory } from "vue-router";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/LoginView.vue";
import RegisterView from "../views/RegisterView.vue";
import AdminView from "../views/AdminView.vue";
import DiscussionView from "../views/DiscussionView.vue";
import ProfileView from "../views/ProfileView.vue";

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
      path: "/Profile",
      name: "Profile",
      component: ProfileView,
    },
    {
      path: "/discussion/:username",
      name: "Discussion",
      component: DiscussionView,
    },
    {
      path: "/Admin/:username",
      name: "Admin",
      component: AdminView,
    },
  ],
});

export default router;
