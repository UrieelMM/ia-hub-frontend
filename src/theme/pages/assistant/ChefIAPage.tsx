import { useState, useEffect, useRef } from "react";
import {
  createThreadCase,
  getListMessagesCase,
  postQuestionCase,
} from "../../../core";
import {
  IAMessages,
  MyMessages,
  TypingLoading,
  ChatInputBox,
} from "../../components";
import useUserStore from "../../../../store/userStore";
import "./assistants.css";

interface Message {
  message: string;
  isGpt: boolean;
}

const ChefIAPage = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const [threadId, setThreadId] = useState<any>("");

  const messagesRef = useRef<HTMLDivElement | null>(null);

  const { setThreadIdChefAssistant, getThreadIdChefAssistant } =
    useUserStore();

  //Obtener el threadId y si no existe crear uno
  useEffect(() => {
    const getOrCreateThreadId = async () => {
      const threadId = await getThreadIdChefAssistant();
      if (threadId) {
        return setThreadId(threadId);
      } else {
        const id = await createThreadCase()
          setThreadId(id);
          setThreadIdChefAssistant(id);
      }
    };
    getOrCreateThreadId();
  }, []);

  //get list messages when page load
  const getListMessages = async () => {
    try {
      const replies = await getListMessagesCase(threadId);

      if (!Array.isArray(replies)) return;

      for (const reply of replies) {
        for (const message of reply.content) {
          setMessages((prev) => [
            ...prev,
            {
              message: message,
              isGpt: reply.role === "assistant",
              info: reply,
            },
          ]);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (!threadId) return;
    getListMessages();
  }, [threadId]);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handlePostMessage = async (message: string) => {
    if (!threadId) return;

    if (messagesRef.current) {
      messagesRef.current.scrollIntoView({ behavior: "smooth" });
    }

    setIsLoading(true);
    setMessages((prev) => [...prev, { message: message, isGpt: false }]);

    //TODO: USE CASE
    // const timeoutId = setTimeout(() => {
    //   console.warn(
    //     "La API tardó demasiado en responder. Recargando la página..."
    //   );
    //   getListMessages();
    // }, 70000);

    try {
      // TODO: USE CASE
      const assistantId = "asst_sgHHHYeQjjD74BJlWFbkyeYi";
      const replies = await postQuestionCase(threadId, message, assistantId);

      // Limpiar mensajes
      setMessages([]);

      for (const reply of replies) {
        for (const message of reply.content) {
          setMessages((prev) => [
            ...prev,
            {
              message: message,
              isGpt: reply.role === "assistant",
              info: reply,
            },
          ]);
        }
      }
    } catch (error) {
      console.error("Error al llamar a la API", error);
      window.location.reload();
    } finally {
      setIsLoading(false);
      // Limpiar el temporizador si la respuesta llega antes de los 80 segundos
      // clearTimeout(timeoutId);
    }
    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <IAMessages message="¡Hola! Soy el Chef Cookie. Estoy aquí para ayudar a preparar deliciosas recetas de cocina." />
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

      <ChatInputBox
        onSendMessage={handlePostMessage}
        placeholder="Envía un mensaje"
        disableCorrections
      />
    </div>
  );
};

export default ChefIAPage;
