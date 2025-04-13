<script setup>
import { ref, onMounted, computed } from 'vue';
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

const getId = () => {
    return props.id;
};

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

let is_disabled = ref(true);
let is_disabled2 = ref(true);
onMounted(async () => {
    console.log("DiscussionSetting component mounted");
    try {
        let user_connected = await authStateListener();
        console.log(user_connected, "is the one connected");
        is_disabled.value = user_connected ? props.username !== user_connected.displayName : true;
        is_disabled2.value = is_disabled.value || (user_connected && user_connected.isAdmin);
    } catch (error) {
        console.error("Error during onMounted execution:", error);
    }
});


</script>


<template>
   
<div class="d-flex flex-column">
    
        
        <div v-show="optionsShow" class="btn-group-vertical" role="group" aria-label="Vertical button group">
            <button class="btn btn-outline-success d-flex border-black" :disabled="is_disabled">
                <RouterLink :to="`/modify/${username}/${id}`" class="fw-bold text-black text-decoration-none d-flex">
                    <span class="material-icons">
                        edit
                    </span>
                    Edit
                </RouterLink>
            </button>
            <button type="button" class="btn btn-outline-danger d-flex border-black" :disabled="is_disabled2" @click="DeleteDisc(id, router)"><span class="material-icons">delete</span> delete</button>
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