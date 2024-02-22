import { useRef, useState } from "react"
import { IAMessages, MyMessages, TypingLoading, TextMessageBoxFile } from "../../components";
import { audioToTextCase } from "../../../core/use-cases/audio/audio-to-text.use-case";
import "./audioToTextPage.css"
interface Message {
  message: string;
  isGpt: boolean;
}

const AudioToTextPage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  const messagesRef = useRef<HTMLDivElement | null>(null);

  const handlePostMessage = async (message: string, audioFile: File) => {
    setIsLoading(true);
    setMessages((prev) => [...prev, { message: message, isGpt: false }]);

    if (messagesRef.current) {
      messagesRef.current.scrollIntoView({ behavior: "smooth" });
    }

    //TODO: USE CASE
    const response = await audioToTextCase(audioFile, message);
    setIsLoading(false);

    if (!response) return;

    const gptMessages = `
## Transcripción de audio:
### __Duración:__ ${Math.round((response as { duration: number }).duration)} segundos
### Texto: 
${(response as { text: string }).text}
    `;

    setMessages((prev) => [...prev, { message: gptMessages, isGpt: true }]);

//     for (const segment of (response as { segments: any[] }).segments) {
//       const segmentMessage = `
// #### __De:__ ${Math.round(segment.start)} segundos __A:__ ${Math.round(segment.end)} segundos
// #### __Texto:__ ${segment.text}
//       `;
//       setMessages((prev) => [...prev, { message: segmentMessage, isGpt: true }]);
//     }
  }

  return (
    <div className="chat-container">
      <div className="chat-messages">
        <div className="grid grid-cols-12 gap-y-2">
          <IAMessages message="Selecciona el archivo de audio que quieres que transcriba. Tamaño máximo del archivo: 10 MB." />
          {
            messages.map((message, index) => (
              message.isGpt
                ? <IAMessages key={index} message={message.message} />
                : <MyMessages key={index} message={(message.message === "" ? "Transcribe el audio" : message.message)} />
            ))
          }
          {
            isLoading && (
              <div className="fade-in col-start-1 col-end-12">
                <TypingLoading />
              </div>
            )
          }
          <div ref={messagesRef} />
        </div>
      </div>

      <TextMessageBoxFile
        onSendMessage={handlePostMessage}
        placeholder="Envía un mensaje"
        disableCorrections={true}
        accept="audio/*"
      />
    </div>
  )
}

export default AudioToTextPage