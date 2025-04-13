<!-- eslint-disable no-unused-vars -->
<script setup>
import { ref, computed, onMounted } from "vue";
import { get_date_string } from "../composables/dateString";
import ReplyModal from "./ReplyModal.vue";
import { viewDepthKey } from "vue-router";
import { getUserInfo } from "@/composables/useUserInfo";
import defaultPfp from "@/assets/user.png";

let show_response = ref(false);
const userPfp = ref(defaultPfp);

const props = defineProps({
    id: {
        type: String,
    },
    auteur: {
        type: String,
        required: true,
        default: "Aya",
    },
    contenu: {
        type: String,
        required: true,
        default: "Amazing",
    },
    date: {
        type: String,
        required: true,
        default: () => new Date(),
    },
    parent: {
        type: String,
        required: true,
    },
    depth: {
        type: Number,
        required: true,
        default: 0,
    },
    parentName: {
        type: String,
        required: true,
        default: "Parent",
    },
});

onMounted(async () => {
    try {
        const userInfo = await getUserInfo(props.auteur);
        if (userInfo?.pfp) {
            userPfp.value = userInfo.pfp;
        } else {
            userPfp.value = defaultPfp;
        }
    } catch (error) {
        console.error("Error fetching user profile picture:", error);
        userPfp.value = defaultPfp;
    }
});

let date_string = computed(() => {
    return get_date_string(props.date);
});
</script>

<template>
    <div class="bg-white p-2 r-link">
        <div
            class="d-flex gap-1 flex-column rounded"
            :class="depth >= 1 ? 'ms-lg-4' : ''"
        >
            <!--Header containing the author, the topics and the date-->
            <div class="d-flex align-items-center gap-1 z-1">
                <router-link
                    :to="`/profile/${auteur}`"
                    class="d-flex gap-1 text-decoration-none align-items-center"
                >
                    <img
                        :src="userPfp"
                        width="32"
                        height="32"
                        class="profile-picture"
                        alt="Profile"
                        @error="userPfp = defaultPfp"
                    />
                    <span class="d-block link div-link"> u/{{ auteur }} </span>
                </router-link>
                <span style="color: gray; font-size: small">
                    | {{ date_string }} |
                </span>
            </div>
            <div class="ms-lg-2 mb-2">
                <router-link :to="`/profile/${parentName}`">
                    @{{ parentName }}
                </router-link>
                {{ contenu }}
            </div>
            <div
                class="btn rounded-pill fw-bold fx-w d-flex"
                @click="show_response = !show_response"
            >
                <span class="material-icons">reply</span>Reply
            </div>

            <reply-modal
                v-if="show_response"
                :to_whom="auteur"
                :parent_id="id"
                :parent_depth="depth"
                @cancel="show_response = false"
            />
        </div>
    </div>
</template>

<style scoped>
.r-link {
    font-weight: 500;
    color: black;
    text-decoration: none;
}

.r-link:hover {
    background-color: rgba(0, 0, 0, 0.05);
}

.div-link {
    font-size: 14px;
    color: black;
}

.div-link:hover {
    text-decoration: underline;
}

.fx-w {
    font-size: 14px;
    width: 85px;
    position: relative;
    background-color: rgb(219, 219, 219);
}

.fx-w:hover {
    background-color: black;
    color: white;
}

.profile-picture {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    object-fit: cover;
    border: 2px solid #b92b27;
    transition: all 0.2s ease;
}

.r-link:hover .profile-picture {
    border-color: #a52622;
    transform: scale(1.05);
}
</style>
