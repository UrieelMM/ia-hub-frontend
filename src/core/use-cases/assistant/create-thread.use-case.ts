import { urlProd } from "../../urlPath";


export const createThreadCase = async () => {
    try {
        const response = await fetch(`${urlProd}/ia-assistant/create-thread`, {
            method: "POST",
        });

        const {id} = await response.json() as {id: string};

        return id;

    } catch (error) {
        throw new Error("Error creating thread.");
    }
}