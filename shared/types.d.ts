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
} | {
    type: "roomSettings",
    dimensionCount?: number,
    sideLength?: number,
    playerShapes?: Record<string, Shape>,
} | {
    type: "gameEnd",
    winner: string,
    board: BoardCell[],
    reason: {
        type: "board",
        winVec: BoardVec,
        winPosition: BoardPosition
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
    position: BoardPosition
}

export interface User {
    id: string,
    name: string
}

export type BoardCell = 0 | 1 | 2;

export type BoardVec = (-1 | 0 | 1)[];
export type BoardPosition = number[];

export type Shape = "cross" | "circle" | "square" | "triangle"