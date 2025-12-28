import {Canvas} from "@react-three/fiber"
import {OrbitControls, Svg} from "@react-three/drei"
import ShapeRenderer from "./ShapeRender.tsx";
import {renderToString} from "react-dom/server";
import {useEffect, useRef, useState} from "react";
import {Box, Button, Stack, Typography} from "@mui/material";
import type {OrbitControls as OrbitControlsImpl} from "three-stdlib"
import {Vec} from "../../../shared/vec.ts";
import type {Tuple} from "../../../shared/types";
import {map} from "../../../shared/util.ts";
import {Vector3} from "three";
import useGameSettings from "../stores/useGameSettings.ts";
import useGameState from "../stores/useGameState.ts";


interface Props {
    defaultViewStart?: Vec;
    defaultSelectedDimensions?: Tuple<number, 2|3>,
    defaultDimensionSizes?: Tuple<number,3>
}

const BoardView = (p: Props) => {
    const {sideLength} = useGameSettings();
    const [viewStart, setViewStart] = useState(p.defaultViewStart ?? Vec.zero(sideLength));
    const [selectedDimensions, setSelectedDimensions] = useState(p.defaultSelectedDimensions ?? [0,1] as Tuple<number, 2|3>);
    const [dimensionSizes, setDimensionSizes] = useState(p.defaultDimensionSizes ?? [3,3,3] as Tuple<number,3>);
    const controlsRef = useRef<OrbitControlsImpl>(null);

    function resetControls2D() {
        const controls = controlsRef.current;
        if (controls === null) return;
        const sideLength = Math.max(...dimensionSizes);
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
                    <Canvas2D viewStart={viewStart} selectedDimensions={selectedDimensions} dimensionSizes={dimensionSizes}/>
                    <OrbitControls ref={v => {
                        const prev = controlsRef.current;
                        controlsRef.current = v;
                        if (prev === null) resetControls2D();
                    }}/>
                </Canvas>
            </Box>
            <Box sx={{height: "2em", flexShrink: 0}}>
                <Stack direction="row" sx={{height: "2em"}}>
                    <Button onClick={() => resetControls2D()}>Reset</Button>
                    <Typography>Balls</Typography>
                </Stack>
            </Box>
        </Stack>
    );
};

function Canvas2D(p: {viewStart: Vec, selectedDimensions: Tuple<number, 2 | 3>, dimensionSizes: Tuple<number, 3>}) {
    const {playerShapes} = useGameSettings();
    const {updateBoardCell, board} = useGameState();
    const boardArea = getBoardArea(p.viewStart, p.selectedDimensions, p.dimensionSizes);
    const grid = Array.from(map(boardArea, ([gridPos, realPos]) => {
        const cell = board[gridPos.toKeyString()];

        if (cell === undefined) return <EmptyCell realPos={realPos} key={gridPos.toKeyString()}
                                             onClick={() => updateBoardCell(gridPos)}/>;

        const svg = renderToString(<ShapeRenderer mode={"2D"} size={0} shape={playerShapes[cell]}/>);
        return <Cell svg={svg} realPos={realPos} key={gridPos.toKeyString()}/>
    }));

    return <>{grid}</>
}

function EmptyCell(p: {realPos: Tuple<number, 3>, onClick: (realPos: Tuple<number, 3>) => void }) {
    const inClick = useRef(false);
    const [hover, setHover] = useState(false);

    const pos = new Vector3(...p.realPos)
        .multiplyScalar(150)
        .addScalar(75)
        .add(new Vector3(50, -50, 0));

    return <mesh
        position={pos}
        onPointerEnter={e => {
            e.stopPropagation();
            setHover(true);
        }}
        onPointerLeave={() => {
            setHover(false);
            inClick.current = false;
        }}
        onPointerDown={e => {
            console.log(e.buttons);
            inClick.current = e.button === 0;
        }}
        onPointerUp={e => {
            e.stopPropagation();
            if(e.button !== 0 || !inClick.current) return;
            p.onClick?.(p.realPos);
        }}
    >
        <boxGeometry args={[150, 150, 10]}/>
        <meshBasicMaterial color={"gray"} transparent opacity={0.2} visible={hover}/>
    </mesh>
}

function Cell(p: { svg: string, realPos: Tuple<number, 3>}) {
    const pos = new Vector3(...p.realPos).multiplyScalar(150).addScalar(75);

    return <Svg
        src={p.svg}
        position={pos}
    />
}

function* getBoardArea<V extends Vec>(start: V, selectedDimensions: Tuple<number, 2 | 3>, dimensionSizes: Tuple<number, 3>): Generator<[V, Tuple<number, 3>]> {
    let gridPos = start;
    let selectPos = [0, 0, 0] as Tuple<number, 3>;
    yield [gridPos, Array.from(selectPos) as Tuple<number, 3>];
    outer: while (true) {
        for (let i = 0; i < selectedDimensions.length; i++) {
            const dim = selectedDimensions[i];
            const size = dimensionSizes[i];
            gridPos = gridPos.with(dim, gridPos.get(dim)+1);
            selectPos[i]++;
            if (selectPos[i] < size) {
                yield [gridPos, Array.from(selectPos) as Tuple<number, 3>];
                continue outer;
            }
            selectPos[i] = 0;
            gridPos = gridPos.with(dim, start.get(dim));
        }
        return;
    }
}

export default BoardView;