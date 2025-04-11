<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, onMounted } from 'vue';
import { auth } from '@/firebase'
// import { useStore } from '@/composables/getDiscussions';
// import { getReplies } from '@/composables/getReplies';
import SearchBar from './SearchBar.vue';

const props = defineProps({
    username: {
        type: String,
        default: "",
    }
});

let user_connected = ref(false);
    auth.onAuthStateChanged(user => {
        if (user) {
            // User is logged in; you can fetch additional data if needed.
            user_connected.value = true;
        } else {
            // No user is logged in.
            user_connected.value = false;
        }
    });
// pour recuperer les discussions
// const { discussions, fetchDiscussions } = useStore();
// onMounted(() => {
//   fetchDiscussions().then(() => {
    
//     console.log('discussions0', discussions.value);
//   });
// });


//pour recuperer les reponses
// const replies = ref([]);  
// const idref = 'dsW0XbdMJPCrv2Ye0Aoq';
// onMounted(async () => {
//   replies.value = await getReplies(idref);
//   console.log('Replies0', replies.value);
// });


</script>


<template>
<!--   
  <p v-if="replies.length">
    {{replies[0].id}}
</p>
<p v-if="discussions.length">
  {{discussions[1].parent.id}}
</p> -->

  <div class="navbar navbar-expand d-flex justify-content-between p-3 border-bottom">
    <div>
      <router-link to="/">
        <img src="../assets/logo.png" width="120px" alt="Logo">
      </router-link>
    </div>
    <search-bar class="my-2" />
    <div>
      <div v-if="user_connected">
        <button class="btn btn-primary rounded-pill">
          <router-link :to="`/profile/${username}`" class="nav-link active" aria-current="page">
            <span class="fw-bold text-white">Profile</span>
          </router-link>
        </button>
      </div>
      <div v-else class="d-flex gap-3">
        <button class="btn btn-primary rounded-pill">
          <router-link to="/login" class="nav-link active" aria-current="page">
            <span class="fw-bold text-white">Login</span>
          </router-link>
        </button>
        <button class="btn btn-success rounded-pill">
          <router-link to="/register" class="nav-link active" aria-current="page">
            <span class="fw-bold text-white">Register</span>
          </router-link>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Vos styles ici */
</style>
