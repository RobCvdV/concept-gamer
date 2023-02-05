import {socket} from "../Providers/SocketContext";
import {ChatMessage} from "../models/chatModel";
import {store} from "../models/store";
import {DateTime} from "luxon";

export class ManageChats {
  static initialized = false;

  constructor(
    readonly getChat = () => store.getState().chatModel,
    readonly chat = store.dispatch.chatModel,
    readonly getUser = () => store.getState().userModel,
    readonly user = store.dispatch.userModel
  ) {
    if (ManageChats.initialized) return;
    ManageChats.initialized = true;
    socket.on("chat-message", function (msg: ChatMessage) {
      if (msg.who === getUser()?.name) return;
      console.log("received chat", msg);
      chat.addChat(msg);
    });
    socket.on("chat-names", function (names: string[]) {
      console.log("received names", names);
      chat.set({ names });
    });

    const { name } = store.getState().userModel;
    if (name) {
      console.log("sending my name", name);
      socket.emit("user-name", name);
    }
  }

  sendChatMessage = (msg: string) => {
    const chat = {
      msg,
      who: this.getUser()?.name,
      when: DateTime.now(),
    } as ChatMessage;
    console.log("chat submit", msg);
    this.chat.addChat(chat);
    socket.emit("chat-message", chat);
  };

  changeName = (name: string) => {
    console.log("change name", name);
    this.user.set({ name });
    socket.emit("user-name", name);
  };
}
