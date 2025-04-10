<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from '@/composables/getDiscussions';
import SearchSuggestionItem from './SearchSuggestionItem.vue';

const search_field = ref("");

const { discussions, fetchDiscussions } = useStore();
onMounted(() => {
  fetchDiscussions().then(() => {
    console.log('discussions récupérées', discussions.value);
  });
});

const matchedAuthors = computed(() => {
  const search = search_field.value.trim().toLowerCase();
  if (!search) return [];
  return discussions.value.filter(disc =>
    disc.topic && disc.auteur.toLowerCase().includes(search)
  );
});

const matchedTopics = computed(() => {
  const search = search_field.value.trim().toLowerCase();
  if (!search) return [];
  return discussions.value.filter(disc =>
    disc.topic && disc.topic.some(t => t.toLowerCase().includes(search))
  );
});
</script>

<template>
  <div class="mx-3 rounded-1 bg-white z-1 search-bar-container border-bottom" style="width: 50%;">
    <input class="form-control me-2 rounded-pill border-0" type="text" placeholder="Search MAYY"
      v-model="search_field" />

    <div class="shadow-lg rounded mt-2 p-2 ">
      <div v-if="matchedAuthors.length">
        <h6 class="text-muted px-2 " >Auteurs</h6>
        <SearchSuggestionItem
          v-for="(disc, index) in matchedAuthors"
          :key="index"
          :value="disc.auteur"
          type="User"
        />
      </div>

      <div v-if="matchedTopics.length" class="mt-3">
        <h6 class="text-muted px-2">Topics</h6>
        <SearchSuggestionItem
          v-for="(disc, index) in matchedTopics.slice(0, 3)"
          :key="index"
          :value="disc.topic.filter(t => t.toLowerCase().includes(search_field.toLowerCase())).join(', ')"
          type="Topic"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-bar-container {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

input[type="text"] {
  background-color: rgb(224, 224, 224);
}

input[type="text"]:focus {
  background-color: white;
  color: black;
  font-weight: 500;
}

</style>
