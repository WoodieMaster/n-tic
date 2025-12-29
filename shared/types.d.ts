import {colors, type shapes} from "./shapes.js";

export type WsServerMessage = {
    type: "playerChange",
    players: string[],
} | {
    type: "setup"
} | {
    type: "roomSetup",
    admin: string,
    players: string[]
} | {
    type: "nextTurn",
    nextPlayer: string,
    board: Board
} | ({
    type: "roomSettings",
} & Partial<RoomSettings>) | {
    type: "gameEnd",
    winner: string,
    board: Board,
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
    shape: Shape
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

export type Tuple<Item, Length extends number> = [Item, ...Item[]] & { length: Length };


export type Shape = { type: typeof shapes[number], color: typeof colors[number] }

export interface RoomSettings {
    dimensionCount: number,
    sideLength: number,
    playerShapes: Shape[]
}

export type Board = { [K: string]: number | undefined }
