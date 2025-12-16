import type {Shape} from "../../../shared/types";
import * as React from "react";

interface Props {
    shape?: Shape
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
const pos = -strokeWidth / 2
const elements2D = {
    "square": color => <rect width={100} height={100} x={0} y={0}
                    strokeWidth={strokeWidth} stroke={color} fill={"none"}/>,
    "circle": color => <circle r={50} cx={50} cy={50} strokeWidth={strokeWidth} stroke={color} fill="none"/>,
    "triangle": color => <path d="M0,100 L50,0 L100,100 L0,100" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" fill="none"/>,
    "cross": color => <path d="M0,0 L100,100 M0,100 L100,0" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>,
} as const satisfies Record<Shape["type"], (color: string) => React.ReactElement>

function Render2D(shape: Shape | undefined, size: string | number) {
    return (
        <svg viewBox={`${pos},${pos},${length},${length}`} width={size} height={size}>
            {shape ? elements2D[shape.type](shape.color) : ""}
        </svg>)
}

export default ShapeRender;