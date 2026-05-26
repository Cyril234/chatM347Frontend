import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Chat from '../chat/Chat.tsx';
import Sidebar from "../sidebar/Sidebar.tsx";
import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import type {ChatProps, User} from "../assets/Props.tsx";
import {get, post} from "../api/api.ts";

const drawerWidth = 240;

type ChatSummery = {
    chatId: number;
    name: string;
}

export default function Homescreen() {
    const [currentChatId, setCurrentChatId] = React.useState(1);
    //TODO: only for testing if no chat is available, remove it later, add UI to create new chat and add members to it
    const [currentChat, setCurrentChat] = React.useState<ChatProps>({
        "chatId": 0,
        "meta": {
            "name": "Chat Room 1",
            "createdAt": new Date("2024-06-01T09:00:00Z")
        },
        "members": [
            {
                "members_id": 0,
                "name": "hans"
            },
            {
                "members_id": 1,
                "name": "maria"
            },
            {
                "members_id": 2,
                "name": "peter"
            }
        ],
        "messages": [
            {
                "id": 0,
                "text": "Hello, how are you?",
                "senderId": "0",
                "timestamp": new Date("2024-06-01T10:00:00Z")
            },
            {
                "id": 1,
                "text": "I'm good, thanks! How about you?",
                "senderId": "1",
                "timestamp": new Date("2024-06-01T10:01:00Z")
            },
            {
                "id": 2,
                "text": "Doing well, just working on a project.",
                "senderId": "0",
                "timestamp": new Date("2024-06-01T10:02:00Z")
            },
            {
                "id": 3,
                "text": "That's great! Let me know if you need any help.",
                "senderId": "1",
                "timestamp": new Date("2024-06-01T10:03:00Z")
            },
            {
                "id": 3,
                "text": "Peter",
                "senderId": "2",
                "timestamp": new Date("2024-06-01T10:03:00Z")
            }
        ]
    });
    const [chats, setChats] = React.useState<ChatSummery[]>([]);
    const [user, setUser] = React.useState<User>();

    async function fetchUser(){
        const user = await get("http://localhost:8080/user", true);
        setUser({id: user.id, username: user.username});
    }

    async function sendMessage(message:string){
        setCurrentChat( await post(`http://localhost:8080/chat/sendMessage`, {"chatId": currentChat.chatId, "text": message}, true));
    }

    async function changeChat(chatId:number){
        setCurrentChat(await get(`http://localhost:8080/chat?chat-id=${chatId}`, true));
    }

    //TODO: remove this function, only for testing, add UI to create new chat and add members to it
    async function addChat(){
        await fetch("http://localhost:8080/chat", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: "chat9",
                members: [
                    {
                        members_id: 1,
                        name: "cyril",
                    },
                ],
            }),
        });

        fetchChats();
    }

    async function fetchChats() {
        const chatsSummaries = await get("http://localhost:8080/chat/all-metadata", true);
        setChats(chatsSummaries);
    }

    React.useEffect(() => {
        fetchUser();
        addChat();
        fetchChats();
    }, []);


    return (
        <Box sx={{display: 'flex', height: "100%"}}>
            <CssBaseline/>
            <AppBar position="fixed" sx={{zIndex: (theme) => theme.zIndex.drawer + 1, height: "6vh"}}>
                <Toolbar sx={{display: "flex" , justifyContent: "space-between" }}>
                    <Typography variant="h6" noWrap component="div">
                        Clipped drawer
                    </Typography>
                    <Box>
                        <ListItemButton>
                            <AccountCircleIcon fontSize={"large"}/>
                        </ListItemButton>
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                variant="permanent"
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    [`& .MuiDrawer-paper`]: {width: drawerWidth, boxSizing: 'border-box'},
                }}
            >
                <Sidebar
                    setCurrentChatId={setCurrentChatId}
                    currentChatId={currentChatId}
                    chats={chats}
                    changeChat={changeChat}
                />
            </Drawer>
            <Box sx={{flexGrow: 1, p:0, mt: "6vh", height: "94vh", width: "100%", justifyContent: "flex-end", overflow: "hidden"}}>
                <Chat chat={{...currentChat}} sendMessage={sendMessage}/>
            </Box>
        </Box>
    );
}
