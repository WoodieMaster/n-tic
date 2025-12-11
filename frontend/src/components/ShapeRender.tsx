import type {Shape} from "../../../shared/types";
import * as React from "react";

interface Props {
    shape: Shape
    mode: Mode,
    size: string | number,
}

type Mode = "2D" | "3D"

const ShapeRender = (p: Props) => {
    if (p.mode === "2D") {
        return Render2D(p.shape, p.size);
    }
    return (
        <>
            Not available
        </>
    );
};

const strokeWidth = 20;
const length = 100 + strokeWidth;
const pos = -strokeWidth/2
const elements2D = {
    "square": <rect width={100} height={100} x={0} y={0}
                    strokeWidth={strokeWidth} stroke={"var(--color)"} fill={"transparent"} />,
    "circle": <circle r={50} cx={50} cy={50} strokeWidth={strokeWidth} stroke={"var(--color)"} fill="transparent"/>,
    "triangle": <></>,
    "cross": <></>,
} as const satisfies Record<Shape["type"], React.ReactElement>

function Render2D(shape: Shape,size: string|number) {
    return (<svg viewBox={`${pos},${pos},${length},${length}`} style={{"--color": shape.color}} width={size} height={size}>
        {elements2D[shape.type]}
    </svg>)
}

export default ShapeRender;