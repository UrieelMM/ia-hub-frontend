import {SidebarItem} from "../index";

export const sectionItems: SidebarItem[] = [
  {
    key: "assistants",
    title: "Asistentes",
    items: [
      {
        key: "chef-assistant",
        href: "/chef-assistant",
        title: "Asistente de Cocina",
        icon: "icon-park-outline:chef-hat-one",
      },
      {
        key: "study-assistant",
        href: "/study-assistant",
        title: "Asistente de Estudio",
        icon: "mdi:robot-happy-outline",
      },
    ],
  },
  {
    key: "transform",
    title: "Transformar",
    items: [
      {
        key: "audio-to-text",
        href: "/audio-to-text",
        icon: "fluent:slide-text-24-regular",
        title: "Audio a Texto",
      },
      {
        key: "text-to-audio",
        href: "/text-to-audio",
        icon: "wpf:audio-wave",
        title: "Texto a Audio",
      },
    ],
  },
];

export const sectionItemsWithTeams: SidebarItem[] = [
  ...sectionItems,
  {
    key: "tools",
    title: "Herramientas",
    items: [
      {
        key: "image-generate",
        href: "/image-generate",
        icon: "mdi:image-outline",
        title: "Generar Imagen",
      },
      {
        key: "translate",
        href: "/translate",
        icon: "ph:translate-bold",
        title: "Traductor",
      },
      {
        key: "comparisons",
        href: "/comparisons",
        title: "Comparar opciones",
        icon: "fluent:branch-compare-24-filled",
      },
    ],
  },
];