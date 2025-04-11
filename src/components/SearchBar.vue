<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useStore } from '@/composables/getDiscussions';
import SearchSuggestionItem from './SearchSuggestionItem.vue';

const search_field = ref("");
const cliick = ref(false);
const suggestionsRef = ref(null);
const inputref = ref(null);

const { discussions, fetchDiscussions } = useStore();
onMounted(() => {
  fetchDiscussions().then(() => {
    console.log('discussions récupérées', discussions.value);
  });
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});

const handleClickOutside = (event) => {
  if (suggestionsRef.value && !suggestionsRef.value.contains(event.target) && !inputref.value.contains(event.target)) {
    cliick.value = false;

  }
};

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

const handleBlur = () => {
  setTimeout(() => {
    cliick.value = false;
  }, 200);
};


</script>

<template>
  <div class="mx-3 rounded-1 bg-white z-1 search-bar-container border-bottom" style="width: 50%;">
    <input class="form-control me-2 rounded-pill border-0" type="text" placeholder="Search MAYY" v-model="search_field"
      ref="inputref" @focus="cliick = true" @blur="handleBlur" @input="cliick = search_field.trim().length > 0" />

    <div v-show="search_field.trim().length > 0 && cliick" :ref="suggestionsRef"
      class="shadow-lg rounded mt-2 p-2 suggestion-item">
      <div v-if="matchedAuthors.length">
        <h6 class="text-muted px-2 ">Authors</h6>
        <SearchSuggestionItem v-for="(disc, index) in matchedAuthors" :key="index" :value="disc.auteur" type="User" />
      </div>

      <div v-if="matchedTopics.length" class="mt-3">
        <h6 class="text-muted px-2">Topics</h6>
        <SearchSuggestionItem v-for="(disc, index) in matchedTopics.slice(0, 3)" :key="index"
          :value="disc.topic.filter(t => t.toLowerCase().includes(search_field.toLowerCase())).join(', ')"
          type="Topic" />
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

.suggestion-item {
  max-height: 300px;
  overflow-y: scroll;

  z-index: 1;

}
</style>