export type WsServerMessage = {
    type: "join"
}

export type WsClientMessage = {}

export interface User {
    id: string,
    name: string
}

export type BoardCell = 0 | 1 | 2;

export type BoardVec = (-1 | 0 | 1)[];
export type BoardPosition = number[];