import {create} from "zustand/react";
import {useEffect} from "react";
import useGameSettings from "./useGameSettings.ts";
import useRoomState from "./useRoomState.ts";
import useGameState from "./useGameState.ts";
import type {WsClientMessage, WsServerMessage} from "../../../shared/types";
import toast from "react-hot-toast";

interface Data {
    ws?: WebSocket;
}

interface Store extends Data {
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

    const {updateGameSettings} = useGameSettings();
    const {updateRoomState, playerId, players} = useRoomState();
    const {updateGameState} = useGameState();

    useEffect(() => {
        if (ws !== undefined && ws.readyState <= WebSocket.OPEN) return;
        const socket = new WebSocket(url);


        socket.onclose = () => {
            if (ws == socket) update({ws: undefined});
        }

        socket.onopen = () => {
            socket.send(JSON.stringify({type: "setup", reconnectId: null} satisfies WsClientMessage));
        }

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data) as WsServerMessage;

            switch (message.type) {
                case "playerChange":
                    updateRoomState({players: message.players});
                    break;
                case "setup":
                    break;
                case "roomSetup":
                    updateRoomState({players: message.players, admin: message.admin});
                    break;
                case "nextTurn":
                    updateGameState({board: message.board, currentPlayer: players.indexOf(message.nextPlayer)});
                    break;
                case "roomSettings":
                    updateGameSettings(message);
                    break;
                case "gameEnd":
                    updateGameState({board: message.board, state: "win"});

                    let info = "";
                    if(message.reason.type === "opponentsDisconnected") info = " (Opponent disconnected)"

                    if(message.winner === playerId) {
                        toast.success("You won!" + info);
                    }else {
                        toast.error(message.winner + " won!" + info)
                    }
                    break;
                case "error":
                    toast.error(message.msg);
                    break;
            }
        }

        update({ws: socket});
        return () => socket.close();
    }, [ws]);

    return {
        sendMessage(msg: WsClientMessage) {
            if(!ws) {
                throw new Error("Websocket connection not yet created!");
            }
            ws.send(JSON.stringify(msg));
        }
    };
};