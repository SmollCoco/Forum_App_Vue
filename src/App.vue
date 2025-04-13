<script setup>
import NavbarItem from "@/components/NavbarItem.vue";
</script>

<template>
    <navbar-item />
    <main class="main-content">
        <router-view></router-view>
    </main>
</template>

<style>
.main-content {
    padding-top: 80px;
    min-height: 100vh;
    background-color: #f1f2f2;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}
</style>
