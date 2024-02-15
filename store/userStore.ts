// userStore.ts

import { create } from 'zustand';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

interface User {
  email: string;
  displayName?: string;
  photoURL?: string;
  password?: string;
  uid?: string;
}

interface UserStore {
  user: User | null;
  fetchUser: (uid: string) => Promise<void>;
  setUser: (user: User) => void;
}

const useUserStore = create<UserStore>((set) => ({
  user: null,

  fetchUser: async (uid) => {
    try {
      const firestore = getFirestore();
      const userDocRef = doc(firestore, 'users', uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        console.log('userData:', userData);
        localStorage.setItem('userIAHUB', JSON.stringify(userData));
        set({ user: userData as User });
      } else {
        set({ user: null });
        localStorage.removeItem('userIAHUB');
      }
    } catch (error: any) {
      console.error('Error al obtener información del usuario:', error.message);
      throw error;
    }
  },
  setUser: (user: User) => {
    set({ user });
    if (user) {
      localStorage.setItem('userIAHUB', JSON.stringify(user));
    } else {
      localStorage.removeItem('userIAHUB');
    }
  },
}));

export default useUserStore;
