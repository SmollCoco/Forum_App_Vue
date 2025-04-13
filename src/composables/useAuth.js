// <!-- src/components/Navbar.vue -->
// <template>
//   <nav>
//     <!-- Show login icon if not signed in -->
//     <button v-if="!currentUser">Login</button>
    
//     <!-- Show profile button if signed in -->
//     <button v-else @click="goToProfile">
//       Profile ({{ currentUser.displayName || currentUser.email }})
//     </button>
//   </nav>
// </template>

// <script setup>
// import { useRouter } from 'vue-router'
// import { useCurrentUser } from '@/composables/useCurrentUser'

// const { currentUser } = useCurrentUser()
// const router = useRouter()

// const goToProfile = () => {
//   // Route to the profile page
//   router.push({ name: 'Profile' })
// }
// </script>
