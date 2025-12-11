import {Box, Stack} from "@mui/material";
import GameHeader from "../components/GameHeader.tsx";
import GameSettings from "../components/GameSettings.tsx";
import {Panel, PanelGroup, PanelResizeHandle} from "react-resizable-panels";

const Game = () => {
    return (
        <Stack sx={{width: "100%", height: "100%"}}>
            <Box sx={{flex: 1}}>
                <GameHeader players={["a", "b"]} roomId={"10100"}/>
            </Box>
            <Box sx={{width:"100%", height:"100%"}}>
                <PanelGroup direction={"horizontal"} autoSaveId="gamePanelStructure">
                    <Panel>

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