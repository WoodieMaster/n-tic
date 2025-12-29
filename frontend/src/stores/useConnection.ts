import type {WsClientMessage, WsServerMessage} from "../../../shared/types";


const url = `ws://${new URL(document.URL).hostname}:9995`;

let socket: WebSocket;
let eventTarget = new EventTarget();

export class ServerMessageEvent extends Event {
    message: WsServerMessage;

    constructor(message: WsServerMessage) {
        super("servermessage", {bubbles: false, cancelable: true, composed: false});
        this.message = message;
    }
}

function newSocket() {
    socket = new WebSocket(url);

    socket.onclose = () => {
        newSocket();
    }

    socket.onopen = () => {
        socket.send(JSON.stringify({type: "setup", reconnectId: null} satisfies WsClientMessage));
    }

    socket.onmessage = e => {
        const msg = JSON.parse(e.data) as WsServerMessage;

        eventTarget.dispatchEvent(new ServerMessageEvent(msg));
    }

    return socket;
}

newSocket();


export default () => {
    return {
        sendMessage(msg: WsClientMessage) {
            socket.send(JSON.stringify(msg));
        },
        registerMessageHandler(handler: (e: ServerMessageEvent) => void) {
            eventTarget.addEventListener("servermessage", handler as EventListener)
        },
        removeMessageHandler(handler: (e: ServerMessageEvent) => void) {
            eventTarget.removeEventListener("servermessage", handler as EventListener)
        }
    };
};