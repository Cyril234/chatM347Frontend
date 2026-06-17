import Box from '@mui/material/Box';
import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChatIcon from '@mui/icons-material/Chat';
import {Button} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import {delet, get} from "../api/api.ts";
import {apiUrl} from "../api/config.ts";
import {useChatUpdates} from "../hooks/ChatHooks.ts";

type Sidebar = {
    currentChatId: string;
    setCurrentChatId: React.Dispatch<React.SetStateAction<string>>;
    changeChat: (chatId: string) => void;
    setAddChat: React.Dispatch<React.SetStateAction<boolean>>;
    currentUserId: number;
};

type ChatSummery = {
    id: string;
    name: string;
}

function Sidebar(sidebar: Sidebar) {
    const [chats, setChats] = React.useState<ChatSummery[]>([]);

    React.useEffect(() => {
        fetchChats();
    }, []);

    const userId = sidebar.currentUserId;

    const reloadChatList = () => {
        fetchChats()
    };

    useChatUpdates(userId, reloadChatList);


    async function fetchChats() {
        const chatsSummaries = await get(apiUrl("/chat/all-metadata"));
        setChats(chatsSummaries);
    }

    function handleChatClick(chatId: string) {
        sidebar.setCurrentChatId(chatId);
        sidebar.changeChat(chatId);
    }

    async function handleLeaveChat(chatId: string) {
        await delet(apiUrl(`/chat?chat-id=${chatId}`));
        fetchChats();
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', height: '100vh'}}>

            <Toolbar/>
            <Box sx={{overflow: 'auto', flex: 1}}>
                <List>
                    {chats.map((metadata) => (
                        <ListItem key={metadata.id} disablePadding>
                            <ListItemButton selected={sidebar.currentChatId === metadata.id}
                                            onClick={() => handleChatClick(metadata.id)}>
                                <ListItemIcon>
                                    <ChatIcon
                                    />
                                </ListItemIcon>
                                <ListItemText primary={metadata.name}/>
                                <ListItemIcon>
                                    <LogoutIcon
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            handleLeaveChat(metadata.id);
                                        }}
                                    />
                                </ListItemIcon>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box sx={{width: "100%", height: '5em', padding: 1}}>
                <Button
                    sx={{width: "100%", height: '100%'}}
                    variant="contained"
                    startIcon={<AddIcon/>}
                    onClick={() => sidebar.setAddChat(true)}
                >
                    Add Chat
                </Button>
            </Box>
        </Box>
    );
}

export default Sidebar;