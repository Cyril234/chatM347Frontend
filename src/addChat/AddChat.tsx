import {Autocomplete, Button, Card, IconButton, List, ListItem, Modal} from "@mui/material";
import TextField from "@mui/material/TextField";
import ListItemText from "@mui/material/ListItemText";
import * as React from "react";
import {get} from "../api/api.ts";
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

function AddChat({ currentUser, open, setOpen }: input) {
    const [chatName, setChatName] = React.useState("");
    const [creatable, setCreatable] = React.useState(false);
    const [chatUser, setChatUser] = React.useState<user[]>([]);
    const [allUser, setAllUser] = React.useState<user[]>([]);
    const [inputUserValue, setInputUserValue] = React.useState("");
    const [outputUserValue, setOutputUserValue] = React.useState<user | null>(null);


    React.useEffect(() => {
        async function fetchUsers() {
            const fetchedNames = await get("http://localhost:8080/user/all-users", false);
            setAllUser(fetchedNames.filter((n: user) => n.id !== currentUser?.id));
        }

        fetchUsers();
    }, []);

    React.useEffect(() => {
        if (chatName.length > 0 && chatUser.length > 0) {
            setCreatable(true);
        }else {
            setCreatable(false);
        }
    }, [chatName, chatUser]);

    function addUserHelper(name: string | null | user) {
        if (typeof name === "object" && name !== null) {
            setChatUser(prevUsers => [...prevUsers, name]);
            setAllUser(prevNames => prevNames.filter(n => n.id !== name.id));
        }
    }

    function handleCancel() {
        setChatName("");
        setChatUser([]);
        setOpen(false);
    }

    async function addChat(){
        const members = chatUser.map(u => {
            return {
                members_id: u.id,
                name: u.eMail,
            }
        });
        members.push({
            members_id: currentUser.id,
            name: currentUser.eMail,
        });
        console.log(members)
        await fetch("http://localhost:8080/chat", {
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

    function handleCreate() {
        addChat();
        setOpen(false);
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
                    onChange={e => setChatName(e.target.value)}
                    value={chatName}
                />

                <Autocomplete
                    id="free-solo-demo"
                    options={allUser}
                    value={outputUserValue}
                    inputValue={inputUserValue}
                    onInputChange={(_event, value) => {
                        setInputUserValue(value);
                    }}
                    getOptionLabel={(option) => {
                        if (typeof option === "string") {
                            return option;
                        }

                        return option.eMail;
                    }}
                    onChange={(_event, value) => {
                        addUserHelper(value);
                        setOutputUserValue(null);
                        setInputUserValue("");
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select user to add"
                        />
                    )}
                />

                <List sx={{width: '50%', maxWidth: 360, bgcolor: 'background.paper'}}>
                    {chatUser.map((value) => {
                        const labelId = `checkbox-list-label-${value.id}`;

                        return (
                            <ListItem
                                key={value.id}
                                disablePadding
                            >
                                <IconButton edge="end"
                                            aria-label="comments"
                                            onClick={() => {
                                                setAllUser(prevNames => [...prevNames, value]);
                                                setChatUser(prevUsers => prevUsers.filter(n => n.id !== value.id));
                                            }}
                                            sx={{marginRight: "0.5rem"}}
                                >
                                    <DeleteIcon/>
                                </IconButton>
                                <ListItemText id={labelId} primary={value.eMail}/>
                            </ListItem>
                        );
                    })}
                </List>
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

export default AddChat;