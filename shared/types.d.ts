import {shapeColors, type shapeTypes} from "./shapes.js";
import type {Vec, VecDirection} from "./vec.ts";

export type WsServerMessage = {
    type: "playerChange",
    players: string[],
    newAdmin?: string|undefined
} | {
    type: "setup"
} | {
    type: "roomSetup",
    roomId: string,
    playerId: string,
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
    board: Board,
    reason: GameOverReason
} | {
    type: "error",
    msg: string
}

export type GameOverReason = {
    type: "board",
    winVec: VecDirection,
    winPosition: Vec,
    winner: string
} | {
    type: "opponentsDisconnected"
} | {
    type: "tie"
}

export type WsClientMessage = {
    type: "setup",
    reconnectId: string | null,
} | {
    type: "joinRoom",
    roomId: string,
    playerName: string
} | {
    type: "createRoom",
    playerName: string
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
    position: Tuple<number, number>
}

export interface Player {
    name: string,
}

export type Tuple<Item, Length extends number> = [Item, ...Item[]] & { length: Length };


export type Shape = { type: typeof shapeTypes[number], color: typeof shapeColors[number] }

export interface RoomSettings {
    dimensionCount: number,
    sideLength: number,
    playerShapes: Shape[]
}

export type Board = { [K: string]: number | undefined }
