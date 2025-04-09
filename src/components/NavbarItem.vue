<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref } from 'vue';
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

const search_field = ref("");

</script>

<template>
  <nav class="d-flex justify-content-between p-3 border-bottom">
    <div>
      <router-link to="/"><img src="../assets/logo.png" width="120px"></router-link>
    </div>
    <div class="w-75 mx-3 rounded-1">
      <input class="form-control me-2 rounded-pill border-0" type="text" placeholder="Search MAYY"
        v-model="search_field">
      <div class="position-absolute start-50 translate-middle-x z-1">
        <!--This will contain the results of the search-->
        <!--We can for example run the search as long as he is typing and based on that show him the top 3 elements that we got from the search-->
      </div>
    </div>
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
  </nav>
</template>

<style scoped>
input[type=text]{
  background-color:  rgb(224, 224, 224);
  
}
input[type=text]:focus{
  background-color: white;
  color: black;
  font-weight: 500;
}
</style>