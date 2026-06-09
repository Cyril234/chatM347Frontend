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
import {Button} from "@mui/material";
import AddIcon from '@mui/icons-material/Add';

type Sidebar = {
    chats: ChatPreview[];
    currentChatId: number;
    setCurrentChatId: React.Dispatch<React.SetStateAction<number>>;
    changeChat: (chatId: number) => void;
    setAddChat: React.Dispatch<React.SetStateAction<boolean>>;
};


function Sidebar(sidebar: Sidebar) {

    function handleChatClick(chatId: number) {
        sidebar.setCurrentChatId(chatId);
        sidebar.changeChat(chatId);
    }

    return (
        <Box sx={{display: 'flex', flexDirection: 'column', height: '100vh'}}>

            <Toolbar/>
            <Box sx={{overflow: 'auto', flex: 1}}>
                <List>
                    {sidebar.chats.map((metadata) => (
                        <ListItem key={metadata.id} disablePadding>
                            <ListItemButton selected={sidebar.currentChatId === metadata.id}
                                            onClick={() => handleChatClick(metadata.id)}>
                                <ListItemIcon>
                                    <ChatIcon/>
                                </ListItemIcon>
                                <ListItemText primary={metadata.name}/>
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Box>
            <Box sx={{width: "100%", height: '7vh', padding: 1}}>
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