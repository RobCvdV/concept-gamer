import { store } from "../models/store";
import { DateTime } from "luxon";
import { Manage } from "./Manage";
import { User } from "../types/User";
import { ChatMessage } from "../../../src/types/chatMessage";

export class ManageChats extends Manage<"chatModel"> {
  private get user(): User {
    const { user } = store.getState().userModel;
    if (!user || !user.name) throw "user not defined (yet)";
    return user;
  }

  constructor() {
    super("chat", "chatModel");

    this.initialize([
      {
        event: "message",
        handler: (msg: ChatMessage) =>
          Promise.resolve(this.dispatch.addChat(msg)),
      },
    ]);
  }

  sendChatMessage = (msg: string) => {
    const chat = {
      msg,
      who: this.user.name,
      when: DateTime.now().toUTC().toISO(),
    } as ChatMessage;
    this.dispatch.addChat(chat);
    this.post("message", chat).catch(() => {
      this.dispatch.set({
        messages: this.state.messages.slice(-1),
      });
    });
  };
}
