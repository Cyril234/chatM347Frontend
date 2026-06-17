import Box from '@mui/material/Box';
import Message from './Message.tsx'
import ChatInput from "./ChatInput.tsx";
import Stack from "@mui/material/Stack";
import type {ChatProps} from "../assets/Props.tsx";
import {useEffect, useRef} from "react";
import { useChatUpdates } from "../hooks/MessageHooks.ts";
import {get} from "../api/api.ts";
import {apiUrl} from "../api/config.ts";
import * as React from "react";

type input = {
    currentUserId: number;
    chatInput: ChatProps;
    sendMessage: (message: string) => void;
};

function Chat({ chatInput, sendMessage, currentUserId }: input) {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [chat, setChat] = React.useState<ChatProps>(chatInput);

    async function updateChat(chatId: string) {
        setChat(await get(apiUrl(`/chat?chat-id=${chatId}`)));
    }

    React.useEffect(() => {
        setChat(chatInput);
    }, [chatInput]);

    const userId = currentUserId; // z.B. aus Auth/UserContext

    const reloadChat = (chatId: string) => {
        if(chatId === chat.chatId) {
            updateChat(chatId);
        }
    };

    useChatUpdates(userId, reloadChat);



    useEffect(() => {
        messagesEndRef.current?.scrollIntoView();
    }, [chat.messages]);

    return (
        <Box sx={{flexGrow: 1, p: 3, height: "100%", paddingLeft: "1", paddingRight: "0"}}>
            <Stack direction="column" spacing={2} sx={{ height: "100%", minHeight: 0 }}>
                <Box sx={{flexGrow: 1, minHeight: 0, overflowY: "auto"}}>
                    <Box sx={{minHeight: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end"}}>
                        {chat?.messages?.map((message) => (
                            <Message
                                text={message.text}
                                senderName={
                                    chat?.members?.find(
                                        member => member.members_id === Number(message.senderId)
                                    )?.name || "Unknown"
                                }
                                timestamp={message.timestamp}
                            />
                        ))}
                        <div ref={messagesEndRef}/>
                    </Box>
                </Box>
                <Box sx={{ flexShrink: 0 }}>
                    <ChatInput sendMessage={sendMessage}/>
                </Box>
            </Stack>
        </Box>
    );
}

export default Chat;
