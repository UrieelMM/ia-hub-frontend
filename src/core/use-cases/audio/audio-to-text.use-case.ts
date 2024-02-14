import { AudioToTextInterface } from "../../../interfaces";
import { urlProd } from "../../urlPath";

export const audioToTextCase = async (audioFile: File, prompt?: string) => {
    try {

        const formData = new FormData();
        formData.append('file', audioFile);
        if (prompt) {
            formData.append('prompt', prompt);
        }

        const resp = await fetch(`${urlProd}/gpt/audio-to-text`, {
            method: 'POST',
            body: formData,
        });

        const data = await resp.json() as AudioToTextInterface;

        return data;

    } catch (error) {
        console.log(error);
        return error;
    }
}