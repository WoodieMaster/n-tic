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
const min = strokeWidth/2;
const fullSize = 100;
const max = fullSize - min;
const size = max - min;
const center = (max + min) / 2;
const viewBox = `0 0 ${fullSize} ${fullSize}`;

const elements2D = {
    "square": color => <rect width={size} height={size} x={min} y={min}
                    strokeWidth={strokeWidth} stroke={color} fill={"none"}/>,
    "circle": color => <circle r={size/2} cx={center} cy={center} strokeWidth={strokeWidth} stroke={color} fill="none"/>,
    "triangle": color => <path d={`M${min},${max} L${center},${min} L${max},${max} L${min},${max}`} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" fill="none"/>,
    "cross": color => <path d={`M${min},${min} L${max},${max} M${min},${max} L${max},${min}`} stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"/>,
} as const satisfies Record<Shape["type"], (color: string) => React.ReactElement>

function Render2D(shape: Shape | undefined, size: string | number) {
    return (
        <svg viewBox={viewBox} width={size} height={size}>
            {shape ? elements2D[shape.type](shape.color) : ""}
        </svg>)
}

export default ShapeRender;