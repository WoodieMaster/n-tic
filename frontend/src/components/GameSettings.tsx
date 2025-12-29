import {
    Stack,
} from "@mui/material";
import SettingSlider from "./SettingSlider.tsx";
import ShapeSelector from "./ShapeSelector.tsx";
import useGameSettings from "../stores/useGameSettings.ts";
import useRoomState from "../stores/useRoomState.ts";
import {useEffect, useMemo} from "react";
import useConnection from "../stores/useConnection.ts";

const GameSettings = () => {
    const {playerShapes, dimensionCount, sideLength, updateGameSettings, updatePlayerShape} = useGameSettings();
    const {players, updateRoomState, playerId: selfPlayerName, admin} = useRoomState();
    const {sendMessage} = useConnection();

    useEffect(() => {
        console.warn("DEBUG setup enabled");

        updateGameSettings({
            sideLength: 3,
            dimensionCount: 2,
            playerShapes: [{type: "circle", color: "red"}, {type: "square", color: "blue"}]
        });
        updateRoomState({players: ["a", "b"], admin: "b", playerId: "b"});
    }, []);

    return (
        <Stack sx={{bgcolor: "rgb(30,30,30)", height: "100%", padding: 3}} spacing={5}>
            <SettingSlider label={"Dimensions"} defaultValue={dimensionCount} min={2} max={10} disabled={selfPlayerName !== admin}/>
            <SettingSlider label={"Length"} defaultValue={sideLength} min={3} max={10} disabled={selfPlayerName !== admin}/>
            <Stack spacing={2} sx={{bgcolor: "rgba(0,0,0,0.1)", height: "100%", padding: 3}}>
                {players.map((playerName, idx) =>
                    <ShapeSelector
                        key={idx}
                        defaultValue={playerShapes[idx]}
                        title={playerName}
                        disabled={selfPlayerName !== playerName}
                        onEdit={shape => {
                            if(selfPlayerName !== playerName) throw new Error("Should not edit other players shapes!")
                            updatePlayerShape(shape, idx);
                            sendMessage({type: "selectShape", shape})
                        }}
                    />)}
            </Stack>
        </Stack>
    );
};

export default GameSettings;