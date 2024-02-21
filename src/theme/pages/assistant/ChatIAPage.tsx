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

const ChatIAPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const [threadId, setThreadId] = useState<any>("");

  const messagesRef = useRef<HTMLDivElement | null>(null);

  const { setThreadIdStudyAssistant, getThreadIdStudyAssistant } =
    useUserStore();

  //Obtener el threadId y si no existe crear uno

  useEffect(() => {
    const getOrCreateThreadId = async () => {
      const threadId = await getThreadIdStudyAssistant();
      if (threadId) {
        setThreadId(threadId);
      } else {
        const id = await createThreadCase()
          setThreadId(id);
          setThreadIdStudyAssistant(id);
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
    //   // Recarga la página después de 40 segundos si no hay respuesta
    //   getListMessages();
    // }, 50000);

    try {
      // TODO: USE CASE
      const assistantId = "asst_dmC3MwUpJztpb3L1XTuYuyCz";
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
      getListMessages();
    } finally {
      setIsLoading(false);
      // Limpiar el temporizador si la respuesta llega antes de los 40 segundos
      // clearTimeout(timeoutId);
    }
    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <IAMessages message="¡Hola! Soy tu asistente de estudio. Puedo ayudarte a preparte para tus exámenes." />
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

export default ChatIAPage;
