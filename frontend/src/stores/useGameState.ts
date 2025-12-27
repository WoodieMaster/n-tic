import {create} from "zustand/react";
import type {Board} from "../../../shared/types";
import type {Vec} from "../../../shared/vec.ts";

interface Data {
    board: Board,
    currentPlayer: number,
    state: "wait" | "play" | "win"
}

interface Store extends Data{
    updateGameState(data: Partial<Data>): void;
    updateBoardCell(pos: Vec): void;
}

const useGameState = create<Store>(set => ({
    board: {},
    currentPlayer: 0,
    state: "play",

    updateGameState(data: Partial<Data>) {
        set(data)
    },
    updateBoardCell(pos: Vec) {
        const key = pos.toKeyString();
        set(p => {
            if(key in p.board) {
                console.log("error on board, ", p.board);
                throw new Error(`Position already occupied (${key})`);
            }

            return {
                board: {
                    ...p.board,
                    [key]: p.currentPlayer,
                }
            }
        })
    }
}));

export default useGameState;