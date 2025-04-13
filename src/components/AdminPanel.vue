<template>
    <div class="admin-panel">
        <h2>Admin Panel</h2>

        <!-- User Management -->
        <div class="section">
            <h3>User Management</h3>
            <div class="search-box">
                <input
                    v-model="searchUser"
                    type="text"
                    placeholder="Search users..."
                    @input="searchUsers"
                />
            </div>
            <div v-if="searchResults.length" class="search-results">
                <div
                    v-for="user in searchResults"
                    :key="user.id"
                    class="user-item"
                >
                    <div class="user-info">
                        <span>{{ user.displayName }}</span>
                        <span class="user-role">{{
                            user.isAdmin ? "Admin" : "User"
                        }}</span>
                    </div>
                    <div class="user-actions">
                        <button
                            v-if="!user.isAdmin"
                            @click="makeAdmin(user.id)"
                            class="make-admin-btn"
                        >
                            Make Admin
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <!-- Reported Messages -->
        <div class="section">
            <h3>Reported Messages</h3>
            <div v-if="reportedMessages.length" class="reported-messages">
                <div
                    v-for="message in reportedMessages"
                    :key="message.id"
                    class="message-item"
                >
                    <div class="message-content">
                        <p><strong>Author:</strong> {{ message.auteur }}</p>
                        <p><strong>Content:</strong> {{ message.contenu }}</p>
                        <p><strong>Reports:</strong> {{ message.reports }}</p>
                        <div
                            v-if="
                                message.reportReasons &&
                                message.reportReasons.length
                            "
                            class="report-reasons"
                        >
                            <p><strong>Report Reasons:</strong></p>
                            <ul>
                                <li
                                    v-for="(
                                        report, index
                                    ) in message.reportReasons"
                                    :key="index"
                                >
                                    {{ report.reason }} ({{
                                        new Date(
                                            report.timestamp
                                        ).toLocaleString()
                                    }})
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="message-actions">
                        <button
                            @click="deleteMessage(message.id)"
                            class="delete-btn"
                        >
                            Delete Message
                        </button>
                        <button
                            @click="dismissReport(message.id)"
                            class="dismiss-btn"
                        >
                            Dismiss Report
                        </button>
                    </div>
                </div>
            </div>
            <p v-else>No reported messages</p>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db } from "../firebase";
import {
    collection,
    query,
    where,
    getDocs,
    updateDoc,
    doc,
    deleteDoc,
    getDoc,
} from "firebase/firestore";
import { getUsers } from "../composables/getUsers";

const { users, fetchUsers } = getUsers();
const searchUser = ref("");
const searchResults = ref([]);
const reportedMessages = ref([]);

const searchUsers = async () => {
    if (!searchUser.value) {
        searchResults.value = [];
        return;
    }

    // Fetch all users first
    await fetchUsers();

    // Filter users based on search term
    searchResults.value = users.value
        .filter((username) =>
            username.toLowerCase().includes(searchUser.value.toLowerCase())
        )
        .map((username) => ({
            id: username,
            displayName: username,
            isAdmin: false, // Default value, will be updated when user data is fetched
        }));

    // Fetch admin status for each user
    for (const user of searchResults.value) {
        const userDoc = await getDoc(doc(db, "users", user.displayName));
        if (userDoc.exists()) {
            user.isAdmin = userDoc.data().isAdmin || false;
        }
    }
};

const makeAdmin = async (userId) => {
    if (
        confirm(
            "Are you sure you want to make this user an admin? This action cannot be undone."
        )
    ) {
        const userRef = doc(db, "users", userId);
        const user = searchResults.value.find((u) => u.id === userId);

        await updateDoc(userRef, {
            isAdmin: true,
        });

        user.isAdmin = true;
        alert("User has been promoted to admin");
    }
};

const loadReportedMessages = async () => {
    const messagesRef = collection(db, "discussions");
    const q = query(messagesRef, where("reports", ">", 0));
    const querySnapshot = await getDocs(q);
    reportedMessages.value = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
};

onMounted(loadReportedMessages);

const deleteMessage = async (messageId) => {
    if (confirm("Are you sure you want to delete this message?")) {
        await deleteDoc(doc(db, "discussions", messageId));
        reportedMessages.value = reportedMessages.value.filter(
            (m) => m.id !== messageId
        );
    }
};

const dismissReport = async (messageId) => {
    const messageRef = doc(db, "discussions", messageId);
    await updateDoc(messageRef, {
        reports: 0,
        lastReportedAt: null,
        reportedBy: [],
        reportReasons: [],
    });
    reportedMessages.value = reportedMessages.value.filter(
        (m) => m.id !== messageId
    );
};
</script>

<style scoped>
.admin-panel {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
}

.section {
    margin-bottom: 30px;
    padding: 20px;
    border: 1px solid #ddd;
    border-radius: 8px;
}

.search-box {
    margin-bottom: 20px;
}

.search-box input {
    width: 100%;
    padding: 8px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.search-results {
    margin-top: 10px;
}

.user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #eee;
}

.user-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.user-role {
    font-size: 0.8em;
    color: #666;
}

.user-actions {
    display: flex;
    gap: 10px;
}

.user-item button {
    padding: 5px 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.make-admin-btn {
    background-color: #ff9800;
    color: white;
}

.message-item {
    margin-bottom: 15px;
    padding: 15px;
    border: 1px solid #ddd;
    border-radius: 4px;
}

.message-content {
    margin-bottom: 10px;
}

.report-reasons {
    margin-top: 10px;
    padding: 10px;
    background-color: #f5f5f5;
    border-radius: 4px;
}

.report-reasons ul {
    margin: 10px 0 0 0;
    padding-left: 20px;
}

.message-actions {
    display: flex;
    gap: 10px;
}

.delete-btn {
    background-color: #f44336;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
}

.dismiss-btn {
    background-color: #2196f3;
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
}
</style>
