// generatedUserStore.ts
import { create } from "zustand";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { auth } from "../firebase/firebase";
import { storage } from "../firebase/firebase";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  getFirestore,
} from "firebase/firestore";

interface ImageInfo {
  imageUrl: string;
  isFavorite: boolean;
}

interface GeneratedUserStore {
  addGeneratedImage: (imageData: string, message: string) => Promise<string | undefined>;
  getGeneratedImages: () => Promise<string[]>;
  markImageAsFavorite: (imageIndex: number) => Promise<void>;
  getFavoriteImages: () => Promise<ImageInfo[]>;
}

const useGeneratedUserStore = create<GeneratedUserStore>(() => ({
  addGeneratedImage: async (imageData, message) => {
    try {
      // Obtén el UID del usuario (ajusta según tu lógica de autenticación)
      const currentUser = auth.currentUser;
      const firestore = getFirestore();

      if (!currentUser) {
        console.error("Usuario no autenticado");
        return;
      }

      // Decodifica la cadena Base64 a un ArrayBuffer
      const binaryData = atob(imageData);
      const arrayBuffer = new ArrayBuffer(binaryData.length);
      const uint8Array = new Uint8Array(arrayBuffer);
      for (let i = 0; i < binaryData.length; i++) {
        uint8Array[i] = binaryData.charCodeAt(i);
      }

      // Crea una referencia al almacenamiento con un nombre único para la imagen
      const storageRef = ref(
        storage,
        `users/generated_images/${currentUser?.uid}/${Date.now()}_image.jpg`
      );

      // Sube la imagen al almacenamiento
      await uploadBytes(storageRef, arrayBuffer);

      // Obtiene la URL de descarga de la imagen recién subida
      const downloadURL = await getDownloadURL(storageRef);

      // Actualiza el perfil del usuario con la nueva imagen
      const usuarioRef = doc(firestore, "users", currentUser?.uid);
      const usuarioDoc = await getDoc(usuarioRef);

      if (!usuarioDoc.exists()) {
        // El usuario no tiene el campo userGeneratedImages, crea el perfil con la nueva imagen
        await setDoc(usuarioRef, {
          userGeneratedImages: [
            {
              imageUrl: downloadURL,
              isFavorite: false, // Puedes establecer el valor inicial según tus necesidades
              usedPrompt: message,
            },
          ],
        });
      } else {
        // El usuario ya tiene el campo userGeneratedImages, actualiza el perfil con la nueva imagen
        await updateDoc(usuarioRef, {
          userGeneratedImages: arrayUnion({
            imageUrl: downloadURL,
            isFavorite: false, // Puedes establecer el valor inicial según tus necesidades
            usedPrompt: message,
          }),
        });
      }

      return downloadURL;
    } catch (error: any) {
      console.error(
        "Error al subir la imagen al almacenamiento o actualizar el perfil",
        error.message
      );
      throw error;
    }
  },

  
  getGeneratedImages: async () => {
    try {
      const currentUser = auth.currentUser;
      const firestore = getFirestore();

      if (!currentUser) {
        console.error("Usuario no autenticado");
        return [];
      }

      const usuarioRef = doc(firestore, "users", currentUser?.uid);
      const usuarioDoc = await getDoc(usuarioRef);

      if (usuarioDoc.exists()) {
        const userGeneratedImages = usuarioDoc.data()?.userGeneratedImages || [];
        return userGeneratedImages;
      } else {
        console.error("Perfil del usuario no encontrado");
        return [];
      }
    } catch (error: any) {
      console.error("Error al obtener las imágenes generadas", error.message);
      throw error;
    }
  },


  markImageAsFavorite: async (imageIndex) => {
    try {
      // Obtén el UID del usuario (ajusta según tu lógica de autenticación)
      const currentUser = auth.currentUser;
      const firestore = getFirestore();

      if (!currentUser) {
        console.error("Usuario no autenticado");
        return;
      }

      // Crea una referencia al almacenamiento en la ruta específica
      const storageRef = ref(
        storage,
        `users/generated_images/${currentUser?.uid}/`
      );

      // Obtiene la lista de todos los elementos en la ruta
      const photoList = await listAll(storageRef);

      // Obtiene las URLs de descarga de todas las fotos
      const downloadURLs = await Promise.all(
        photoList.items.map(async (item) => {
          const imageUrl = await getDownloadURL(item);
          return { imageUrl, isFavorite: false }; // Por defecto, todas las imágenes se marcan como no favoritas
        })
      );

      // Verifica si el usuario tiene el campo userGeneratedImages en su perfil
      const usuarioRef = doc(firestore, "users", currentUser.uid);
      const usuarioDoc = await getDoc(usuarioRef);

      if (!usuarioDoc.exists()) {
        // El usuario no tiene el campo userGeneratedImages, crea el perfil con la nueva imagen marcada como favorita
        await setDoc(usuarioRef, {
          userGeneratedImages: [
            {
              imageUrl: downloadURLs[imageIndex].imageUrl,
              isFavorite: true,
            },
          ],
        });
      } else {
        // El usuario ya tiene el campo userGeneratedImages, actualiza la propiedad isFavorite de la imagen seleccionada
        const userGeneratedImages =
          usuarioDoc.data()?.userGeneratedImages || [];
        userGeneratedImages[imageIndex].isFavorite =
          !userGeneratedImages[imageIndex].isFavorite;

        // Actualiza el perfil con el nuevo array modificado
        await updateDoc(usuarioRef, {
          userGeneratedImages,
        });
      }
    } catch (error: any) {
      console.error("Error al marcar la imagen como favorita", error.message);
      throw error;
    }
  },

  getFavoriteImages: async () => {
    try {
      const currentUser = auth.currentUser;
      const firestore = getFirestore();

      if (!currentUser) {
        console.error("Usuario no autenticado");
        return [];
      }

      const usuarioRef = doc(firestore, "users", currentUser?.uid);
      const usuarioDoc = await getDoc(usuarioRef);

      if (usuarioDoc.exists()) {
        const userGeneratedImages = usuarioDoc.data()?.userGeneratedImages;

        if (Array.isArray(userGeneratedImages)) {
          const favoriteImages = userGeneratedImages.filter(
            (image: any) => image.isFavorite === true
          );
          return favoriteImages;
        } else {
          console.error("El campo userGeneratedImages no es un array");
          return [];
        }
      } else {
        console.error("Perfil del usuario no encontrado");
        return [];
      }
    } catch (error: any) {
      console.error("Error al obtener las imágenes favoritas", error.message);
      throw error;
    }
  },
}));

export default useGeneratedUserStore;
