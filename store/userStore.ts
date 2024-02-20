import { set } from 'firebase/database';
// userStore.ts

import { create } from 'zustand';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { auth } from "../firebase/firebase";

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
  setThreadIdStudyAssistant: (threadId: string) => void;
  getThreadIdStudyAssistant: () => string | Promise<any>;
  setThreadIdChefAssistant: (threadId: string) => void;
  getThreadIdChefAssistant: () => string | Promise<any>;
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
  setThreadIdStudyAssistant: (threadId: string) =>{
    const currentUser = auth.currentUser;
    if(currentUser){
      const firestore = getFirestore();
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      setDoc(userDocRef, { threadIdStudyAssistant: threadId }, { merge: true });
    }
  },
  getThreadIdStudyAssistant: () => {
    const currentUser = auth.currentUser;
    if(currentUser){
      const firestore = getFirestore();
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      const userDocSnapshot = getDoc(userDocRef);
      return userDocSnapshot.then((doc) => {
        if (doc.exists()) {
          const data = doc.data();
          return data.threadIdStudyAssistant;
        } else {
          console.log('No such document!');
          return '';
        }
      }).catch((error) => {
        console.log('Error getting document:', error);
        return '';
      });
    }
    return '';
  },
  setThreadIdChefAssistant: (threadId: string) =>{
    const currentUser = auth.currentUser;
    if(currentUser){
      const firestore = getFirestore();
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      setDoc(userDocRef, { threadIdChefAssistant: threadId }, { merge: true });
    }
  },
  getThreadIdChefAssistant: () => {
    const currentUser = auth.currentUser;
    if(currentUser){
      const firestore = getFirestore();
      const userDocRef = doc(firestore, 'users', currentUser.uid);
      const userDocSnapshot = getDoc(userDocRef);
      return userDocSnapshot.then((doc) => {
        if (doc.exists()) {
          const data = doc.data();
          return data.threadIdChefAssistant;
        } else {
          console.log('No such document!');
          return '';
        }
      }).catch((error) => {
        console.log('Error getting document:', error);
        return '';
      });
    }
    return '';
  }
}));

export default useUserStore;
