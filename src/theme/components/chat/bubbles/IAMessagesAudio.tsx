import Markdown from "react-markdown";

interface Props {
  message: string;
  audio: string;
}

export const GptMessagesAudio = ({ message, audio }: Props) => {
  return (
    <div className="col-start-1 col-end-10 rounded-lg">
      <div className="flex flex-row items-start">
        <div className="flex items-center justify-center h-10 w-10 rounded-full bg-green-600 flex-shrink-0">
          <img
            className="rounded-lg"
            src="https://res.cloudinary.com/dz5tntwl1/image/upload/v1707862083/_81fceb6f-a735-4a87-840e-d444994d21a3_kpnsko.jpg"
            alt="Assistant Avatar"
          />
        </div>
        <div className="relative w-full ml-3 text-sm bg-black bg-opacity-25 pt-3 px-4 rounded-xl">
          <Markdown>{message}</Markdown>
          <audio className="w-full" autoPlay controls src={audio} />
        </div>
      </div>
    </div>
  );
};
