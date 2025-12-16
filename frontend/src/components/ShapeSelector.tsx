import {useRef, useState} from "react";
import type {Shape} from "../../../shared/types";
import {Button, ClickAwayListener, Grow, MenuItem, MenuList, Paper, Popper, Stack, Typography} from "@mui/material";
import ShapeRender from "./ShapeRender.tsx";
import {colors, shapes} from "../../../shared/shapes.ts";
import ColorRenderer from "./ColorRenderer.tsx";

interface Props {
    defaultValue?: Shape,
    playerName?: string
}

const ShapeSelector = (p: Props) => {
    const shapeRef = useRef<HTMLButtonElement>(null);
    const colorRef = useRef<HTMLButtonElement>(null);
    const [shape, setShape] = useState(p.defaultValue);
    const [open, setOpen] = useState<null|"shape"|"color">(null);

    return (
        <Stack direction="row" spacing={1}
               sx={{alignItems: "center", backgroundColor: "rgba(0,0,0,0.2)", padding: 2, borderRadius: 3}}>
            <Button
                ref={shapeRef}
                onClick={() => setOpen("shape")}
            >
                <ShapeRender shape={shape} mode={"2D"} size={"50px"}/>
            </Button>
            <Popper
                sx={{zIndex: 1}}
                open={open === "shape"}
                anchorEl={shapeRef.current}
                transition
                disablePortal
            >
                {({TransitionProps, placement}) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom' ? 'center top' : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={() => open === "shape" && setOpen(null)}>
                                <MenuList id="split-button-menu" autoFocusItem>
                                    {shapes.map((option) => (
                                        <MenuItem
                                            key={option}
                                            selected={option === shape?.type}
                                            onClick={() => {
                                                setShape({type: option, color: shape?.color || "red"});
                                                setOpen(null)
                                            }}
                                        >
                                            <ShapeRender shape={{type: option, color: shape?.color || "red"}} mode={"2D"}
                                                         size={"20px"}/>
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
            <Button
                ref={colorRef}
                onClick={() => setOpen("color")}
            >
                <ColorRenderer color={shape?.color || "red"} size={"30px"}/>
            </Button>
            <Popper
                sx={{zIndex: 1}}
                open={open === "color"}
                anchorEl={colorRef.current}
                transition
                disablePortal
            >
                {({TransitionProps, placement}) => (
                    <Grow
                        {...TransitionProps}
                        style={{
                            transformOrigin:
                                placement === 'bottom' ? 'center top' : 'center bottom',
                        }}
                    >
                        <Paper>
                            <ClickAwayListener onClickAway={() => open === "color" && setOpen(null)}>
                                <MenuList id="split-button-menu" autoFocusItem>
                                    {colors.map((option) => (
                                        <MenuItem
                                            key={option}
                                            selected={option === shape?.color}
                                            onClick={() => {
                                                setShape({type: shape?.type || "cross", color: option});
                                                setOpen(null)
                                            }}
                                        >
                                            <ColorRenderer color={option} size={"20px"}/>
                                        </MenuItem>
                                    ))}
                                </MenuList>
                            </ClickAwayListener>
                        </Paper>
                    </Grow>
                )}
            </Popper>
            <Typography fontSize={25}>{p.playerName ?? ""}</Typography>
        </Stack>
    );
};

export default ShapeSelector;