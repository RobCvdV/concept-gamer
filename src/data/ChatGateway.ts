import { Server, Socket } from "socket.io";
import { ChatMessage } from "../client/react-app/src/models/chatModel";
import { MessageHandler, SocketService } from "./SocketService";
import { RocketStore } from "./RocketStore";
import { randomUUID } from "crypto";
import { getNamedLogs } from "../utils/cons";

const { cons } = getNamedLogs({ name: "ChatGateway" });

export class ChatGateway extends SocketService {
  constructor(readonly io: Server) {
    super(io, "chat");

    this.listeners = [
      {
        event: "message",
        handler: this.handleChatMessage,
        broadcast: true,
      },
    ];
  }

  readonly history = new RocketStore<ChatMessage>(
    "history",
    (item) => `${item.when}-${randomUUID()}`
  );

  handleChatMessage: MessageHandler = (msg: ChatMessage) =>
    this.history.add(msg);

  onConnect(socket: Socket) {
    super.onConnect(socket);

    this.history
      .get()
      .then(
        (msgs) => {
          cons.log("send chat history to ", socket.id, ", 1000 chats");
          return msgs.slice(-1000);
        }
        //   .filter(
        //   ({ when }) => DateTime.fromISO(when).diffNow("days").days < 14
        // )
      )
      .then((msgs) => socket.emit("chat-history", msgs));
  }
}
