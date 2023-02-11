export interface ISentMessage {
    text: string;
    roomId?: string;
}

export interface IReceivedMessage {
    text: string;
    authorUsername: string;
    authorId: string;
    date: number;
    roomId?: string;
}