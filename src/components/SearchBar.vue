<script setup>
import { ref } from 'vue';
import SearchSuggestionItem from './SearchSuggestionItem.vue'
const search_field = ref("");

// Add fucntions for fetching here.
// fetch the database for matching patter, in discussions
</script>

<template>
    <div class="mx-3 rounded-1 bg-white z-1 search-bar-container border-bottom" style="width: 50%;">
        <input class="form-control me-2 rounded-pill border-0" type="text" placeholder="Search MAYY"
            v-model="search_field">
        <div class="shadow-lg rounded">
            <!--This will contain the results of the search-->
            <!--We can for example run the search as long as he is typing and based on that show him the top 3 elements that we got from the search-->
            <!-- 
            <SearchSuggestionItem value="Ayouta" type="User" />
            <SearchSuggestionItem value="Project" type="Topic" />
            -->
        </div>
    </div>
</template>

<style lang="css" scoped>
.search-bar-container {
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 1000;
}
input[type=text] {
    background-color: rgb(224, 224, 224);

}

input[type=text]:focus {
    background-color: white;
    color: black;
    font-weight: 500;
}
</style>