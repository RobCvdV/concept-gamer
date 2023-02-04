import {socket} from "../Providers/SocketContext";
import {ChatMessage} from "../models/chatModel";
import {store} from "../models/store";

export class ManageChats {
  constructor(
    readonly getState = () => store.getState().chatModel,
    readonly dispatch = store.dispatch.chatModel
  ) {
    socket.on("chat-message", function (msg: ChatMessage) {
      dispatch.addChat(msg);
    });
    socket.on("chat-names", function (names: string[]) {
      dispatch.set({ names });
    });

    const { name } = getState();
    if (name) {
      socket.emit("user-name", { id: socket.id, name });
    }
  }
}
