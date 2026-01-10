import {Button, Typography, Box, TextField} from "@mui/material";
import {useRef} from "react";
import useConnection from "../stores/useConnection.ts";

const Home = () => {
    const nameRef = useRef("");
    const roomIdRef = useRef("");
    const {sendMessage} = useConnection();

    function joinGame() {
        sendMessage({type: "joinRoom", roomId: roomIdRef.current, playerName: nameRef.current});
    }
    function createGame() {
        sendMessage({type: "createRoom", playerName: nameRef.current});
    }

    return (
        <Box sx={{display: "flex", flexDirection: "column", alignItems: "center"}}>
            <Typography variant="h1">N-Tic</Typography>
            <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
                border: "1px solid var(--variant-containedBg)"
            }} component="form">
                <TextField label={"Name"} fullWidth onChange={e => nameRef.current = e.target.value}/>
                <Button variant="contained" onClick={createGame} fullWidth>Create Game</Button>
                <Box sx={{gap: 2, display: "flex"}}>
                    <TextField label={"Game ID"} onChange={e => roomIdRef.current = e.target.value} />
                    <Button variant="contained" onClick={joinGame}>Join Game</Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Home;