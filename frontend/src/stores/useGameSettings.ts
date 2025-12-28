import {create} from "zustand/react";
import type {RoomSettings, Shape} from "../../../shared/types";

interface Store extends RoomSettings {
    updateGameSettings(data: Partial<RoomSettings>): void;
    updatePlayerShape(shape: Shape, idx: number): void;
}

const useGameSettings = create<Store>(set => ({
    dimensionCount: 2,
    sideLength: 3,
    playerShapes: [],

    updateGameSettings(data: Partial<RoomSettings>) {
        set(data)
    },

    updatePlayerShape(shape: Shape, idx: number) {
        set(p => ({playerShapes: p.playerShapes.map((s, i) => i === idx? shape : s)}))
    }
}));

export default useGameSettings;