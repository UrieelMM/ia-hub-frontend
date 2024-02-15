import { FormEvent, useState } from "react";

interface Props {
    onSendMessage: (message: string, selectedOption: string) => void;
    placeholder?: string;
    disableCorrections?: boolean;
    options: Option[];
}

interface Option {
    id: string;
    text: string;
}

export const TextMessageBoxSelect = ({onSendMessage, placeholder, disableCorrections, options,}: Props) => {
    const [message, setMessage] = useState("");
    const [selectedOption, setSelectedOption] = useState<string>("");

    const handleSendMessage = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!message.trim()){
            return;
        }
        if(!selectedOption){
            return;
        }
        if(selectedOption === "") return;

        onSendMessage(message, selectedOption);
        setMessage("");
    };

    return (
        <form
            onSubmit={handleSendMessage}
            className="flex flex-row items-center h-16 bg-white w-full px-4 rounded-xl"
        >
            <div className="flex-grow">
                <div className="flex">
                    <input
                        type="text"
                        autoFocus
                        className="w-full border rounded-xl text-gray-800 focus:outline-none focus:border-cyan-500 p-2"
                        placeholder={placeholder}
                        autoComplete={disableCorrections ? "on" : "off"}
                        autoCorrect={disableCorrections ? "on" : "off"}
                        spellCheck={disableCorrections ? "true" : "false"}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <select
                        name="select"
                        className="w-2/5 ml-5 border rounded-xl text-gray-800 focus:outline-none focus:border-cyan-300 pl-4 h-10"
                        value={selectedOption}
                        onChange={(e) => setSelectedOption(e.target.value)}
                    >
                        <option value="">Seleccione</option>
                        Selecciona una opción
                        {options.map((option) => (
                            <option key={option.id} value={option.id}>
                                {option.text}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="ml-4">
                <button className="btn-primary">
                    <span className="mr-2">Enviar</span>
                    <i className="fa-regular fa-paper-plane"></i>
                </button>
            </div>
        </form>
    );
};
