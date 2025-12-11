import {Box, Stack} from "@mui/material";
import type {RoomSettings} from "../../../shared/types";
import ShapeRender from "./ShapeRender.tsx";
import SettingSlider from "./SettingSlider.tsx";

interface Props {
    settings: RoomSettings,
    players: string[]
}

const GameSettings = (p: Props) => {
    return (
        <Stack sx={{bgcolor: "rgb(30,30,30)", height: "100%", padding: 3}} spacing={5}>
            <SettingSlider label={"Dimensions"} defaultValue={p.settings.dimensionCount} min={2} max={10}/>
            <SettingSlider label={"Length"} defaultValue={p.settings.sideLength} min={3} max={10}/>
            <Stack spacing={2} sx={{bgcolor: "rgba(0,0,0,0.1)", height: "100%", padding: 3}}>
                {p.settings.playerShapes.map((s) => <Box><ShapeRender shape={s} mode={"2D"} size={"50px"}/></Box>)}
            </Stack>
        </Stack>
    );
};

export default GameSettings;