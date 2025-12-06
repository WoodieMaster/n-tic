import {BrowserRouter, Route, Routes} from "react-router";
import Home from "./pages/Home.tsx";
import Game from "./pages/Game.tsx";

function App() {

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" Component={Home} />
                <Route path="/game" Component={Game} />
            </Routes>
        </BrowserRouter>
    )
}

export default App
