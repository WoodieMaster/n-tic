import {Box, Stack} from "@mui/material";
import GameHeader from "../components/GameHeader.tsx";
import GameSettings from "../components/GameSettings.tsx";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import BoardView from "../components/BoardView.tsx";
import {useState} from "react";
import {repeat} from "../../../shared/util.ts";
import useRoomState from "../stores/useRoomState.ts";

const Game = () => {
    const [gameViewCount, setGameViewCount] = useState(1);
    const viewCols = Math.ceil(Math.sqrt(gameViewCount));
    const viewRows = Math.ceil(gameViewCount / viewCols);
    const {roomId} = useRoomState();

    return (
        <Stack sx={{width: "100%", height: "100%"}}>
            <Box sx={{flex: 1}}>
                <GameHeader players={["a", "b"]} roomId={roomId!}/>
            </Box>
            <Box sx={{width: "100%", height: "100%"}}>
                <PanelGroup direction={"horizontal"} autoSaveId="gamePanelStructure">
                    <Panel>
                        <Box sx={{
                            display: "grid",
                            height: "100%",
                            overflow: "hidden",
                            gridTemplateColumns: `repeat(${viewCols}, 1fr)`,
                            gridTemplateRows: `repeat(${viewRows}, 1fr)`
                        }}>
                            {repeat(i => <BoardView key={i} />, gameViewCount)}
                        </Box>
                    </Panel>
                    <PanelResizeHandle/>
                    <Panel defaultSize={20} maxSize={50} minSize={10}>
                        <GameSettings/>
                    </Panel>
                </PanelGroup>
            </Box>
        </Stack>
    );
};

export default Game;