import {Box, Typography} from "@mui/material";

interface Props {
    roomId: string;
    players: string[]
}

const GameHeader = (p: Props) => {
    return (
        <Box sx={{bgcolor: "rgb(30,30,30)", display: "flex", padding: 2, gap: 10}}>
            <Typography variant="h5">Join using: <b>{p.roomId}</b></Typography>
            <Typography variant={"h5"}>{p.players.length}/2 players</Typography>
        </Box>
    );
};

export default GameHeader;