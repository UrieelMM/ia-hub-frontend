import { useEffect, useRef, useState } from "react";
import {
  IAMessages,
  MyMessages,
  ChatInputBox,
  TypingLoading,
} from "../../components";
import { prosConsStreamGeneratorCase } from "../../../core/use-cases/comparisons/comparisons.use-case";

interface Message {
  message: string;
  isGpt: boolean;
}

const ComparisonsPage = () => {
  const abortController = useRef(new AbortController());
  const isRunning = useRef(false);

  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const messagesRef = useRef<HTMLDivElement | null>(null);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handlePostMessage = async (message: string) => {
    if (isRunning.current) {
      abortController.current.abort();
      abortController.current = new AbortController();
    }

    setIsLoading(true);
    isRunning.current = true;

    setMessages((prev) => [...prev, { message: message, isGpt: false }]);

    if (messagesRef.current) {
      messagesRef.current.scrollIntoView({ behavior: "smooth" });
    }

    //GENERATOR WAY
    const stream = prosConsStreamGeneratorCase(
      message,
      abortController.current.signal
    );
    setIsLoading(false);
    setMessages((messages) => [...messages, { message: "", isGpt: true }]);

    for await (const text of stream) {
      setMessages((messages) => {
        const newMessages = [...messages];
        newMessages[newMessages.length - 1].message = text;
        return newMessages;
      });
    }

    isRunning.current = false;
  };
  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <IAMessages message="Puedo ayudarte a comparar dos elementos, informándote sobre los pros y contras. Por ejemplo, ventajas y desventajas de viajar en tren versus avión." />
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
        disableCorrections={true}
      />
    </div>
  );
};

export default ComparisonsPage;
