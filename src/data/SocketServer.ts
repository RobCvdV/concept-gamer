import { Server, Socket } from "socket.io";
import http from "http";
import _ from "lodash";
import { Constructor } from "../types/Constructor";

export interface ISocketService {
  onConnect: (socket: Socket) => void;
  onDisconnect: (socket: Socket) => void;
  messages?: { [messageType: string]: (socket: Socket) => void };
}

export class SocketServer {
  readonly services: ISocketService[] = [];

  constructor(
    readonly server: http.Server,
    readonly io = new Server(server, {
      cors: {
        origin: "*",
      },
    })
  ) {}

  init() {
    this.io.on("connection", (socket) => {
      console.log("a user connected", socket.id);

      socket.on("disconnect", () => {
        console.log("user disconnected", socket.client?.conn?.remoteAddress);
      });
    });
  }

  registerService(serviceCtor: Constructor<ISocketService>) {
    const service = new serviceCtor(this.io);
    console.log("registered service", serviceCtor.name);
    // console.log("has io", (service as any).io);
    this.services.push(service);

    this.io.on("connection", (sock) => service.onConnect(sock));
    this.io.sockets.on("disconnect", (sock) => service.onDisconnect(sock));

    _.entries(service.messages).map((onSomething) => {
      this.io.sockets.on(...onSomething);
    });
  }
}
