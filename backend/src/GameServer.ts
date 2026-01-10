import {WebSocketServer as WSS, WebSocket} from "ws";
import {randomBytes} from "node:crypto";
import type {
    Player,
    RoomSettings,
    GameOverReason,
    WsClientMessage,
    WsServerMessage,
    Shape
} from "../../shared/types.d.ts";
import logger from "./logger.ts";
import * as assert from "node:assert";
import {AssertionError} from "node:assert";
import type {BoardHandler} from "../../shared/tictactoe.ts";
import {shapeColors, shapeTypes} from "../../shared/shapes.ts";

export type Client = {
    /**
     * The ws connection to the client
     */
    socket: WebSocket;
    id: string,
    room: Room | null,
    player: Player
}

function failAssert(message: string): never {
    throw new AssertionError({message});
}

class Room {
    readonly #id: string;
    #clients: Client[] = [];
    #settings: RoomSettings = {
        dimensionCount: 2,
        sideLength: 3,
        playerShapes: [{type: shapeTypes[0], color: shapeColors[0]}]
    };
    #admin: Client;
    #gameState: {
        state: "wait"
    } | {
        state: "play",
        boardHandler: BoardHandler;
    } | {
        state: "end",
        boardHandler: BoardHandler;
        reason: GameOverReason,
    } = {state: "wait"};

    constructor(roomId: string, admin: Client) {
        this.#id = roomId;
        this.#admin = admin;
        this.addClient(admin);
    }

    id() {return this.#id;}

    isEditable() {
        return this.#gameState.state === "wait";
    }

    addClient(client: Client) {
        assert.ok(!this.#clients.includes(client), "Client already in this room");
        assert.equal(client.room, null, "Client already in a room");
        assert.equal(this.#gameState.state, "wait", "Game already running");

        this.#clients.push(client);
        this.#settings.playerShapes.push({type: shapeTypes[this.#clients.length % shapeTypes.length]!, color: shapeColors[this.#clients.length % shapeColors.length]!});
        client.room = this;

        send({type: "roomSetup", admin: this.#admin.player.name, players: this.playerList(), roomId: this.#id, playerId: client.player.name}, client);
        this.broadcast({type: "playerChange", players: this.playerList()});
    }

    changeSettings(settings: Partial<RoomSettings>): void {
        this.#settings = {...this.#settings, ...settings};
    }

    editPlayerShape(client: Client, shape: Shape) {
        const idx = this.#clients.indexOf(client);
        assert.notEqual(idx, -1, "Client not in the room");

        this.#settings.playerShapes[idx] = shape;

        this.broadcast({type: "roomSettings", playerShapes: this.#settings.playerShapes});
    }

    isNameAvailable(name: string) {
        return this.#clients.every(c => c.player.name !== name);
    }

    playerList() {
        return this.#clients.map(c => c.player.name);
    }

    gameOver(reason: GameOverReason) {
        if(this.#gameState.state !== "play") failAssert("No game active!");
        this.#gameState = {state: "end", boardHandler: this.#gameState.boardHandler, reason};

        this.broadcast({type: "gameEnd", board: this.#gameState.boardHandler.board, reason})
    }

    removeClient(client: Client) {
        assert.equal(client.room, this.#id, "Client has no connection to room");
        assert.ok(this.#clients.includes(client), "Client not registered in room");

        const clientIdx = this.#clients.indexOf(client);
        this.#clients.splice(clientIdx, 1);
        const playerShapes = this.#settings.playerShapes;
        this.#settings.playerShapes = [...playerShapes.slice(0, clientIdx), ...playerShapes.slice(clientIdx+1),playerShapes[clientIdx]!]
        client.room = null;

        if(this.#clients.length === 0) {
            return "removeRoom";
        }else if(this.#clients.length === 1 && this.#gameState.state === "play") {
            this.gameOver({type: "opponentsDisconnected"});
        }

        this.broadcast({type: "playerChange", players: this.playerList()})
    }

    broadcast(message: WsServerMessage) {
        for (const client of this.#clients) {
            send(message, client);
        }
    }
}

function send(message: WsServerMessage, client: Client) {
    logger.debug(`send message ${JSON.stringify(message)}`);
    client.socket.send(JSON.stringify(message));
}

export class GameServer {
    #wss: WSS;
    #clients: Map<string, Client> = new Map();
    #rooms: Map<string, Room> = new Map();

    constructor(port: number) {
        this.#wss = new WSS({port});
        logger.info(`Websocket server listening on port ${port}`);

        this.#wss.on('connection', socket => this.connect(socket))
    }

    connect(socket: WebSocket) {
        let userId = "";
        while (!userId || userId in this.#clients) {
            userId = randomBytes(16).toString("hex");
        }
        const client = {
            socket,
            id: userId,
            room: null,
            player: {
                name: "",
            }
        } satisfies Client;
        logger.debug(`Client connected: ${userId}`);

        this.#clients.set(userId, client);

        socket.on("message", data => {
            this.handleMessage("" + data, client);
        })

        socket.on("close", () => {
            logger.debug(`Client disconnected: ${userId}`);
            this.#clients.delete(userId);
            logger.debug(`Remaining clients: ${this.#clients.size}`)
        })
    }

    broadcast(message: WsServerMessage) {
        this.#clients.forEach(client => send(message, client))
    }

    createRoom(admin: Client) {
        const roomId = randomBytes(4).toString("hex");
        const room = new Room(roomId, admin);
        this.#rooms.set(roomId, room);
        return room;
    }

    handleMessage(data: string, client: Client) {
        logger.debug("Received message: " + data);
        let msg: WsClientMessage;
        try {
            msg = JSON.parse(data) as WsClientMessage;
        } catch (err) {
            logger.error("Invalid message: ", err);
            return;
        }
        switch (msg.type) {
            case "setup":
                send({type: "setup"}, client);
                break;
            case "joinRoom": {
                const room = this.#rooms.get(msg.roomId);
                if (room === undefined) {
                    send({type: "error", msg: "Room does not exist"}, client);
                    return;
                }
                if (!room.isNameAvailable(msg.playerName)) {
                    send({type: "error", msg: "Name already in use"}, client);
                    return;
                }
                if(!room.isEditable()) {
                    send({type: "error", msg: "Room already in game"},client);
                    return;
                }
                client.player.name = msg.playerName;
                room.addClient(client);
                break;
            }
            case "createRoom": {
                if(!(msg.playerName.length > 0)) {
                    send({type: "error", msg: "Name is empty"}, client);
                    return;
                }
                client.player.name = msg.playerName;
                this.createRoom(client);
                break;
            }
            case "leaveRoom": {
                if (client.room === null)
                    failAssert("Client not in a room");
                if(client.room.removeClient(client) === "removeRoom"){
                    this.#rooms.delete(client.room.id())
                }
                break;
            }
            case "selectShape": {
                if (client.room === null)
                    failAssert("Client not in a room");

                client.room.editPlayerShape(client, msg.shape);
            }
        }
    }
}