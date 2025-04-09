<script setup>
const props=defineProps({
  username:{
    type: String,
    default: "",
  }
});


</script>

<template>
    <nav class="navbar navbar-expand-lg bg-body-tertiary">
  <div class="container-fluid">
    <router-link to="/" class="navbar-brand h1 fs-1" >Forum</router-link>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse d-flex justify-content-end" id="navbarSupportedContent">
      <div v-if="username">
        <button class="btn btn-info"><router-link :to="`/profile/${username}`" class="nav-link active" aria-current="page" >Profile</router-link></button>
      </div>
      <div v-else class="d-flex gap-3">
        <button class="btn btn-outline-primary"><router-link to="/login" class="nav-link active" aria-current="page" >Login</router-link></button>
        <button class="btn btn-outline-success"><router-link to="/register" class="nav-link active" aria-current="page" >Register</router-link></button>
      </div>
    </div>
  </div>
</nav>
</template>
