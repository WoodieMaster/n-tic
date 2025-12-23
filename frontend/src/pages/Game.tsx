import {Box, Stack} from "@mui/material";
import GameHeader from "../components/GameHeader.tsx";
import GameSettings from "../components/GameSettings.tsx";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";
import BoardView from "../components/BoardView.tsx";
import {BoardHandler} from "../../../shared/tictactoe.ts";
import {useState} from "react";
import {repeat} from "../../../shared/util.ts";
import {Vec} from "../../../shared/vec.ts";

const boardHandler = new BoardHandler(2, 3);
boardHandler.setCell(new Vec([0, 0]), 0);
boardHandler.setCell(new Vec([1, 0]), 0);
boardHandler.setCell(new Vec([2, 2]), 1);

const Game = () => {
    const [gameViewCount, setGameViewCount] = useState(1);
    const viewCols = Math.ceil(Math.sqrt(gameViewCount));
    const viewRows = Math.ceil(gameViewCount / viewCols);

    return (
        <Stack sx={{width: "100%", height: "100%"}}>
            <Box sx={{flex: 1}}>
                <GameHeader players={["a", "b"]} roomId={"10100"}/>
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
                            {repeat(i => <BoardView key={i} boardHandler={boardHandler}
                                                    playerShapes={[{type: "square", color: "blue"}, {
                                                        type: "cross",
                                                        color: "yellow"
                                                    }]}/>, gameViewCount)}
                        </Box>
                    </Panel>
                    <PanelResizeHandle/>
                    <Panel defaultSize={20} maxSize={50} minSize={10}>
                        <GameSettings settings={{
                            sideLength: 3,
                            dimensionCount: 2,
                            playerShapes: [{type: "circle", color: "red"}, {type: "square", color: "blue"}]
                        }} players={["a", "b"]}/>
                    </Panel>
                </PanelGroup>
            </Box>
        </Stack>
    );
};

export default Game;