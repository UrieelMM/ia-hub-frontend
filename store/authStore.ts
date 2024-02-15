import { create } from "zustand";
import {
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../firebase/firebase";

interface User {
  email: string;
  displayName?: string;
  photoURL?: string;
  password?: string;
  uid?: string;
}

interface AuthStore {
  user: User | null;
  userError: string | null; // Nuevo estado para almacenar el mensaje de error
  loginUser: (user: User) => void;
  loginWithEmailAndPassword?: (user: {
    email: string;
    password: string;
  }) => Promise<User | null>;
  loginWithGoogle?: () => Promise<User | null>;
  registerWithGoogle: () => Promise<User | null>;
  logoutUser: () => Promise<void>;
  registerUser: (user: {
    email: string;
    password: string;
    displayName: string;
  }) => Promise<User | null>;
  clearUserError: () => void; // Nueva función para limpiar el mensaje de error
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  userError: null,
  loginUser: (user) => set({ user }),

  logoutUser: async () => {
    try {
      localStorage.removeItem('userIAHUB');
      await signOut(auth);
      set({ user: null });
    } catch (error: any) {
      localStorage.removeItem('userIAHUB');
      console.error("Error al cerrar sesión:", error.message);
      throw error;
    }
  },

  registerUser: async (user) => {
    const response: UserCredential = await createUserWithEmailAndPassword(
      auth,
      user.email,
      user.password
    );
    const registeredUser: User = {
      email: response.user?.email || "",
      displayName: user.displayName,
      uid: response.user?.uid || "",
    };

    // Crear un documento en Firestore con el uid como llave
    const firestore = getFirestore();
    const userDocRef = doc(firestore, 'users', response.user?.uid); // Establecer el uid como identificador del documento
    await setDoc(userDocRef, { 
      uid: response.user?.uid,
      email: registeredUser.email,
      photoURL: registeredUser.photoURL || "",
      displayName: registeredUser.displayName,
    });

    set({ user: registeredUser, userError: null });
    return registeredUser;
  },

  loginWithEmailAndPassword: async (user) => {
    const response: UserCredential = await signInWithEmailAndPassword(
      auth,
      user.email,
      user.password
    );
    const loggedUser: User = {
      email: response.user?.email || "",
      displayName: response.user?.displayName || "",
      uid: response.user?.uid || "",
    };

    set({ user: loggedUser, userError: null });
    return loggedUser;
  },

  registerWithGoogle: async () => {
    try {
      const response: UserCredential = await signInWithPopup(auth, provider);
      const googleUser: User = {
        email: response.user?.email || "",
        displayName: response.user?.displayName || "",
        photoURL: response.user?.photoURL || "",
        uid: response.user?.uid || "",
      };

      // Crear un documento en Firestore con el uid como llave
      const firestore = getFirestore();
      const userDocRef = doc(firestore, 'users', response.user?.uid); // Establecer el uid como identificador del documento
      await setDoc(userDocRef, { 
        uid: response.user?.uid,
        email: googleUser.email,
        photoURL: googleUser.photoURL,
        displayName: googleUser.displayName,
      });

      set({ user: googleUser, userError: null });
      return googleUser;
    } catch (error: any) {
      console.error("Error al iniciar sesión con Google:", error.message);
      return null;
    }
  },

  loginWithGoogle: async () => {
    try {
      const response: UserCredential = await signInWithPopup(auth, provider);
      const googleUser: User = {
        email: response.user?.email || "",
        displayName: response.user?.displayName || "",
        photoURL: response.user?.photoURL || "",
        uid: response.user?.uid || "",
      };

      set({ user: googleUser, userError: null });
      return googleUser;
    } catch (error: any) {
      console.error("Error al iniciar sesión con Google:", error.message);
      return null;
    }
  },

  clearUserError: () => set({ userError: null }),
}));

export default useAuthStore;
