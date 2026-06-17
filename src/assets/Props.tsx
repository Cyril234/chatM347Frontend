export type ChatProps = {
    chatId?: string;
    meta: ChatMetadata;
    members: Member[];
    messages: ChatMessage[];
};

export type ChatMessage = {
    id: number;
    text: string;
    senderId: string;
    timestamp: Date;
};

export type ChatMetadata = {
    chatId?: string;
    id?: number;
    name: string;
    createdAt: Date;
}

export type Member = {
    members_id: number;
    name: string;
}

export type MessageProps = {
    text: string;
    senderName: string;
    senderId?: number;
    timestamp: Date;
};