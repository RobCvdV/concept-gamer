import {Json} from "../types/Json";
import {getNamedLogs} from "../utils/cons";
import {ISocketService} from "./SocketServer";
import {Server, Socket} from "socket.io";

type Store<V extends Json> = { [collectionName: string]: V };

type Listener = {
  event: string;
  handler: <T>(message: T) => Promise<void>;
  broadcast?: boolean;
};

export const { cons } = getNamedLogs({ name: "SocketService" });

export class SocketService implements ISocketService {
  constructor(
    readonly io: Server,
    readonly name: string,
    readonly listeners: Listener[]
  ) {}

  onConnect(socket: Socket) {
    this.listeners.map(({ event, handler, broadcast = true }) => {
      socket.on(event, (m) => {
        return handler(m).then(() => {
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
