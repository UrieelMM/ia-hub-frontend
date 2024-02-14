import ChatIAPage from "../theme/pages/assistant/ChatIAPage";
import AudioToTextPage from "../theme/pages/audio-to-text/AudioToTextPage";
import ImageGenerationPage from "../theme/pages/image-generate/ImageGenerationPage";



export const menuRoutes = [
  {
    to: '/image-generate',
    title: 'Generar Imagen',
    description: 'Genera imágenes con texto personalizado',
    component: <ImageGenerationPage />,
  },
  {
    to: '/study-assistant',
    title: 'Asistente de Estudio',
    description: 'Asistente de estudio para ayudarte a resolver preguntas y dudas',
    component: <ChatIAPage />,
  },
  {
    to: '/audio-to-text',
    title: 'Audio a Texto',
    description: 'Convierte audio a texto con IA',
    component: <AudioToTextPage />,
  },
];

