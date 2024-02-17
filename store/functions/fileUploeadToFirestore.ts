import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../firebase/firebase';

const uploadPhotoToStorage = async (photoFile: File, uid: string): Promise<string> => {
  try {
    // Crear una referencia al almacenamiento con un nombre único para la imagen
    const storageRef = ref(storage, `users/profile_photos/${uid}/${Date.now()}_${photoFile.name}`);

    // Subir la imagen al almacenamiento
    await uploadBytes(storageRef, photoFile);

    // Obtener la URL de descarga de la imagen recién subida
    const downloadURL = await getDownloadURL(storageRef);

    return downloadURL;
  } catch (error: any) {
    console.error('Error al subir la foto al almacenamiento', error.message);
    throw error;
  }
};

export default uploadPhotoToStorage;
