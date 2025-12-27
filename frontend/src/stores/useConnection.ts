import {create} from "zustand/react";
import {useEffect} from "react";
import useGameSettings from "./useGameSettings.ts";
import useRoomState from "./useRoomState.ts";
import useGameState from "./useGameState.ts";

interface Data {
    ws?: WebSocket;
}
interface Store extends Data{
    update(data: Partial<Data>): void;
}

const useConnection = create<Store>(set => ({
    ws: undefined,
    update(data: Partial<Data>) {
        set(data)
    }
}));

const url = `ws://${new URL(document.URL).host}:9995`;

export default () => {
    const {ws, update} = useConnection();

    const {} = useGameSettings();
    const {} = useRoomState();
    const {} = useGameState();

    useEffect(() => {
        if(ws !== undefined && ws.readyState <= WebSocket.OPEN) return;
        const socket = new WebSocket(url);
        

        update({ws: socket});
    }, [ws]);

    return {

    };
};