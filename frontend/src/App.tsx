import {BrowserRouter, Route, Routes} from "react-router";
import Home from "./pages/Home.tsx";
import Game from "./pages/Game.tsx";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import ServerMessageHandler from "./components/ServerMessageHandler.tsx";
import {Toaster} from "react-hot-toast";
import useGameState from "./stores/useGameState.ts";
import useRoomState from "./stores/useRoomState.ts";
import {useEffect} from "react";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    }
})

function App() {
    const {roomId} = useRoomState();

    return (
        <ThemeProvider theme={darkTheme}>
            <Toaster/>
            <CssBaseline/>
            <ServerMessageHandler/>
            <BrowserRouter>
                {
                    roomId === null ?
                        <Home/>
                        : <Game/>
                }
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
