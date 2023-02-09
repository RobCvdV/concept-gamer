import { Json } from "../types/Json";
import { getNamedLogs } from "../utils/cons";
import { ISocketService } from "./SocketServer";
import { Server, Socket } from "socket.io";

type Store<V extends Json> = { [collectionName: string]: V };

export type MessageHandler = (message: any, socket: Socket) => Promise<unknown>;
type Listener = {
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
      socket.on(event, (m) => {
        return handler(m, socket).then(() => {
          cons.log(
            `[${this.name}] received ${event} from ${socket.client?.conn?.remoteAddress}`
          );

          if (broadcast) {
            cons.log(`[${this.name}] broadcasting ${event}`);
            socket.broadcast.emit(event, m);
          }
        });
      });
    });
  }

  onDisconnect(socket: Socket) {}
}
