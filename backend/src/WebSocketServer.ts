import {WebSocketServer as WSS, WebSocket} from "ws";
import {randomBytes} from "node:crypto";
import type {User, WsClientMessage, WsServerMessage} from "../../shared/types.d.ts";
import logger from "./logger.ts";

export type Client = {
    /**
     * The ws connection to the client
     */
    socket: WebSocket;

    user: User
}

export class WebSocketServer {
    private wss: WSS;
    private clients: Map<string, Client> = new Map();

    constructor(port: number) {
        this.wss = new WSS({port});
        logger.info(`Websocket server listening on port ${port}`);

        this.wss.on('connection', socket => this.connect(socket))
    }

    connect(socket: WebSocket) {
        let userId = "";
        while (!userId || userId in this.clients) {
            userId = randomBytes(16).toString("hex");
        }
        const client = {
            socket,
            user: {
                id: userId,
                name: "",
            }
        } satisfies Client;
        logger.debug(`Client connected: ${userId}`);

        this.broadcast({
            type: "join",
        });

        this.clients.set(userId, client);

        socket.on("message", data => {
            this.handleMessage("" + data, client);
        })

        socket.on("close", () => {
            logger.debug(`Client disconnected: ${userId}`);
            this.clients.delete(userId);
            logger.debug(`Remaining clients: ${this.clients.size}`)
        })
    }

    broadcast(message: WsServerMessage) {
        this.clients.forEach(client => this.send(message, client))
    }

    send(message: WsServerMessage, client: Client) {
        client.socket.send(JSON.stringify(message));
    }

    handleMessage(data: string, client: Client) {
        logger.debug("Received message", data);
        try {
            const msg: WsClientMessage = JSON.parse(data);
            if (msg === null) return;
        } catch (err) {
            logger.error("Invalid message: ", err);
        }
    }
}