import ChatIAPage from "../theme/pages/assistant/ChatIAPage";
import AudioToTextPage from "../theme/pages/audio-to-text/AudioToTextPage";
import ImageGenerationPage from "../theme/pages/image-generate/ImageGenerationPage";
import ConfigurationPage from "../theme/pages/configuration/ConfigurationPage";
import TextToAudioPage from "../theme/pages/text-to-audio/TextToAudioPage";
import GaleryPage from "../theme/pages/galery/GaleryPage";



export const menuRoutes = [
  {
    to: '/study-assistant',
    title: 'Asistente de Estudio',
    description: 'Asistente de estudio para ayudarte a resolver preguntas y dudas',
    component: <ChatIAPage />,
  },
  {
    to: '/image-generate',
    title: 'Generar Imagen',
    description: 'Genera imágenes con texto personalizado',
    component: <ImageGenerationPage />,
  },
  {
    to: '/audio-to-text',
    title: 'Audio a Texto',
    description: 'Convierte audio a texto con IA',
    component: <AudioToTextPage />,
  },
  {
    to: '/text-to-audio',
    title: 'Texto a Audio',
    description: 'Convierte texto a audio con IA',
    component: <TextToAudioPage />,
  },
  {
    to: '/user-galery',
    title: 'Galería de Usuario',
    description: 'Galería de usuario para ver imágenes generadas y audios convertidos',
    component: <GaleryPage />,
  },
  {
    to: '/user-configuration',
    title: 'Configuración de Usuario',
    description: 'Configuración de usuario para cambiar datos personales',
    component: <ConfigurationPage />,
  },
];

