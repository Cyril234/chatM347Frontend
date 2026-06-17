import { Client } from "@stomp/stompjs";
import { useEffect } from "react";
import { WS_URL } from "../api/config.ts";

type ChatUpdateEvent = {
    type: "CHAT_CREATED" | "MESSAGE_CREATED";
    chatId: string;
    messageId?: number;
};

export function useChatUpdates(
    userId: number | undefined,
    reloadChat: (chatId: string) => void
) {
    useEffect(() => {
        if (!userId) return;

        const client = new Client({
            brokerURL: WS_URL,
            reconnectDelay: 5000,

            onConnect: () => {
                client.subscribe(`/topic/users/${userId}/messages`, (message) => {
                    const event: ChatUpdateEvent = JSON.parse(message.body);

                    if (event.type === "MESSAGE_CREATED") {
                        reloadChat(event.chatId);
                    }
                });
            },
        });

        client.activate();

        return () => {
            client.deactivate();
        };
    }, [userId, reloadChat]);
}