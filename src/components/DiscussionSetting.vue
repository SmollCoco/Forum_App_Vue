<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { DeleteDisc } from '../composables/SupDisc';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/firebase'; // Adjust the path based on your project structure
import { useRouter } from 'vue-router';
const optionsShow=ref(false)

const router = useRouter();

const props=defineProps({
    id:{
        type:String,
        default:"vlG2ivikJIgOsmAVTHAm",
    },
    username:{
        type:String,
        default:"username",
    }
});

function authStateListener() {
    return new Promise((resolve) => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                resolve(user);
            } else {
                resolve(null);
            }
        });
    });
}


const disable = ref([false, false]);

watch(() => [props.id, props.username], async ([newUserId, newToken]) => {
    if (newUserId && newToken) {
        console.log('Props are ready:', newUserId, newToken);
        let user_connected = await authStateListener();
        console.log(user_connected, "is the one connected");
        console.log('boolean values: ', props.username, user_connected?.displayName);
        disable.value[0] = user_connected ? props.username !== user_connected.displayName : true;
        disable.value[1] = disable.value[0] || (user_connected && user_connected.isAdmin);
    }
}, { immediate: true });


</script>


<template>
   
<div class="d-flex flex-column">
    
        
        <div v-show="optionsShow" class="btn-group-vertical" role="group" aria-label="Vertical button group">
            <button class="btn btn-outline-success d-flex border-black" :disabled="disable[0]">
                <RouterLink :to="`/modify/${username}/${id}`" class="fw-bold text-black text-decoration-none d-flex">
                    <span class="material-icons">
                        edit
                    </span>
                    Edit
                </RouterLink>
            </button>
            <button type="button" class="btn btn-outline-danger d-flex border-black" :disabled="disable[1]" @click="DeleteDisc(id, router)"><span class="material-icons">delete</span> delete</button>
        <button type="button" class="btn btn-outline-danger d-flex border-black" ><span class="material-icons">report</span>report</button>
    </div>
    <div class="btn rounded fw-bold fx-w d-flex"  @click="optionsShow=!optionsShow" >
        <span class="material-icons" >more_vert</span> Options
    </div>
    </div>
    
</template>
<style scoped>
.fx-w {
    width: 110px;
    position: relative;
    background-color: rgb(219, 219, 219);

}
.fx-w:hover {
    background-color: black;
    color: white;
}
</style>