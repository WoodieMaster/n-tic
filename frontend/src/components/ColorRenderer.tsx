import type {Shape} from "../../../shared/types";
import {Box} from "@mui/material";

interface Props {
    color: Shape["color"];
    size: string|number;
}


const ColorRenderer = (p: Props) => {
    return (
        <Box sx={{width: p.size, height: p.size, borderRadius: p.size, backgroundColor: p.color, border: "1px solid black"}}/>
    );
};

export default ColorRenderer;