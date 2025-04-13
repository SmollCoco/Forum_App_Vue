import { ref } from "vue";
import { db } from "@/firebase";
import { collection, getDocs } from "firebase/firestore";

export function getUsers() {
    const users = ref([]);

    const fetchUsers = async () => {
        const querySnapshot = await getDocs(collection(db, "users"));
        users.value = querySnapshot.docs.map((doc) => doc.id);
    };

    return {
        users,
        fetchUsers,
    };
}
