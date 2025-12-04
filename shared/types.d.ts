export type WsServerMessage = {
    type: "join"
}

export type WsClientMessage = {}

export interface User {
    id: string,
    name: string
}