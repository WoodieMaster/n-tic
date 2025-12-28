import {Canvas} from "@react-three/fiber"
import {OrbitControls, Svg} from "@react-three/drei"
import ShapeRenderer from "./ShapeRender.tsx";
import {renderToString} from "react-dom/server";
import {useRef, useState} from "react";
import {Box, Button, Stack, Typography} from "@mui/material";
import type {OrbitControls as OrbitControlsImpl} from "three-stdlib"
import {Vec} from "../../../shared/vec.ts";
import type {Tuple} from "../../../shared/types";
import {map, repeat} from "../../../shared/util.ts";
import {Vector3} from "three";
import useGameSettings from "../stores/useGameSettings.ts";
import useGameState from "../stores/useGameState.ts";


interface Props {
    defaultViewStart?: Vec;
    defaultSelectedDimensions?: Tuple<number, 2|3>,
    defaultSideLength?: number
}

const fov = 50;
const fovRadians = Math.PI / 180 * fov;
const BoardView = (p: Props) => {
    const {sideLength} = useGameSettings();
    const [viewStart, setViewStart] = useState(p.defaultViewStart ?? Vec.zero(sideLength));
    const [selectedDimensions, setSelectedDimensions] = useState(p.defaultSelectedDimensions ?? [0,1] as Tuple<number, 2|3>);
    const [viewSideLength, setViewSideLength] = useState(p.defaultSideLength ?? 8);
    const controlsRef = useRef<OrbitControlsImpl>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    function resetControls2D() {
        const controls = controlsRef.current;
        if (controls === null) return;
        controls.reset();

        const gridSize = viewSideLength * 150;
        const gridCenter = gridSize / 2;

        const camera_z = Math.abs((gridSize*1.15) / (2 * Math.tan(fovRadians / 2)));

        controls.position0.set(gridCenter, gridCenter, camera_z);
        controls.target0.set(gridCenter, gridCenter, 0);
    }

    return (
        <Stack sx={{height: "100%", width: "100%", minWidth: 0, minHeight: 0, overflow: "hidden", flex: "1 1 auto"}}>
            <Box sx={{flex: "1 1 auto", minWidth: 0, minHeight: 0, overflow: "hidden"}}>
                <Canvas style={{position: "relative"}} ref={canvasRef} camera={{near: 0.001, far: 100000, fov}}>
                    {
                        selectedDimensions.length === 2
                            ? <Canvas2D viewStart={viewStart} selectedDimensions={selectedDimensions as Tuple<number, 2>} sideLength={viewSideLength}/>
                            : <></>
                    }
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

function Canvas2D(p: {viewStart: Vec, selectedDimensions: Tuple<number, 2>, sideLength: number}) {
    const {playerShapes} = useGameSettings();
    const {updateBoardCell, board} = useGameState();
    const boardArea = getBoardArea(p.viewStart, p.selectedDimensions, p.sideLength);
    const grid = Array.from(map(boardArea, ([gridPos, inViewPosition]) => {
        const cell = board[gridPos.toKeyString()];

        if (cell === undefined) return <EmptyCell2D inViewPosition={inViewPosition} key={gridPos.toKeyString()}
                                                    onClick={() => updateBoardCell(gridPos)}/>;

        const svg = renderToString(<ShapeRenderer mode={"2D"} size={0} shape={playerShapes[cell]}/>);
        return <Cell2D svg={svg} inViewPosition={inViewPosition} key={gridPos.toKeyString()}/>
    }));

    const verticalLines = Array.from(repeat(i => <Line2D key={i} realPos={[i+1,0]} elementCount={p.sideLength} dimension={1}/>, p.sideLength-1));
    const horizontalLines = Array.from(repeat(i => <Line2D key={i} realPos={[0,i+1]} elementCount={p.sideLength} dimension={0}/>, p.sideLength-1));

    return <>
        {grid}
        {verticalLines}
        {horizontalLines}
    </>
}

function EmptyCell2D(p: {inViewPosition: Tuple<number, 3>, onClick: (realPos: Tuple<number, 3>) => void }) {
    const inClick = useRef(false);
    const [hover, setHover] = useState(false);

    const pos = new Vector3(...p.inViewPosition)
        .multiplyScalar(150)
        .add(new Vector3(50, 50, 0));

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
        onPointerMove={() => {
            inClick.current = false;
        }}
        onPointerDown={e => {
            inClick.current = e.button === 0;
        }}
        onPointerUp={e => {
            e.stopPropagation();
            if(e.button !== 0 || !inClick.current) return;
            p.onClick?.(p.inViewPosition);
        }}
    >
        <boxGeometry args={[120, 120, 10]}/>
        <meshBasicMaterial color={"gray"} transparent opacity={0.2} visible={hover}/>
    </mesh>
}

function Cell2D(p: { svg: string, inViewPosition: Tuple<number, 3>}) {
    const pos = new Vector3(...p.inViewPosition).multiplyScalar(150);

    return <Svg
        src={p.svg}
        position={pos}
        scale={[1,-1, 1]}
    />
}

function Line2D(p: {realPos: Tuple<number, 2>, elementCount: number, dimension: number}) {
    const length = p.elementCount * 150;
    const sizes = [10,10,10] as Tuple<number, 3>;
    sizes[p.dimension] = length;

    const offset = [-25,-25,0];
    offset[p.dimension] = length / 2 - 20;
    const pos = new Vector3(...p.realPos).multiplyScalar(150).add(new Vector3(...offset));

    return <mesh position={pos}>
        <boxGeometry args={sizes} />
        <meshBasicMaterial color={"gray"}/>
    </mesh>
}

function* getBoardArea<V extends Vec>(start: V, selectedDimensions: Tuple<number, 2 | 3>, sideLength: number): Generator<[V, Tuple<number, 3>]> {
    let gridPos = start;
    let selectPos = [0, 0, 0] as Tuple<number, 3>;
    yield [gridPos, Array.from(selectPos) as Tuple<number, 3>];
    outer: while (true) {
        for (let i = 0; i < selectedDimensions.length; i++) {
            const dim = selectedDimensions[i];
            const size = sideLength;
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