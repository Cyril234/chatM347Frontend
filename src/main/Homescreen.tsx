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
import type {ChatProps, ChatMessage} from "../assets/Props.tsx";

const drawerWidth = 240;



export default function Homescreen() {
    const [currentChatId, setCurrentChatId] = React.useState(1);
    const [currentChat, setCurrentChat] = React.useState<ChatProps>({
        "meta": {
            "id": 0,
            "name": "Chat Room 1",
            "createdAt": new Date("2024-06-01T09:00:00Z")
        },
        "members": [
            {
                "id": 0,
                "name": "hans"
            },
            {
                "id": 1,
                "name": "maria"
            },
            {
                "id": 2,
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


    function sendMessage(message:string){
        const newMessage: ChatMessage = {
            id: 10,
            text: message,
            senderId: "1",
            timestamp: new Date(),
        };
        setCurrentChat(prev => ({
            ...prev,
            messages: [...prev.messages, newMessage],
        }));
    }

    function changeChat(chatId:number){
        const chats:ChatProps[] = [
            {
                "meta": {
                    "id": 0,
                    "name": "Chat Room 1",
                    "createdAt": new Date("2024-06-01T09:00:00Z")
                },
                "members": [
                    {
                        "id": 0,
                        "name": "hans"
                    },
                    {
                        "id": 1,
                        "name": "maria"
                    },
                    {
                        "id": 2,
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
            },
            {
                "meta": {
                    "id": 1,
                    "name": "Chat Room 2",
                    "createdAt": new Date("2024-06-02T08:30:00Z")
                },
                "members": [
                    {
                        "id": 0,
                        "name": "hans"
                    },
                    {
                        "id": 1,
                        "name": "maria"
                    },
                    {
                        "id": 2,
                        "name": "peter"
                    },
                    {
                        "id": 3,
                        "name": "lara"
                    }
                ],
                "messages": [
                    {
                        "id": 0,
                        "text": "Guten Morgen zusammen!",
                        "senderId": "0",
                        "timestamp": new Date("2024-06-02T09:00:00Z")
                    },
                    {
                        "id": 1,
                        "text": "Guten Morgen Hans!",
                        "senderId": "1",
                        "timestamp": new Date("2024-06-02T09:01:00Z")
                    },
                    {
                        "id": 2,
                        "text": "Morgen, ich bin auch da.",
                        "senderId": "2",
                        "timestamp": new Date("2024-06-02T09:02:00Z")
                    },
                    {
                        "id": 3,
                        "text": "Hey zusammen, worum geht es heute?",
                        "senderId": "3",
                        "timestamp": new Date("2024-06-02T09:03:00Z")
                    },
                    {
                        "id": 4,
                        "text": "Ich wollte kurz den Stand vom Projekt besprechen.",
                        "senderId": "0",
                        "timestamp": new Date("2024-06-02T09:04:00Z")
                    },
                    {
                        "id": 5,
                        "text": "Die Login-Seite ist fast fertig. Es fehlt nur noch die Validierung.",
                        "senderId": "1",
                        "timestamp": new Date("2024-06-02T09:05:00Z")
                    },
                    {
                        "id": 6,
                        "text": "Ich habe gestern am Chat-Layout gearbeitet.",
                        "senderId": "2",
                        "timestamp": new Date("2024-06-02T09:06:00Z")
                    },
                    {
                        "id": 7,
                        "text": "Sieht es schon responsive aus?",
                        "senderId": "3",
                        "timestamp": new Date("2024-06-02T09:07:00Z")
                    },
                    {
                        "id": 8,
                        "text": "Ja, auf Desktop funktioniert es gut. Mobile muss ich noch testen.",
                        "senderId": "2",
                        "timestamp": new Date("2024-06-02T09:08:00Z")
                    },
                    {
                        "id": 9,
                        "text": "Ich kann später auf meinem Handy testen.",
                        "senderId": "1",
                        "timestamp": new Date("2024-06-02T09:09:00Z")
                    },
                    {
                        "id": 10,
                        "text": "Super, danke Maria.",
                        "senderId": "0",
                        "timestamp": new Date("2024-06-02T09:10:00Z")
                    },
                    {
                        "id": 11,
                        "text": "Welche Features fehlen noch für die erste Version?",
                        "senderId": "3",
                        "timestamp": new Date("2024-06-02T09:11:00Z")
                    },
                    {
                        "id": 12,
                        "text": "Nachrichten senden, Räume wechseln und Benutzer anzeigen funktionieren schon.",
                        "senderId": "0",
                        "timestamp": new Date("2024-06-02T09:12:00Z")
                    },
                    {
                        "id": 13,
                        "text": "Wir brauchen noch Fehlermeldungen und vielleicht eine Ladeanzeige.",
                        "senderId": "1",
                        "timestamp": new Date("2024-06-02T09:13:00Z")
                    },
                    {
                        "id": 14,
                        "text": "Eine Ladeanzeige wäre sinnvoll, besonders beim Wechseln der Räume.",
                        "senderId": "2",
                        "timestamp": new Date("2024-06-02T09:14:00Z")
                    },
                    {
                        "id": 15,
                        "text": "Okay, dann priorisieren wir heute Validierung, Mobile-Test und Ladeanzeige.",
                        "senderId": "0",
                        "timestamp": new Date("2024-06-02T09:15:00Z")
                    },
                    {
                        "id": 16,
                        "text": "Passt für mich.",
                        "senderId": "1",
                        "timestamp": new Date("2024-06-02T09:16:00Z")
                    },
                    {
                        "id": 17,
                        "text": "Für mich auch.",
                        "senderId": "2",
                        "timestamp": new Date("2024-06-02T09:17:00Z")
                    },
                    {
                        "id": 18,
                        "text": "Ich kümmere mich dann um ein paar Testfälle.",
                        "senderId": "3",
                        "timestamp": new Date("2024-06-02T09:18:00Z")
                    }
                ]
            },
            {
                "meta": {
                    "id": 2,
                    "name": "Chat Room 3",
                    "createdAt": new Date("2024-06-03T13:00:00Z")
                },
                "members": [
                    {
                        "id": 0,
                        "name": "hans"
                    },
                    {
                        "id": 1,
                        "name": "maria"
                    },
                    {
                        "id": 2,
                        "name": "peter"
                    },
                    {
                        "id": 3,
                        "name": "lara"
                    },
                    {
                        "id": 4,
                        "name": "tom"
                    }
                ],
                "messages": [
                    {
                        "id": 0,
                        "text": "Hat jemand kurz Zeit für einen Bug?",
                        "senderId": "2",
                        "timestamp": new Date("2024-06-03T14:00:00Z")
                    },
                    {
                        "id": 1,
                        "text": "Ja, worum geht es?",
                        "senderId": "0",
                        "timestamp": new Date("2024-06-03T14:01:00Z")
                    },
                    {
                        "id": 2,
                        "text": "Wenn ich eine Nachricht abschicke, erscheint sie manchmal doppelt.",
                        "senderId": "2",
                        "timestamp": new Date("2024-06-03T14:02:00Z")
                    },
                    {
                        "id": 3,
                        "text": "Passiert das nur in einem bestimmten Raum?",
                        "senderId": "1",
                        "timestamp": new Date("2024-06-03T14:03:00Z")
                    },
                    {
                        "id": 4,
                        "text": "Bis jetzt habe ich es in Chat Room 1 und 2 gesehen.",
                        "senderId": "2",
                        "timestamp": new Date("2024-06-03T14:04:00Z")
                    },
                    {
                        "id": 5,
                        "text": "Klingt so, als würde der Event Listener mehrfach registriert werden.",
                        "senderId": "4",
                        "timestamp": new Date("2024-06-03T14:05:00Z")
                    },
                    {
                        "id": 6,
                        "text": "Das könnte sein. Ich prüfe mal die Komponente.",
                        "senderId": "0",
                        "timestamp": new Date("2024-06-03T14:06:00Z")
                    },
                    {
                        "id": 7,
                        "text": "Ich schaue parallel in die Socket-Logik.",
                        "senderId": "1",
                        "timestamp": new Date("2024-06-03T14:07:00Z")
                    },
                    {
                        "id": 8,
                        "text": "Soll ich einen Screenshot vom Fehler schicken?",
                        "senderId": "2",
                        "timestamp": new Date("2024-06-03T14:08:00Z")
                    },
                    {
                        "id": 9,
                        "text": "Ja, bitte. Am besten mit Uhrzeit und Raumname.",
                        "senderId": "0",
                        "timestamp": new Date("2024-06-03T14:09:00Z")
                    },
                    {
                        "id": 10,
                        "text": "Ich habe den Fehler auch gerade reproduziert.",
                        "senderId": "3",
                        "timestamp": new Date("2024-06-03T14:10:00Z")
                    },
                    {
                        "id": 11,
                        "text": "Bei mir passiert es nach einem Raumwechsel.",
                        "senderId": "3",
                        "timestamp": new Date("2024-06-03T14:11:00Z")
                    },
                    {
                        "id": 12,
                        "text": "Dann hängt es wahrscheinlich mit dem Cleanup im useEffect zusammen.",
                        "senderId": "4",
                        "timestamp": new Date("2024-06-03T14:12:00Z")
                    },
                    {
                        "id": 13,
                        "text": "Guter Hinweis. Ich sehe gerade, dass der Listener nicht entfernt wird.",
                        "senderId": "1",
                        "timestamp": new Date("2024-06-03T14:13:00Z")
                    },
                    {
                        "id": 14,
                        "text": "Dann müssten wir beim Unmount socket.off aufrufen.",
                        "senderId": "0",
                        "timestamp": new Date("2024-06-03T14:14:00Z")
                    },
                    {
                        "id": 15,
                        "text": "Genau. Ich passe das kurz an.",
                        "senderId": "1",
                        "timestamp": new Date("2024-06-03T14:15:00Z")
                    },
                    {
                        "id": 16,
                        "text": "Ich teste danach nochmal mit mehreren Raumwechseln.",
                        "senderId": "3",
                        "timestamp": new Date("2024-06-03T14:16:00Z")
                    },
                    {
                        "id": 17,
                        "text": "Danke euch, das hilft sehr.",
                        "senderId": "2",
                        "timestamp": new Date("2024-06-03T14:17:00Z")
                    },
                    {
                        "id": 18,
                        "text": "Fix ist drin. Bitte einmal neu laden.",
                        "senderId": "1",
                        "timestamp": new Date("2024-06-03T14:22:00Z")
                    },
                    {
                        "id": 19,
                        "text": "Ich teste jetzt.",
                        "senderId": "3",
                        "timestamp": new Date("2024-06-03T14:23:00Z")
                    },
                    {
                        "id": 20,
                        "text": "Bei mir kommt die Nachricht jetzt nur noch einmal an.",
                        "senderId": "2",
                        "timestamp": new Date("2024-06-03T14:24:00Z")
                    },
                    {
                        "id": 21,
                        "text": "Bei mir auch. Sieht gut aus.",
                        "senderId": "3",
                        "timestamp": new Date("2024-06-03T14:25:00Z")
                    },
                    {
                        "id": 22,
                        "text": "Perfekt. Dann markiere ich den Bug als erledigt.",
                        "senderId": "0",
                        "timestamp": new Date("2024-06-03T14:26:00Z")
                    },
                    {
                        "id": 23,
                        "text": "Super Arbeit!",
                        "senderId": "4",
                        "timestamp": new Date("2024-06-03T14:27:00Z")
                    }
                ]
            }
        ]
        setCurrentChat(chats[chatId])
    }

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
                    chats={[
                        {
                            chatId: 0,
                            name: "Chat Room 1",
                        },
                        {
                            chatId: 1,
                            name: "Chat Room 2",
                        },
                        {
                            chatId: 2,
                            name: "Chat Room 3",
                        },
                    ]}
                    changeChat={changeChat}
                />
            </Drawer>
            <Box sx={{flexGrow: 1, p:0, mt: "6vh", height: "94vh", width: "100%", justifyContent: "flex-end", overflow: "hidden"}}>
                <Chat chat={{...currentChat}} sendMessage={sendMessage}/>
            </Box>
        </Box>
    );
}
