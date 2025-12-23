import type {BoardHandler} from "../../../shared/tictactoe.ts";
import {Canvas} from "@react-three/fiber"
import {OrbitControls, Svg} from "@react-three/drei"
import ShapeRenderer from "./ShapeRender.tsx";
import {renderToString} from "react-dom/server";
import {useEffect, useRef, useState} from "react";
import {Box, Button, Stack, Typography} from "@mui/material";
import type {OrbitControls as OrbitControlsImpl} from "three-stdlib"
import {Vec} from "../../../shared/vec.ts";
import type {Shape, Tuple} from "../../../shared/types";
import {map} from "../../../shared/util.ts";
import {Vector3} from "three";

interface Props {
    boardHandler: BoardHandler,
    playerShapes: Shape[]
}

const BoardView = (p: Props) => {
    const [viewStart, setViewStart] = useState(Vec.zero(p.boardHandler.dimensions));
    const [selectedDimensions, setSelectedDimensions] = useState<Tuple<number, 2 | 3>>([0, 1]);
    const [dimensionSizes, setDimensionSizes] = useState<Tuple<number, 3>>([3, 3, 3]);
    const controlsRef = useRef<OrbitControlsImpl>(null);

    function resetControls() {
        const controls = controlsRef.current;
        if (controls === null) return;
        const sideLength = p.boardHandler.sideLength;
        controls.reset();
        const offset = sideLength * 100;
        controls.position0.set(offset, offset, sideLength * 30);
        controls.target0.set(offset, offset, 0);
        controls.setScale(sideLength * 5);
    }

    return (
        <Stack sx={{height: "100%", width: "100%", minWidth: 0, minHeight: 0, overflow: "hidden", flex: "1 1 auto"}}>
            <Box sx={{flex: "1 1 auto", minWidth: 0, minHeight: 0, overflow: "hidden"}}>
                <Canvas style={{position: "relative"}} camera={{near: 0.001, far: 10000}}>
                    {Canvas2D(viewStart, selectedDimensions, dimensionSizes, p.boardHandler, p.playerShapes)}
                </Canvas>
                <OrbitControls ref={v => {
                    const prev = controlsRef.current;
                    controlsRef.current = v;
                    if (prev === null) resetControls();
                }}/>
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
function Canvas2D(viewStart: Vec, selectedDimensions: Tuple<number, 2 | 3>, dimensionSize: Tuple<number, 3>, boardHandler: BoardHandler, playerShapes: Shape[]) {
    const boardArea = getBoardArea(viewStart, selectedDimensions, dimensionSize);
    const grid = Array.from(map(boardArea, ([gridPos, realPos]) => {
        const cell = boardHandler.getCell(gridPos);

        if (cell === undefined) return "";

        const svg = renderToString(<ShapeRenderer mode={"2D"} size={0} shape={playerShapes[cell]}/>);
        return <Cell svg={svg} realPos={realPos} key={gridPos.toKeyString()}/>
    }));
    return <>{grid}</>

}

function Cell(p: { svg: string, realPos: Tuple<number, 3> }) {
    const [hover, setHover] = useState(false);
    const pos = new Vector3(...p.realPos).multiplyScalar(150).addScalar(75);
    useEffect(() => {
        console.log("change hover");
    }, [hover]);

    return <Svg
        src={p.svg}
        position={pos}
    />;
}

function* getBoardArea<V extends Vec>(start: V, selectedDimensions: Tuple<number, 2 | 3>, dimensionSizes: Tuple<number, 3>): Generator<[V, Tuple<number, 3>]> {
    let gridPos = start.clone() as V;
    let selectPos = [0, 0, 0] as Tuple<number, 3>;
    yield [gridPos, Array.from(selectPos) as Tuple<number, 3>];
    outer: while (true) {
        for (let i = 0; i < selectedDimensions.length; i++) {
            const dim = selectedDimensions[i];
            const size = dimensionSizes[i];
            gridPos.arr[dim]++;
            selectPos[i]++;
            if (selectPos[i] < size) {
                yield [gridPos, Array.from(selectPos) as Tuple<number, 3>];
                continue outer;
            }
            selectPos[i] = 0;
            gridPos.arr[dim] = start.arr[dim]!;
        }
        return;
    }
}

export default BoardView;