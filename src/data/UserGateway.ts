import { Server, Socket } from "socket.io";
import { MessageHandler, SocketService } from "./SocketService";
import { RocketStore } from "./RocketStore";
import { randomUUID } from "crypto";
import { getNamedLogs, injectCons } from "../utils/cons";
import { User } from "../types/User";
import { whenUndefined } from "../utils/whenUndefined";
import { whenDefined } from "../utils/whenDefined";

const { cons } = getNamedLogs({ name: "UserGateway" });

export class UserGateway extends SocketService {
  constructor(readonly io: Server) {
    super(io, "user");

    this.listeners = [
      {
        event: "change-name",
        handler: this.handleChangeName,
        broadcast: true,
      },
      {
        event: "register",
        handler: this.handleRegister,
        broadcast: true,
      },
    ];
  }

  readonly users = new RocketStore<User>("users", (u) => u.id, "addGuid");

  handleRegister: MessageHandler = (name: string, socket): Promise<User> => {
    cons.log("name", name);
    return this.users
      .get()
      .then((us) => us.find((u) => u.name === name))
      .then(injectCons.log("handleRegisterUser lookup:"))
      .then(
        whenUndefined(() =>
          this.users
            .add({
              socketId: socket.id,
              name,
              id: randomUUID(),
              address: socket.client.conn.remoteAddress,
            })
            .then(injectCons.log("handleRegisterUser new user:"))
        )
      );
  };

  handleChangeName: MessageHandler = (u: User, sock) =>
    this.users.update(u.id, u);

  onConnect(socket: Socket) {
    super.onConnect(socket);

    this.users
      .get()
      .then((us) => us?.map(({ name }) => name))
      .then((names) => {
        cons.log("give all user name to new connection", names);
        return socket.emit("names", names);
      });
  }
}
