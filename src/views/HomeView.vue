<template>
    <div class="d-flex flex-column">
        <NavbarItem class="z-2" />
        <DiscussionList :topic="route.params.topic" class="mt-5" />
    </div>
</template>

<script setup>
import { useRoute } from "vue-router";
import NavbarItem from "../components/NavbarItem.vue";
import DiscussionList from "@/components/DiscussionList.vue";

const route = useRoute();
</script>
