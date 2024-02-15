import { urlProd } from "../../urlPath";
export const textToAudioCase = async (prompt: string, voice: string) => {
    try {
        const resp = await fetch(`${urlProd}/gpt/text-to-audio`, {
            method: 'POST',
            body: JSON.stringify({ prompt, voice }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (resp.ok) {
            const audioFile = await resp.blob();
            const audioUrl = URL.createObjectURL(audioFile);
            return {
                ok: true,
                audioUrl,
                messageToAudio: prompt,
            }
        } else {
            throw new Error("No se pudo procesar la solicitud")
        }
    } catch (error) {
        return {
            ok: false,
            audioUrl: "",
            messageToAudio: error
        }
    }
}