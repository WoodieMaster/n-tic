import {create} from "zustand/react";
import type {RoomSettings, Shape} from "../../../shared/types";

interface Store extends RoomSettings {
    updateSettings(data: Partial<RoomSettings>): void;
    updatePlayerShape(shape: Shape, idx: number): void;
}

const useGameSettings = create<Store>(set => ({
    dimensionCount: 2,
    sideLength: 3,
    playerShapes: [],

    updateSettings(data: Partial<RoomSettings>) {
        set(data)
    },

    updatePlayerShape(shape: Shape, idx: number) {
        set(p => ({playerShapes: p.playerShapes.map((s, i) => i === idx? shape : s)}))
    }
}));

export default useGameSettings;