import { Json } from "../types/Json";
import { getNamedLogs } from "../utils/cons";
import { ISocketService } from "./SocketServer";
import { Server, Socket } from "socket.io";

export type Reply = (message: any) => void;
export type MessageHandler = (message: any, socket: Socket) => Promise<unknown>;

export type Listener = {
  event: string;
  handler: MessageHandler;
  broadcast?: boolean;
};

export const { cons } = getNamedLogs({ name: "SocketService" });

export class SocketService implements ISocketService {
  listeners: Listener[] = [];

  constructor(readonly io: Server, readonly name: string) {}

  onConnect(socket: Socket) {
    this.listeners.map(({ event, handler, broadcast = true }) => {
      const cmd = `${this.name}.${event}`;
      socket.on(cmd, (m, reply: Reply) => {
        return handler(m, socket)
          .then((result) => {
            cons.log(`[${this.name}] received "${cmd}" from ${socket.id}`);
            reply({ result });

            if (broadcast) {
              cons.log(`[${this.name}] broadcasting "${cmd}"`);
              socket.broadcast.emit(cmd, m);
            }
          })
          .catch((error) => {
            cons.error(`message "${cmd}" handler error,`, error);
            reply({ error });
          });
      });
    });
  }

  onDisconnect(socket: Socket) {}
}
