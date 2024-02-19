import { urlProd } from "../../urlPath";

export async function* prosConsStreamGeneratorCase(prompt: string, abortSignal: AbortSignal) {
    try {
        const resp = await fetch(`${urlProd}/gpt/pros-cons-discusser-stream`, {
            method: 'POST',
            body: JSON.stringify({ prompt }),
            signal: abortSignal,
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if(!resp.ok) throw new Error('No se puedo procesar la solicitud');

        const reader = resp.body?.getReader();
        if(!reader) throw new Error('No se puedo generar el reader');

        const decoder = new TextDecoder();
        let text = '';
        while(true){
            const { done, value } = await reader.read();
            if(done) break;
            const decodeChunk = decoder.decode(value, { stream: true });
            text += decodeChunk;
            yield text;
        }

    } catch (error) {
        return null
    }
}