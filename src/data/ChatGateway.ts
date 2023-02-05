import {StorageGateway} from "./StorageGateway";
import {Server, Socket} from "socket.io";
import {ISocketService} from "./SocketServer";
import _ from "lodash";
import {ChatMessage} from "../client/react-app/src/models/chatModel";

let _next = 1;

export class ChatGateway implements ISocketService {
  names: { [k: string]: string } = {};
  history: ChatMessage[] = [];

  constructor(
    readonly io: Server,
    readonly storage = new StorageGateway("chat")
  ) {
    storage
      .load("names", {})
      .then((names) => (this.names = (names as any) || {}))
      .catch(() => storage.save("names", {}));
    storage
      .load("history", [])
      .then((history) => (this.history = (history as any) || []))
      .catch(() => storage.save("history", []));
  }

  onConnect(socket: Socket) {
    // if (!this.names[socket.id]) {
    //   this.names[socket.id] = `newby ${_next++}`;
    //   // socket.emit("user-name", this.names[socket.id]);
    // }

    socket.on("chat-message", (msg: ChatMessage) => {
      console.log("received chat from", this.names[socket.id], msg);
      socket.broadcast.emit("chat-message", msg);
    });

    socket.on("user-name", (name) => {
      console.log("received user name", this.names[socket.id], "=>", name);
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
