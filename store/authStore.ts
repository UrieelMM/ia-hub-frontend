import { create } from "zustand";
import {
  UserCredential,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInWithPopup,
  updatePassword as updateFirebasePassword,
  updateProfile as updateFirebaseProfile,
  updateEmail,
  sendEmailVerification,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import uploadPhotoToStorage from "./functions/fileUploeadToFirestore";

import { auth, provider } from "../firebase/firebase";

interface User {
  email: string;
  displayName?: string;
  photoURL?: File | string;
  password?: string;
  uid?: string;
}

interface AuthStore {
  user: User | null | undefined;
  userError: string | null;
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
  clearUserError: () => void;
  changePassword: (newPassword: string) => Promise<void>;
  changeDisplayName: (newDisplayName: string) => Promise<void>;
  changePhotoURL: (newPhotoURL: File | string) => Promise<void>;
  changeEmail: (newEmail: string) => Promise<void>;
}

const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  userError: null,
  loginUser: (user) => set({ user }),

  //------------------------------------------------------------------------------------------------------------------//
  //------------------------------------------------------------------------------------------------------------------//
  //---------------------------------------Métodos para autenticar y registrar usuarios ------------------------------//
  //------------------------------------------------------------------------------------------------------------------//
  //------------------------------------------------------------------------------------------------------------------//
  logoutUser: async () => {
    try {
      localStorage.removeItem("userIAHUB");
      localStorage.removeItem("threadIdChefAssistant");
      localStorage.removeItem("threadIdStudyAssistant");
      await signOut(auth);
      set({ user: null });
    } catch (error: any) {
      localStorage.removeItem("userIAHUB");
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
    const userDocRef = doc(firestore, "users", response.user?.uid); // Establecer el uid como identificador del documento
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
      const userDocRef = doc(firestore, "users", response.user?.uid); // Establecer el uid como identificador del documento
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

      // Verificar si el documento ya existe en Firestore
      const firestore = getFirestore();
      const userDocRef = doc(firestore, "users", response.user?.uid);

      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // Si el documento ya existe, utiliza los datos existentes
        const existingUserData = userDocSnapshot.data();
        set({ user: { ...googleUser, ...existingUserData }, userError: null });
        return { ...googleUser, ...existingUserData };
      } else {
        // Si el documento no existe, créalo en Firestore
        await setDoc(userDocRef, {
          uid: response.user?.uid,
          email: googleUser.email,
          photoURL: googleUser.photoURL,
          displayName: googleUser.displayName,
        });

        set({ user: googleUser, userError: null });
        return googleUser;
      }
    } catch (error: any) {
      console.error("Error al iniciar sesión con Google:", error.message);
      return null;
    }
  },

  clearUserError: () => set({ userError: null }),

  //------------------------------------------------------------------------------------------------------------------//
  //------------------------------------------------------------------------------------------------------------------//
  //---------- Métodos para cambiar la contraseña, el nombre de visualización y la URL de la foto de perfil ----------//
  //------------------------------------------------------------------------------------------------------------------//
  //------------------------------------------------------------------------------------------------------------------//

  changePassword: async (newPassword) => {
    const user = auth.currentUser;

    if (user) {
      try {
        const providerData = user.providerData;

        // Verificar si el proveedor asociado es Google
        const isGoogleProvider = providerData.some(
          (provider) => provider.providerId === "google.com"
        );

        if (isGoogleProvider) {
          console.log(
            "No se puede cambiar la contraseña para cuentas autenticadas con Google"
          );
          throw new Error(
            "No se puede cambiar la contraseña para cuentas autenticadas con Google"
          );
        }

        // Cambiar la contraseña para cuentas con correo y contraseña
        await updateFirebasePassword(user, newPassword);

        console.log("Contraseña cambiada exitosamente");
      } catch (error: any) {
        console.error("Error al cambiar la contraseña", error.message);
        throw error;
      }
    } else {
      console.error("Usuario no autenticado");
      throw new Error("Usuario no autenticado");
    }
  },

  changeDisplayName: async (newDisplayName) => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        // Actualizar el nombre de visualización en Firebase Authentication
        await updateFirebaseProfile(currentUser, {
          displayName: newDisplayName,
        });

        // Actualizar el nombre de visualización en Firestore
        const firestore = getFirestore();
        const userDocRef = doc(firestore, "users", currentUser.uid);
        await updateDoc(userDocRef, { displayName: newDisplayName });

        // Actualizar el estado local y almacenamiento local
        set({
          user: {
            ...currentUser,
            displayName: newDisplayName,
            email: currentUser.email || "",
            photoURL: currentUser.photoURL || "",
          },
        });
        localStorage.setItem(
          "userIAHUB",
          JSON.stringify({ ...currentUser, displayName: newDisplayName })
        );

        console.log("Nombre de visualización cambiado exitosamente");
      } catch (error: any) {
        console.error(
          "Error al cambiar el nombre de visualización",
          error.message
        );
        throw error;
      }
    } else {
      console.error("Usuario no autenticado");
      throw new Error("Usuario no autenticado");
    }
  },

  changePhotoURL: async (newPhotoURL) => {
    const user = auth.currentUser;
  
    if (user) {
      try {
        let photoURL: string | null = null;
  
        if (newPhotoURL instanceof File) {
          // Si newPhotoURL es un File, sube la foto a almacenamiento y obtén la URL
          photoURL = await uploadPhotoToStorage(newPhotoURL, user.uid);
        } else if (typeof newPhotoURL === 'string') {
          // Si newPhotoURL ya es una URL, úsala directamente
          photoURL = newPhotoURL;
        }
  
        // Actualizar el perfil de Firebase con la nueva URL de la foto
        await updateFirebaseProfile(user, { photoURL });
  
        // Actualizar el documento del usuario en Firestore con la nueva URL de la foto
        const firestore = getFirestore();
        const userDocRef = doc(firestore, 'users', user.uid);
        await updateDoc(userDocRef, { photoURL });
  
        console.log('URL de foto cambiada exitosamente');
      } catch (error: any) {
        console.error('Error al cambiar la URL de la foto', error.message);
        throw error;
      }
    } else {
      console.error('Usuario no autenticado');
      throw new Error('Usuario no autenticado');
    }
  },

  changeEmail: async (newEmail) => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      try {
        // Solicitar verificación del nuevo correo electrónico
        await sendEmailVerification(currentUser);

        // Indicar al usuario que debe verificar su nuevo correo electrónico
        console.log(
          "Se ha enviado un correo de verificación a la nueva dirección de correo electrónico. Por favor, verifica tu correo antes de realizar el cambio."
        );

        // Manejar la verificación manualmente aquí
        const isVerified = window.confirm(
          "Se ha enviado un correo de verificación. ¿Has verificado tu correo electrónico?"
        );

        if (isVerified) {
          // Actualizar el correo electrónico en Firebase Authentication después de la verificación
          await updateEmail(currentUser, newEmail);

          // Actualizar el correo electrónico en Firestore
          const firestore = getFirestore();
          const userDocRef = doc(firestore, "users", currentUser.uid);
          await updateDoc(userDocRef, { email: newEmail });

          // Actualizar el estado local y almacenamiento local
          set({
            user: {
              ...currentUser,
              email: newEmail,
              displayName: currentUser.displayName || "",
              photoURL: currentUser.photoURL || "",
            },
          });
          localStorage.setItem(
            "userIAHUB",
            JSON.stringify({ ...currentUser, email: newEmail })
          );

          console.log("Correo electrónico cambiado exitosamente.");
        } else {
          // El usuario no ha verificado su correo electrónico
          console.warn(
            "No se realizó el cambio de correo electrónico porque el usuario no verificó su correo electrónico."
          );
        }
      } catch (error: any) {
        console.error("Error al cambiar el correo electrónico", error.message);
        throw error;
      }
    } else {
      console.error("Usuario no autenticado");
      throw new Error("Usuario no autenticado");
    }
  },
}));

export default useAuthStore;
