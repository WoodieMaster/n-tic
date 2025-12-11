import {Button, Typography, Box, TextField} from "@mui/material";

const Home = () => {
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
                <TextField label={"Name"} fullWidth/>
                <Box sx={{gap: 2, display: "flex"}}>
                    <Button variant="contained">Join Game</Button>
                    <Button variant="contained">Create Game</Button>
                </Box>
            </Box>
        </Box>
    );
};

export default Home;