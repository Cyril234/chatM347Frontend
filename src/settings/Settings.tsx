/*
import {Autocomplete, Button, Card, IconButton, List, ListItem, Modal} from "@mui/material";
import TextField from "@mui/material/TextField";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import {get} from "../api/api.ts";
import {apiUrl} from "../api/config.ts";
import DeleteIcon from '@mui/icons-material/Delete';
import Box from "@mui/material/Box";

type user = {
    name: string;
    eMail: string;
    id: number;
};

type input = {
    currentUser: user;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;

};

function Settings({ currentUser, open, setOpen }: input) {
    const [name, setName] = React.useState("");
    const [eMail, setEMail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [creatable, setCreatable] = React.useState(false);
    const [chatUser, setChatUser] = React.useState<user[]>([]);

    function handleCancel() {
        setChatName("");
        setChatUser([]);
        setOpen(false);
    }

    async function addChat(){
        const members = chatUser.map(u => {
            return {
                members_id: u.id,
                name: u.name,
            }
        });
        members.push({
            members_id: currentUser.id,
            name: currentUser.name,
        });
        await fetch(apiUrl("/chat"), {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: chatName,
                members: members,
            }),
        });
    }


    return (
        <Modal
            open={open}
            sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            slotProps={{
                backdrop: {
                    sx: {
                        backgroundColor: "rgba(0, 0, 0, 0.45)",
                    },
                },
            }}
        >
            <Card sx={{
                p: 0,
                mt: "6vh",
                width: "50%",
                height: "50vh",
                justifyContent: "flex-end",
                overflow: "hidden",
                padding: "2rem",
                display: "flex",
                flexDirection: "column",
            }}>
                <TextField
                    sx={{marginBottom: 2,}}
                    id="outlined-basic"
                    label="Name"
                    variant="outlined"
                    onChange={e => setName(e.target.value)}
                    value={name}
                />

                <TextField
                    sx={{marginBottom: 2,}}
                    id="outlined-basic"
                    label="E-mail"
                    variant="outlined"
                    onChange={e => setEMail(e.target.value)}
                    value={eMail}
                />

                <TextField
                    sx={{marginBottom: 2,}}
                    id="outlined-basic"
                    label="password"
                    variant="outlined"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
                />

                <Box sx={{ flexGrow: 1 }} />
                <Box
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "baseline",
                        mt: 2,
                        width: "100%"
                    }}
                >
                    <Button variant="outlined" onClick={handleCancel}>
                        cancel
                    </Button>

                    <Button variant="contained" disabled={!creatable} onClick={handleCreate}>
                        create
                    </Button>
                </Box>
            </Card>
        </Modal>
    );
}

export default Settings;

 */