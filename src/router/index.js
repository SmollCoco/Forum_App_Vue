import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import AdminView from '../views/AdminView.vue'
import DiscussionView from '../views/DiscussionView.vue'
import ProfileView from '../views/ProfileView.vue'
import PostView from '@/views/PostView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'Login',
      component: LoginView
    },
    {
      path: '/register',
      name: 'Register',
      component: RegisterView
    },
    {
      path: '/profile/:username',
      name: 'Profile',
      component: ProfileView
    },
    {
      path: '/discussion/:id',
      name: 'Discussion',
      component: DiscussionView,
    },
    {
      path: '/discussion/topic/:topic',
      name: 'TopicDiscussions',
      component: HomeView,
      props:true,
    },
    {
      path: '/Admin/:username',
      name: 'Admin',
      component: AdminView,
    },
    {
      path: '/submit/:username',
      name: 'CreatePost',
      component: PostView,
      props: true,
    },
    {
      path: '/modify/:username',
      name: 'ModifyPost',
      component: PostView,
      props: true,
    },
  ],
});

export default router;