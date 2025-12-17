import type {BoardVector} from "../../../shared/types";
import type {BoardHandler} from "../../../shared/tictactoe.ts";
import {Canvas} from "@react-three/fiber"
import {OrbitControls, Svg} from "@react-three/drei"
import ShapeRenderer from "./ShapeRender.tsx";
import {renderToString} from "react-dom/server";
import {useRef, useState} from "react";
import {Box, Button, Stack, Typography} from "@mui/material";
import type {OrbitControls as OrbitControlsImpl} from "three-stdlib"
import {Vec, type Vec2, type Vec3} from "../../../shared/vec.ts";

interface Props {
    boardHandler: BoardHandler
}

const BoardView = (p: Props) => {
    const [viewStart, setViewStart] = useState(Vec.empty());
    const [selectedDimensions, setSelectedDimensions] = useState<Vec2 | Vec3>(new Vec([0, 1]));
    const [dimensionSizes, setDimensionSizes] = useState<Vec3>(new Vec([3, 3, 3]));

    const controlsRef = useRef<OrbitControlsImpl>(null);
    const shape1 = renderToString(<ShapeRenderer mode={"2D"} size={0} shape={{type: "cross", color: "red"}}/>);
    const shape2 = renderToString(<ShapeRenderer mode={"2D"} size={0} shape={{type: "square", color: "red"}}/>);
    async function resetControls() {
        const controls = controlsRef.current;
        if (controls === null) return;
        const sideLength = p.boardHandler.sideLength;
        controls.reset();
        const offset = sideLength * 125;
        controls.position0.set(offset,-offset,sideLength*30);
        controls.target0.set(offset,-offset,0);
        controls.setScale(sideLength*5);
    }

    return (
        <Stack sx={{height: "100%", width: "100%", minWidth: 0, minHeight: 0, overflow: "hidden", flex:"1 1 auto"}}>
            <Box sx={{flex: "1 1 auto", minWidth: 0, minHeight: 0, overflow: "hidden"}}>
                <Canvas style={{position: "relative"}} camera={{near: 0.001, far: 10000}}>
                    <Svg src={shape1}/>
                    <Svg src={shape2} position={[200, 0, 0]}/>
                    <OrbitControls ref={v => {
                        const prev = controlsRef.current;
                        controlsRef.current = v;
                        if (prev === null) void resetControls();
                    }}/>
                </Canvas>
            </Box>
            <Box sx={{height: "2em", flexShrink: 0}}>
                <Stack direction="row" sx={{height: "2em"}}>
                    <Button onClick={() => resetControls()}>Reset</Button>
                    <Typography>Balls</Typography>
                </Stack>
            </Box>
        </Stack>
    );
};

function Canvas2D(viewStart: Vec, selectedDimensions: Vec2|Vec3, dimensionSize: Vec3, boardHandler: BoardHandler) {
    const shape1 = renderToString(<ShapeRenderer mode={"2D"} size={0} shape={{type: "cross", color: "red"}}/>);
    const shape2 = renderToString(<ShapeRenderer mode={"2D"} size={0} shape={{type: "square", color: "red"}}/>);

    return <Canvas style={{position: "relative"}} camera={{near: 0.001, far: 10000}}>
        <Svg src={shape1}/>
        <Svg src={shape2} position={[200, 0, 0]}/>
        <OrbitControls ref={v => {
            const prev = controlsRef.current;
            controlsRef.current = v;
            if (prev === null) void resetControls();
        }}/>
    </Canvas>
}

function Canvas3D(viewStart: Vec, selectedDimensions: Vec2|Vec3, dimensionSize: Vec3, boardHandler: BoardHandler) {

}


export default BoardView;