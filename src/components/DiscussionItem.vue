<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, computed } from "vue";
import TopicItem from "./TopicItem.vue";
import ReplyModal from "./ReplyModal.vue";
import { get_date_string } from "../composables/dateString";
import DiscussionSetting from "./DiscussionSetting.vue";
const props = defineProps({
  id: {
    type: String,
    required: true,
    default: "id",
  },
  auteur: {
    type: String,
    required: true,
    default: "Yassine",
  },
  date: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
  titre: {
    type: String,
    required: true,
    default: "Dummy Post",
  },
  topic: {
    type: Array,
    required: true,
    default: () => ["Friendship", "Leadership"],
  },
  contenu: {
    type: String,
    required: true,
    default: "Some content",
  },
});

let date_string = computed(() => {
  return get_date_string(props.date);
});

let preview = computed(() => {
  return props.contenu.substring(0, 50);
});

let show_response = ref(false);
</script>

<template>
  <div class="m-2 p-2 r-link">
    <router-link :to="`/discussion/${id}`" class="r-link">
      <div class="w-100 d-flex gap-lg-2 flex-column rounded p-2">
        <!--Header containing the author, the topics and the date-->
        <div class="d-flex align-items-center z-1">
          <router-link
            :to="`/profile/${auteur}`"
            class="d-flex gap-2 text-decoration-none align-items-center"
          >
            <span class="d-block link div-link">u/{{ auteur }}</span>
          </router-link>
          <span style="color: gray; font-size: small">
            | {{ date_string }} |
          </span>
          <div v-for="(i, index) of topic" :key="index">
            <topic-item :topic="i" />
          </div>
        </div>
        <div class="fs-3 fw-bold div-link">{{ titre }}</div>
        <div>{{ preview }}</div>
      </div>
    </router-link>
    <div class="w-100 d-flex gap-lg-2 justify-content-between rounded p-2">
      <div
        class="reply-btn rounded-pill fw-bold fx-w h-25 align-self-end"
        @click="show_response = !show_response"
      >
        <span class="material-icons">reply</span>
        Reply
      </div>
      <DiscussionSetting class="z-2" :id="id" :username="auteur" />
    </div>
    <reply-modal
      v-if="show_response"
      :to_whom="auteur"
      :parent_id="id"
      @cancel="show_response = false"
    />
  </div>
</template>

<style scoped>
.link {
  font-weight: 500;
  color: black;
  text-decoration: none;
}

.link:hover {
  color: rgb(10, 73, 209);
}

.r-link {
  font-weight: 500;
  color: black;
  text-decoration: none;
}

.r-link:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.div-link:hover {
  text-decoration: underline;
}
.fx-w {
  width: 90px;
  position: relative;
  background-color: rgb(219, 219, 219);
}
.fx-w:hover {
  background-color: black;
  color: white;
}
.reply-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: bold;
  background-color: rgb(219, 219, 219);
  padding: 8px 12px;
  border-radius: 999px;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
}
.reply-btn:hover {
  background-color: black;
  color: white;
}
.reply-btn .material-icons {
  font-size: 18px;
}
</style>