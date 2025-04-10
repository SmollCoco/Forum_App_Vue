<!-- eslint-disable no-unused-vars -->
<script setup>
import { computed } from 'vue';
import TopicItem from './TopicItem.vue';
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
        default: "Dummy Post"
    },
    topic: {
        type: Array,
        required: true,
        default: () => ["Friendship", "Leadership"],
    }
});

let date_string = computed(() => {
  const timestamp = props.date;

  if (timestamp && typeof timestamp.seconds === 'number') {
    const jsDate = new Date(timestamp.seconds * 1000);

    return jsDate.toLocaleString('fr-FR', {
      weekday: 'long',     // optionnel : "jeudi"
      day: '2-digit',      // "10"
      month: 'long',       // "avril"
      year: 'numeric',     // "2025"
      hour: '2-digit',     // "14"
      minute: '2-digit',   // "05"
      hour12: false        // format 24h
    });
  }

  return "Date invalide";
});


</script>

<template>
    <router-link :to="`/discussion/${id}`" class="r-link mx-1">
        <div class="w-100 d-flex gap-lg-2 flex-column rounded p-2 r-link">
            <!--Header containing the author, the topics and the date-->
            <div class="d-flex align-items-center gap-lg-2 z-1">
                <router-link :to="`/profile/${auteur}`" class="d-flex gap-2 text-decoration-none align-items-center">
                    <img src="../assets/discussion.png" width="40" class="rounded-circle d-block">
                    <span class="d-block link div-link"> u/{{ auteur }}
                    </span>
                </router-link>
                <span style="color: gray; font-size: small;"> | {{ date_string }} | </span>
                <div v-for="(topic, index) of topic" :key="index">
                    <topic-item :topic="topic" />
                </div>
            </div>
            <div class="fs-3 fw-bold div-link"> {{ titre }}</div>
            <div id="reply button">tres bien </div>
        </div>
    </router-link>
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
.div-link:hover{
    text-decoration: underline;
}
</style>