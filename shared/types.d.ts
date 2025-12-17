import {colors, type shapes} from "./shapes.js";

export type WsServerMessage = {
    type: "playerJoin",
    playerName: string,
} | {
    type: "setup"
} | {
    type: "roomSetup",
    admin: string,
    players: string[]
} | {
    type: "playerLeave",
    playerName: string
} | {
    type: "nextTurn",
    nextPlayer: string,
    board: BoardCell[]
} | ({
    type: "roomSettings",
} & Partial<RoomSettings>) | {
    type: "gameEnd",
    winner: string,
    board: BoardCell[],
    reason: {
        type: "board",
        winVec: BoardDirection,
        winPosition: BoardVector
    } | {
        type: "opponentsDisconnected"
    }
} | {
    type: "error",
    msg: string
}

export type WsClientMessage = {
    type: "setup",
    reconnectId: string | null,
} | {
    type: "joinRoom",
    roomId: string,
    playerName: string | null
} | {
    type: "createRoom",
    playerName: string | null
} | {
    type: "leaveRoom",
} | {
    type: "selectShape",
    shape: string
} | {
    type: "editSettings",
    dimensionCount?: number,
    sideLength?: number
} | {
    type: "startGame"
} | {
    type: "place",
    position: BoardVector
}

export interface User {
    id: string,
    name: string
}

export type FilledBoardCell = 1 | 2;
export type BoardCell = FilledBoardCell | undefined;



export type Shape = { type: typeof shapes[number], color: typeof colors[number]}

export interface RoomSettings {
    dimensionCount: number,
    sideLength: number,
    playerShapes: Shape[]
}

export type Board = {[K: string]: BoardCell}