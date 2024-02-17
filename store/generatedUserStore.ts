// generatedUserStore.ts
import {create} from 'zustand';
import { ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';
import { auth } from "../firebase/firebase";
import { storage } from '../firebase/firebase';

interface GeneratedUserStore {
    addGeneratedImage: (imageData: string) => Promise<string>;
    getGeneratedImages: () => Promise<string[]>;
  }
  
  const useGeneratedUserStore = create<GeneratedUserStore>(() => ({
    addGeneratedImage: async (imageData) => {
        try {
          // Obtén el UID del usuario (ajusta según tu lógica de autenticación)
          const currentUser = auth.currentUser;
    
          // Decodifica la cadena Base64 a un ArrayBuffer
          const binaryData = atob(imageData);
          const arrayBuffer = new ArrayBuffer(binaryData.length);
          const uint8Array = new Uint8Array(arrayBuffer);
          for (let i = 0; i < binaryData.length; i++) {
            uint8Array[i] = binaryData.charCodeAt(i);
          }
    
          // Crea una referencia al almacenamiento con un nombre único para la imagen
          const storageRef = ref(storage, `users/generated_images/${currentUser?.uid}/${Date.now()}_image.jpg`);
    
          // Sube la imagen al almacenamiento
          await uploadBytes(storageRef, arrayBuffer);
    
          // Obtiene la URL de descarga de la imagen recién subida
          const downloadURL = await getDownloadURL(storageRef);
    
          return downloadURL;
        } catch (error: any) {
          console.error('Error al subir la imagen al almacenamiento', error.message);
          throw error;
        }
      },

    getGeneratedImages: async () => {
        try {
          // Obtén el UID del usuario (ajusta según tu lógica de autenticación)
          const currentUser = auth.currentUser;
    
          // Crea una referencia al almacenamiento en la ruta específica
          const storageRef = ref(storage, `users/generated_images/${currentUser?.uid}/`);
    
          // Obtiene la lista de todos los elementos en la ruta
          const photoList = await listAll(storageRef);
    
          // Obtiene las URLs de descarga de todas las fotos
          const downloadURLs = await Promise.all(
            photoList.items.map(async (item) => getDownloadURL(item))
          );
    
          return downloadURLs;
        } catch (error: any) {
          console.error('Error al obtener las fotos del almacenamiento', error.message);
          throw error;
        }
      },
  }));
  
  export default useGeneratedUserStore;