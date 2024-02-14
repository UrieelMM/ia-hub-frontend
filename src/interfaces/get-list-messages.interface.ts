export interface GetListMessagesResponse {
    role:    Role;
    content: string[];
}

export enum Role {
    Assistant = "assistant",
    User = "user",
}