import { GetListMessagesResponse } from "../../../interfaces";
import { urlProd } from "../../urlPath";


export const getListMessagesCase = async (threadId: string) => {
    try {
        const response = await fetch(`${urlProd}/ia-assistant/list-messages`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                threadId,
            }),
        });
        const listMessages = await response.json() as GetListMessagesResponse | undefined;
        return listMessages;
    } catch (error) {
        console.log(error);
    }
}