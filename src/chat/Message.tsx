import Box from "@mui/material/Box";
import {Avatar, Card, CardContent} from "@mui/material";
import Typography from "@mui/material/Typography";
import type {MessageProps} from "../assets/Props.tsx";

function stringToColor(string: string) {
    let hash = 0;
    let i;

    for (i = 0; i < string.length; i += 1) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
}


function stringAvatar(name: string) {
    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: `${name.split(' ')[0][0]}`,
    };
}

export default function Message({ text, senderName }: MessageProps) {
    return (
        <Box sx={{ display: "flex", flexDirection: "row", marginBottom: 2, alignItems: "center"}}>
            <Avatar {...stringAvatar(senderName)} />
            <Card sx={{ width: "fit-content", marginLeft: 2, backgroundColor: "#f5f5f5"}} elevation={1}>
                <CardContent sx={{ alignItems: "center"}}>
                    <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14}}>
                        {text}
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
}
