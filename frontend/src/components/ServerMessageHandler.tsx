import useConnection, {type ServerMessageEvent} from "../stores/useConnection.ts";
import {useEffect} from "react";
import toast from "react-hot-toast";
import useGameState from "../stores/useGameState.ts";
import useGameSettings from "../stores/useGameSettings.ts";
import useRoomState from "../stores/useRoomState.ts";

const ServerMessageHandler = () => {
    const {registerMessageHandler, removeMessageHandler} = useConnection();
    const {updateGameSettings} = useGameSettings();
    const {updateRoomState, playerId, players} = useRoomState();
    const {updateGameState} = useGameState();

    useEffect(() => {
        const handler = (e: ServerMessageEvent) => {
            const message = e.message;

            switch (message.type) {
                case "playerChange":
                    updateRoomState({players: message.players});
                    break;
                case "setup":
                    break;
                case "roomSetup":
                    updateRoomState({players: message.players, admin: message.admin, playerId: message.playerId, roomId: message.roomId});
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
                    switch (message.reason.type) {
                        case "opponentsDisconnected":
                            toast.success("You won! (Opponent disconnected");
                            break;
                        case "tie":
                            toast.custom("Tie");
                            break;
                        case "board":
                            if (message.reason.winner === playerId) {
                                toast.success("You won!" + info);
                            } else {
                                toast.error(message.reason.winner + " won!" + info)
                            }
                    }
                    break;
                case "error":
                    toast.error(message.msg);
                    break;
            }
        }
        registerMessageHandler(handler);

        return () => removeMessageHandler(handler);
    }, []);


    return <></>;
};

export default ServerMessageHandler;