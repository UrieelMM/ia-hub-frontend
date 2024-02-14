import { FormEvent, useState } from "react";

interface Props {
    onSendMessage: (message: string) => void;
    placeholder?: string;
    disableCorrections?: boolean;
}

export const ChatInputBox = ({ onSendMessage, placeholder, disableCorrections }: Props) => {
    const [message, setMessage] = useState('');

    const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if(!message.trim()) {
            return;
        }
        onSendMessage(message);
        setMessage('');
    }

    return (
        <form onSubmit={handleSendMessage}
            className="flex flex-row items-center h-16 bg-white w-full px-4 rounded-xl">
            <div className="flex-grow">
                <div className="relative w-full">
                    <input type="text" autoFocus className="flex w-full border rounded-xl text-gray-800 focus:outline-none focus:border-emerald-500 p-2"
                        placeholder={placeholder}
                        autoComplete={disableCorrections ? "on" : "off"}
                        autoCorrect={disableCorrections ? "on" : "off"}
                        spellCheck={disableCorrections ? "true" : "false"}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)} />
                </div>
            </div>

            <div className="ml-4">
                <button className="btn-primary">
                    <span>Enviar</span>
                    <i className="fa-regular fa-paper-plane"></i>
                </button>
            </div>
        </form>
    )
}