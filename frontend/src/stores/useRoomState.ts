import {create} from "zustand/react";

interface Data {
    roomId: string;
    players: string[];
    playerId: string;
    admin: string;
}

interface Store extends Data{
    updateRoomState(data: Partial<Data>): void;
}

const useRoomState = create<Store>(set => ({
    roomId: "",
    players: [],
    playerId: "",
    admin: "",

    updateRoomState(data: Partial<Data>) {
        set(data)
    }
}));

export default useRoomState;