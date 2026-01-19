import {Box, Typography} from "@mui/material";
import useRoomState from "../stores/useRoomState.ts";


const GameHeader = () => {
    const {players, roomId} = useRoomState();

    return (
        <Box sx={{bgcolor: "rgb(30,30,30)", display: "flex", padding: 2, gap: 10}}>
            <Typography variant="h5">Join using: <b>{roomId}</b></Typography>
            <Typography variant={"h5"}>{players.length}/2 players</Typography>
        </Box>
    );
};

export default GameHeader;