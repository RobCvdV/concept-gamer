import { Server, Socket } from "socket.io";
import _ from "lodash";
import { ChatMessage } from "../client/react-app/src/models/chatModel";
import { MessageHandler, SocketService } from "./SocketService";
import { RocketStore } from "./RocketStore";
import { randomUUID } from "crypto";
import { getNamedLogs } from "../utils/cons";
import { Id } from "../types/Id";
import { User } from "./User";

const { cons } = getNamedLogs({ name: "ChatGateway" });

export class ChatGateway extends SocketService {
  constructor(readonly io: Server) {
    super(io, "chat");

    this.listeners = [
      {
        event: "chat-message",
        handler: this.handleChatMessage,
        broadcast: true,
      },
      {
        event: "change-user-name",
        handler: this.handleChangeUserName,
        broadcast: true,
      },
    ];
  }

  readonly users = new RocketStore<User>("users", (u) => u.id, "addGuid");
  readonly history = new RocketStore<ChatMessage>(
    "history",
    (item) => `${item.when}-${randomUUID()}`
  );

  handleChatMessage: MessageHandler = (msg: ChatMessage) =>
    this.history.add(msg);

  handleLookupUser: MessageHandler = (name: string, sock) => {
    return this.users.get(`*${name}*`).then((u) => sock.emit("new-user", u));
  };

  handleAddUser: MessageHandler = (name: string, sock) => {
    return this.users
      .add({
        socketId: sock.id,
        name,
        id: randomUUID(),
      })
      .then((u) => sock.emit("new-user", u));
  };

  handleChangeUserName: MessageHandler = (u: User, sock) =>
    this.users.put(u.id, u);

  onConnect(socket: Socket) {
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
