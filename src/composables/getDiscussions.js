import { ref } from 'vue';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

export  function useStore() {  
  const discussions = ref([]);

  const fetchDiscussions = async () => {
      const querySnapshot = await getDocs(collection(db, 'discussions'));
      discussions.value = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    
  };
  return {
    discussions,
    fetchDiscussions
  };
}