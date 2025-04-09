<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref } from 'vue';
import SearchBar from './SearchBar.vue'
const props = defineProps({
  username: {
    type: String,
    default: "",
  }
});

const UserType = Object.freeze({
  ADMIN: 1,
  USER: 2,
  GUEST: 3,
});
let type = 3;
</script>

<template>
  <div class=" navbar navbar-expand d-flex justify-content-between p-3 border-bottom">
    <div>
      <router-link to="/"><img src="../assets/logo.png" width="120px"></router-link>
    </div>
      <search-bar class="my-2"/>
    <div>
      <div v-if="type == UserType.ADMIN || type == UserType.USER">
        <button class="btn btn-primary rounded-pill">
          <router-link :to="`/profile/${username}`" class="nav-link active" aria-current="page"><span
              class="fw-bold text-white"> Profile</span></router-link>
        </button>
      </div>
      <div v-else class="d-flex gap-3">
        <button class="btn btn-primary rounded-pill"><router-link to="/login" class="nav-link active"
            aria-current="page"> <span class="fw-bold text-white"> Login</span></router-link></button>
        <button class="btn btn-success rounded-pill"><router-link to="/register" class="nav-link active"
            aria-current="page"><span class="fw-bold text-white"> Register</span></router-link></button>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>
