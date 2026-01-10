import {
    Stack,
} from "@mui/material";
import SettingSlider from "./SettingSlider.tsx";
import ShapeSelector from "./ShapeSelector.tsx";
import useGameSettings from "../stores/useGameSettings.ts";
import useRoomState from "../stores/useRoomState.ts";
import {useEffect, useMemo} from "react";
import useConnection from "../stores/useConnection.ts";
import useGameState from "../stores/useGameState.ts";
import useDefer from "../hooks/useDefer.ts";
import type {RoomSettings} from "../../../shared/types";

const settingUpdateTimeout = 500;

const GameSettings = () => {
    const {playerShapes, dimensionCount, sideLength, updateGameSettings, updatePlayerShape} = useGameSettings();
    const {players, playerId: selfPlayerName, admin} = useRoomState();
    const {state: gameState} = useGameState();
    const {sendMessage} = useConnection();
    const deferSettingUpdate = useDefer();

    console.debug("render settings: ", {gameState, selfPlayerName, admin, playerShapes, dimensionCount, sideLength, players});

    function updateSettings(settings: Partial<RoomSettings>) {
        updateGameSettings(settings);
        sendMessage({type: "editSettings", ...settings})
    }

    function dimCountChange(newDimCount: number) {
        console.assert(dimensionCount !== newDimCount, "dimension count update without change");

        deferSettingUpdate(() => updateSettings({dimensionCount: newDimCount}), settingUpdateTimeout);
    }

    function sideLengthChange(newSideLength: number) {
        console.assert(sideLength !== newSideLength, "side length update without change");

        deferSettingUpdate(() => updateSettings({sideLength: newSideLength}), settingUpdateTimeout);
    }

    return (
        <Stack sx={{bgcolor: "rgb(30,30,30)", height: "100%", padding: 3}} spacing={5}>
            <SettingSlider
                label={"Dimensions"}
                defaultValue={dimensionCount}
                min={2}
                max={10}
                disabled={selfPlayerName !== admin || gameState !== "wait"}
                onChange={dimCountChange}
            />
            <SettingSlider
                label={"Length"}
                defaultValue={sideLength}
                min={3}
                max={10}
                disabled={selfPlayerName !== admin || gameState !== "wait"}
                onChange={sideLengthChange}
            />
            <Stack spacing={2} sx={{bgcolor: "rgba(0,0,0,0.1)", height: "100%", padding: 3}}>
                {players.map((playerName, idx) =>
                    <ShapeSelector
                        key={playerName}
                        defaultValue={playerShapes[idx]}
                        title={playerName}
                        disabled={selfPlayerName !== playerName || gameState !== "wait"}
                        onEdit={shape => {
                            if (selfPlayerName !== playerName) throw new Error("Should not edit other players shapes!")
                            updatePlayerShape(shape, idx);
                            sendMessage({type: "selectShape", shape})
                        }}
                    />)}
            </Stack>
        </Stack>
    );
};

export default GameSettings;