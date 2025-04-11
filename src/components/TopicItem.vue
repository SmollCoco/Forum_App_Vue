<!-- eslint-disable no-unused-vars -->
<script setup>
    const props = defineProps({
        topic: {
            type: String,
            required: true,
            default: "A.I.",
        },
    });
</script>

<template>
    <div>
        <RouterLink :to="`/discussion/topic/${topic}`">
            <button type="button" class="btn btn-outline-primary btn-sm">{{ topic }}</button>
        </RouterLink>
    </div>
</template>

<style scoped>
.btn-sm{
    font-size: 0.7rem;
    padding: 0.2rem 0.3rem;
}
</style>