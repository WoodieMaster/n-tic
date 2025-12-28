import {
    Stack,
} from "@mui/material";
import SettingSlider from "./SettingSlider.tsx";
import ShapeSelector from "./ShapeSelector.tsx";
import useGameSettings from "../stores/useGameSettings.ts";
import useRoomState from "../stores/useRoomState.ts";
import {useEffect} from "react";

const GameSettings = () => {
    const {playerShapes, dimensionCount, sideLength, updateGameSettings, updatePlayerShape} = useGameSettings();
    const {players, updateRoomState} = useRoomState();

    useEffect(() => {
        updateGameSettings({
            sideLength: 3,
            dimensionCount: 2,
            playerShapes: [{type: "circle", color: "red"}, {type: "square", color: "blue"}]
        });
        updateRoomState({players: ["a", "b"]});
    }, []);

    return (
        <Stack sx={{bgcolor: "rgb(30,30,30)", height: "100%", padding: 3}} spacing={5}>
            <SettingSlider label={"Dimensions"} defaultValue={dimensionCount} min={2} max={10}/>
            <SettingSlider label={"Length"} defaultValue={sideLength} min={3} max={10}/>
            <Stack spacing={2} sx={{bgcolor: "rgba(0,0,0,0.1)", height: "100%", padding: 3}}>
                {players.map((playerName, playerIdx) =>
                    <ShapeSelector
                        key={playerIdx}
                        defaultValue={playerShapes[playerIdx]}
                        playerName={playerName}
                        onEdit={s => updatePlayerShape(s, playerIdx)}
                    />)}
            </Stack>
        </Stack>
    );
};

export default GameSettings;