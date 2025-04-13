<script setup>
import { ref, onMounted } from "vue";
import { db } from "@/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import DiscussionItem from "@/components/DiscussionItem.vue";

const reportedDiscussions = ref([]);

const fetchReportedDiscussions = async () => {
    const q = query(collection(db, "discussions"), where("reported", ">", 0));
    const querySnapshot = await getDocs(q);
    reportedDiscussions.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

onMounted(fetchReportedDiscussions);
</script>

<template>
    <div>
        <h1>Reported Discussions</h1>
        <div v-if="reportedDiscussions.length === 0">
            <p>No reported discussions found.</p>
        </div>
        <div v-else>
            <div v-for="discussion in reportedDiscussions" :key="discussion.id">
                <DiscussionItem v-bind="discussion" />
                <p><strong>Reports:</strong> {{ discussion.reported }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
h1 {
    text-align: center;
    margin: 20px 0;
}
</style>
