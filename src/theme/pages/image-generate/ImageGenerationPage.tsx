import { useEffect, useRef, useState } from "react";
import { imageGenerationCase } from "../../../core";
import { IAMessages, IAMessageImages, MyMessages, TypingLoading, ChatInputBox } from "../../components";
import useGeneratedUserStore from "../../../../store/generatedUserStore";

interface Message {
  message: string;
  isGpt: boolean;
  info?: {
    url: string;
    alt: string;
  };
}

const ImageGenerationPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const messagesRef = useRef<HTMLDivElement | null>(null);

    // Scroll to the bottom when messages change
    useEffect(() => {
      if (messagesRef.current) {
        messagesRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, [messages]);

  const {addGeneratedImage} = useGeneratedUserStore();

  const handlePostMessage = async (message: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { message: message, isGpt: false }]);

    if (messagesRef.current) {
      messagesRef.current.scrollIntoView({ behavior: "smooth" });
    }


    //TODO: USE CASE
    const imageInfo = await imageGenerationCase(message);

    if (!imageInfo) {
      return setMessages((prev) => [
        ...prev,
        { message: "No pude generar la imagen", isGpt: true },
      ]);
    }
    const urlImage = await addGeneratedImage(imageInfo.url,message);
    setMessages((prev) => [
      ...prev,
      {
        message: message,
        isGpt: true,
        info: { url: urlImage || "", alt: imageInfo.alt },
      },
    ]);
    setIsLoading(false);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <IAMessages message="Puedo generar imágenes. Solo descríbeme lo que deseas que genere, por ejemplo, un paisaje montañoso. Haré mi mejor esfuerzo." />
          {messages.map((message, index) =>
            message.isGpt ? (
              <IAMessageImages
                key={index}
                message={message.message}
                imageUrl={message.info!.url}
                alt={message.info!.alt}
              />
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

export default ImageGenerationPage;

