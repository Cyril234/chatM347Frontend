import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import * as React from "react";

type input = {
    sendMessage: (message: string) => void;
};


export default function ChatInput({sendMessage }: input) {
    const [input, setInput] = React.useState("");

    function submitMessage(event:any){
        event.preventDefault();
        if(input!="") {
            sendMessage(input);
            setInput("");
        }
    }

    return (
        <Paper
            component="form"
            sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', marginRight: "3%", marginLeft: "3%", marginBottom: "1vh", marginTop: "1vh", outlineStyle: "solid", outlineWidth: "0.5px", outlineColor: "#dedede"}}
            onSubmit={(e) => submitMessage(e)}
        >
            <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="type..."
                onChange={event => setInput(event.target.value)}
                value={input}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton color="primary" sx={{ p: '10px' }} aria-label="send" onClick={(e) => submitMessage(e)}>
                <SendIcon />
            </IconButton>
        </Paper>
    );
}