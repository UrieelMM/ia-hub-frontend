import { useState } from "react";
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

  const {addGeneratedImage} = useGeneratedUserStore();

  const handlePostMessage = async (message: string) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { message: message, isGpt: false }]);

    //TODO: USE CASE
    const imageInfo = await imageGenerationCase(message);
    setIsLoading(false);

    if (!imageInfo) {
      return setMessages((prev) => [
        ...prev,
        { message: "No pude generar la imagen", isGpt: true },
      ]);
    }
    const urlImage = await addGeneratedImage(imageInfo.url);
    setMessages((prev) => [
      ...prev,
      {
        message: message,
        isGpt: true,
        info: { url: urlImage, alt: imageInfo.alt },
      },
    ]);
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

