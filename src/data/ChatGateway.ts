import {Server, Socket} from "socket.io";
import _ from "lodash";
import {ChatMessage} from "../client/react-app/src/models/chatModel";
import {SocketService} from "./SocketService";
import {RocketStore} from "./RocketStore";
import {randomUUID} from "crypto";

type User = {
  name: string;
};

export class ChatGateway extends SocketService {
  constructor(
    readonly io: Server,
    readonly users = new RocketStore<User>(
      "users",
      (item) => item.name,
      "addGuid"
    ),
    readonly history = new RocketStore<ChatMessage>(
      "history",
      (item) => `${item.when}-${randomUUID()}`
    )
  ) {
    super(io, "chat", [
      {
        event: "chat-message",
        handler: (message) => this.history.add(message),
      },
    ]);
    // storage
    //   .load("names", {})
    //   .then((names) => (this.names = (names as any) || {}))
    //   .catch(() => storage.save("names", {}));
    // storage
    //   .load("history", [])
    //   .then((history) => (this.history = (history as any) || []))
    //   .catch(() => storage.save("history", []));
  }

  onConnect(socket: Socket) {
    socket.on("chat-message", (msg: ChatMessage) => {
      cons.log("received chat from", this.names[socket.id], msg);
      socket.broadcast.emit("chat-message", msg);
    });

    socket.on("user-name", (name) => {
      cons.log("received user name", this.names[socket.id], "=>", name);
      const priorName = this.names[socket.id];
      this.names[socket.id] = name;
      this.saveNames();

      // this.io.emit("chat-names", _.values(this.names));
      socket.broadcast.emit("user-name", { oldName: priorName, name });
    });

    socket.emit("chat-names", _.values(this.names));
  }

  onDisconnect(socket: Socket) {
    delete this.names[socket.id];
    this.saveNames();
  }

  saveNames = () => {
    this.storage.save("names", this.names);
  };

  messages = {};
}
