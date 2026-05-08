import Box from '@mui/material/Box';
import Message from './Message.tsx'
import ChatInput from "./ChatInput.tsx";
import Stack from "@mui/material/Stack";
import type {ChatProps} from "../assets/Props.tsx";
import {useEffect, useRef} from "react";

type input = {
    chat: ChatProps;
    sendMessage: (message: string) => void;
};

function Chat({ chat, sendMessage }: input) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView();
    }, [chat.messages]);

    console.log(chat)
    return (
        <Box sx={{flexGrow: 1, p: 3, height: "100%", paddingLeft: "1", paddingRight: "0"}}>
            <Stack direction="column" spacing={2} sx={{ height: "100%", minHeight: 0 }}>
                <Box sx={{flexGrow: 1, minHeight: 0, overflowY: "auto"}}>
                    <Box sx={{minHeight: "100%", display: "flex", flexDirection: "column", justifyContent: "flex-end"}}>
                        {chat.messages.map((message) => (
                            <Message
                                text={message.text}
                                senderName={chat.members.find(member => member.id === parseInt(message.senderId))?.name || "Unknown"}
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
