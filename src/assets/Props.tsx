export type ChatProps = {
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
    id: number;
    name: string;
    createdAt: Date;
}

export type Member = {
    id: number;
    name: string;
}

export type MessageProps = {
    text: string;
    senderName: string;
    timestamp: Date;
};