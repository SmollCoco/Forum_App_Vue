<!-- eslint-disable no-unused-vars -->
<script setup>
    const props = defineProps({
        topic: {
            type: String,
            required: true,
            default: "A.I.",
        },
        deleteable: {
            type: Boolean,
            default: false,
        }
    });

</script>

<template>
    <div>

        <RouterLink :to="`/discussion/topic/${topic}`" v-if="!deleteable">
            <button type="button" class="btn  btn-sm"> {{ topic }}</button>
        </RouterLink>
        <div v-else>
            <button type="button" class="btn rounded-pill btn-dark fw-bold btn-sm btn-smx" @click="$emit('remove', topic)"> {{ topic }}</button>
        </div>
    </div>
</template>

<style scoped>
.btn-smx:hover{
    background-color: #dc3545;
}
.btn-sm{
    padding: 0.375rem 0.75rem;
        font-size: 1rem;
        font-weight: 400;
        border: 1px solid  #B92B27  ;
        color: #B92B27;
}
</style>