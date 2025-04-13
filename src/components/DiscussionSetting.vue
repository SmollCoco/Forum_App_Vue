<script setup>
import { ref } from 'vue';
import { DeleteDisc } from '../composables/SupDisc';
const optionsShow=ref(false)

const props=defineProps({
    id:{
        type:String,
        default:"vlG2ivikJIgOsmAVTHAm",
    }
});

const getId = () => {
    return props.id;
};



</script>


<template>
   
<div class="d-flex flex-column">
    
        
        <div v-show="optionsShow" class="btn-group-vertical" role="group" aria-label="Vertical button group">
        <button type="button" class="btn btn-outline-danger d-flex border-black" @click="DeleteDisc(id)"><span class="material-icons">delete</span> delete</button>
        <button type="button" class="btn btn-outline-danger d-flex border-black" ><span class="material-icons">report</span>report</button>
    </div>
    <div class="btn rounded-pill fw-bold fx-w d-flex"  @click="optionsShow=!optionsShow" >
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