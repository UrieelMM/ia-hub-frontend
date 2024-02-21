// userStore.ts

import { create } from "zustand";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { auth } from "../firebase/firebase";
import { createThreadCase } from "../src/core";

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
      const userDocRef = doc(firestore, "users", uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        console.log("userData:", userData);
        localStorage.setItem("userIAHUB", JSON.stringify(userData));
        set({ user: userData as User });
      } else {
        set({ user: null });
        localStorage.removeItem("userIAHUB");
      }
    } catch (error: any) {
      console.error("Error al obtener información del usuario:", error.message);
      throw error;
    }
  },
  setUser: (user: User) => {
    set({ user });
    if (user) {
      localStorage.setItem("userIAHUB", JSON.stringify(user));
    } else {
      localStorage.removeItem("userIAHUB");
    }
  },
  setThreadIdStudyAssistant: async (threadId: string) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const firestore = getFirestore();
      const userDocRef = doc(firestore, "users", currentUser.uid);
      await setDoc(
        userDocRef,
        { threadIdStudyAssistant: threadId },
        { merge: true }
      );
      localStorage.setItem("threadIdStudyAssistant", threadId);
    }
  },

  getThreadIdStudyAssistant: async () => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      // Buscar en localStorage
      const localStorageThreadId = localStorage.getItem(
        "threadIdStudyAssistant"
      );

      if (localStorageThreadId) {
        return localStorageThreadId;
      }

      // Si no está en localStorage, buscar en Firestore
      const firestore = getFirestore();
      const userDocRef = doc(firestore, "users", currentUser.uid);

      try {
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const data = userDocSnapshot.data();
          let threadIdFromFirestore = data.threadIdStudyAssistant;

          if (!threadIdFromFirestore) {
            // Si no existe en Firestore, llamar a createThreadCase() para obtener un nuevo ID
            threadIdFromFirestore = await createThreadCase();

            // Actualizar Firestore con el nuevo ID
            await updateDoc(userDocRef, {
              threadIdStudyAssistant: threadIdFromFirestore,
            });
          }

          // Guardar en localStorage para futuras consultas
          localStorage.setItem("threadIdStudyAssistant", threadIdFromFirestore);
          return threadIdFromFirestore;
        } else {
          console.log("No such document!");
          return "";
        }
      } catch (error) {
        console.log("Error getting document:", error);
        return "";
      }
    }
    return ""; // Resuelve la promesa con un valor predeterminado si no hay usuario autenticado
  },

  setThreadIdChefAssistant: async (threadId: string) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const firestore = getFirestore();
      const userDocRef = doc(firestore, "users", currentUser.uid);
      await setDoc(
        userDocRef,
        { threadIdChefAssistant: threadId },
        { merge: true }
      );
      localStorage.setItem("threadIdChefAssistant", threadId);
    }
  },

  getThreadIdChefAssistant: async () => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      // Buscar en localStorage
      const localStorageThreadId = localStorage.getItem(
        "threadIdChefAssistant"
      );

      if (localStorageThreadId) {
        return localStorageThreadId;
      }

      // Si no está en localStorage, buscar en Firestore
      const firestore = getFirestore();
      const userDocRef = doc(firestore, "users", currentUser.uid);

      try {
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const data = userDocSnapshot.data();
          let threadIdFromFirestore = data.threadIdChefAssistant;

          if (!threadIdFromFirestore) {
            // Si no existe en Firestore, llamar a createThreadCase() para obtener un nuevo ID
            threadIdFromFirestore = await createThreadCase();

            // Actualizar Firestore con el nuevo ID
            await updateDoc(userDocRef, {
              threadIdChefAssistant: threadIdFromFirestore,
            });
          }

          // Guardar en localStorage para futuras consultas
          localStorage.setItem("threadIdChefAssistant", threadIdFromFirestore);

          return threadIdFromFirestore;
        } else {
          console.log("No such document!");
          return "";
        }
      } catch (error) {
        console.log("Error getting document:", error);
        return "";
      }
    }

    return "";
  },
}));

export default useUserStore;
