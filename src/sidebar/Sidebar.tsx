import Box from '@mui/material/Box';
import * as React from 'react';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ChatIcon from '@mui/icons-material/Chat';
import type {ChatPreview} from "../assets/Props.tsx";

type Sidebar = {
    chats: ChatPreview[];
    currentChatId: number;
    setCurrentChatId: React.Dispatch<React.SetStateAction<number>>;
    changeChat: (chatId: number) => void;
};


function Sidebar(sidebar: Sidebar) {

    function handleChatClick(chatId: number) {
        sidebar.setCurrentChatId(chatId);
        sidebar.changeChat(chatId);
    }

    return (
        <Box>
            <Toolbar />
            <Box sx={{ overflow: 'auto' }}>
                <List>
                    {sidebar.chats.map((metadata) => (
                        <ListItem key={metadata.chatId} disablePadding>
                            <ListItemButton selected={sidebar.currentChatId === metadata.chatId}
                                            onClick={() => handleChatClick(metadata.chatId)}>
                                <ListItemIcon>
                                    <ChatIcon />
                                </ListItemIcon>
                                <ListItemText primary={metadata.name} />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
        </Box>
    );
}

export default Sidebar;