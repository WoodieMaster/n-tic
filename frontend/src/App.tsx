import {BrowserRouter, Route, Routes} from "react-router";
import Home from "./pages/Home.tsx";
import Game from "./pages/Game.tsx";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import ServerMessageHandler from "./components/ServerMessageHandler.tsx";

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    }
})

function App() {

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            <ServerMessageHandler/>
            <BrowserRouter>
                <Routes>
                    <Route path="/" Component={Home}/>
                    <Route path="/game" Component={Game}/>
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}

export default App
