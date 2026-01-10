import {create} from "zustand/react";
import type {Board} from "../../../shared/types";
import type {Vec} from "../../../shared/vec.ts";

interface Data {
    board: Board,
    currentPlayerIdx: number,
    state: "wait" | "play" | "win"
}

interface Store extends Data{
    updateGameState(data: Partial<Data>): void;
    updateBoardCell(pos: Vec): void;
}

const useGameState = create<Store>(set => ({
    board: {},
    currentPlayerIdx: 0,
    state: "play",

    updateGameState(data: Partial<Data>) {
        set(data)
    },
    updateBoardCell(pos: Vec) {
        const key = pos.toKeyString();
        set(p => {
            if(key in p.board) {
                console.error("error on board, ", p.board);
                throw new Error(`Position already occupied (${key})`);
            }

            return {
                board: {
                    ...p.board,
                    [key]: p.currentPlayerIdx,
                }
            }
        })
    }
}));

export default useGameState;