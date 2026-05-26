export type ChatProps = {
    chatId?: number;
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
    chatId?: number;
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

export type ChatPreview = {
    id: number;
    name: string;
}

export type LoginSignupReturnProps = {
    displayName: string;
    id: number;
}

export type User = {
    id: number;
    username: string;
}
