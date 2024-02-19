
import { TranslateInterface } from "../../../interfaces";
import { urlProd } from "../../urlPath";


export const translateCase = async (prompt: string, lang: string) => {
    try {
        const resp = await fetch(`${urlProd}/gpt/translate`, {
            method: 'POST',
            body: JSON.stringify({ prompt, lang }),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        if (resp.ok) {
            const data = await resp.json() as TranslateInterface
            return {
                ok: true,
                message: data.message
            }
        } else {
            throw new Error("No se pudo procesar la solicitud")
        }
    } catch (error) {
        return {
            ok: false,
            message: "No se pudo procesar la solicitud"
        }
    }
}