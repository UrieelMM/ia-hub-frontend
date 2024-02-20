import ChatIAPage from "../theme/pages/assistant/ChatIAPage";
import AudioToTextPage from "../theme/pages/audio-to-text/AudioToTextPage";
import ImageGenerationPage from "../theme/pages/image-generate/ImageGenerationPage";
import ConfigurationPage from "../theme/pages/configuration/ConfigurationPage";
import TextToAudioPage from "../theme/pages/text-to-audio/TextToAudioPage";
import GaleryPage from "../theme/pages/galery/GaleryPage";
import TranslatePage from "../theme/pages/translate/TranslatePage";
import ComparisonsPage from "../theme/pages/comparisons/ComparisonsPage";
import ChefIAPage from "../theme/pages/assistant/ChefIAPage";



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
  {
    to: '/translate',
    title: 'Traductor',
    description: 'Traduce texto a diferentes idiomas',
    component: <TranslatePage />,
  },
  {
    to: '/comparisons',
    title: 'Comparaciones',
    description: 'Comparaciones entre productos o servicios',
    component: <ComparisonsPage />,
  },
  {
    to: '/kitchen-assistant',
    title: 'Asistente de Cocina',
    description: 'Asistente de cocina para ayudarte a preparar deliciosas recetas de cocina',
    component: <ChefIAPage />,
  },
];

