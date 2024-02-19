import { useEffect, useRef, useState } from "react";
import {
  IAMessages,
  MyMessages,
  TypingLoading,
  TextMessageBoxSelect,
} from "../../components";
import { translateCase } from "../../../core/use-cases/translate/translate.use-case";

interface Message {
  message: string;
  isGpt: boolean;
}

const languages = [
  { id: "alemán", text: "Alemán" },
  { id: "árabe", text: "Árabe" },
  { id: "bengalí", text: "Bengalí" },
  { id: "francés", text: "Francés" },
  { id: "hindi", text: "Hindi" },
  { id: "inglés", text: "Inglés" },
  { id: "japonés", text: "Japonés" },
  { id: "mandarín", text: "Mandarín" },
  { id: "portugués", text: "Portugués" },
  { id: "ruso", text: "Ruso" },
  { id: "español", text: "Español" },
];

const TranslatePage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const messagesRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handlePostMessage = async (message: string, selectedOption: string) => {
    setIsLoading(true);
    const newMessage = `Traduce: "${message}" al idioma ${selectedOption}`;

    setMessages([...messages, { message: newMessage, isGpt: false }]);

    if (messagesRef.current) {
      messagesRef.current.scrollIntoView({ behavior: "smooth" });
    }

    //TODO: USE CASE
    const data = await translateCase(message, selectedOption);
    if (!data.ok) {
      return alert("No se pudo traducir el mensaje`" + message + "`");
    }

    setMessages((prev) => [...prev, { message: data.message, isGpt: true }]);
    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <IAMessages message="¿Qué deseas que traduzca? Ingresa el texto que necesitas traducir y elige el idioma." />
          {messages.map((message, index) =>
            message.isGpt ? (
              <IAMessages key={index} message={message.message} />
            ) : (
              <MyMessages key={index} message={message.message} />
            )
          )}
          {isLoading && (
            <div className="fade-in col-start-1 col-end-12">
              <TypingLoading />
            </div>
          )}
          <div ref={messagesRef} />
        </div>
      </div>

      <TextMessageBoxSelect
        onSendMessage={handlePostMessage}
        placeholder="Envía un mensaje"
        options={languages}
      />
    </div>
  );
};

export default TranslatePage;
