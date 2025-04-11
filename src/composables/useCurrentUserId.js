
import { ref, onMounted } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/firebase'

const currentUserId = ref(null)

export function useCurrentUserId() {
    onMounted(() => {
        onAuthStateChanged(auth, (user) => {
            currentUserId.value = user ? user.uid : null
        })
    })

    return {
        currentUserId
    }
}
