import React, {FC, useCallback, useRef} from "react";
import {Input, InputRef} from "./Input";
import {useSocket} from "../Providers/SocketContext";
import {ChatMessageCard} from "./ChatMessageCard";
import {DateTime} from "luxon";
import {ChatMessage} from "../models/chatModel";
import {ManageChats} from "../useCases/ManageChats";
import {useModelState} from "../models/store";

const chatStyle: React.CSSProperties = {
  justifySelf: "flex-end",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  fontSize: "14pt",
  justifyContent: "flex-end",
  border: "gray solid 1px",
  padding: "5px",
};

type Props = {
  uc?: ManageChats;
};

export const Chat: FC<Props> = ({ uc = new ManageChats() }) => {
  const socket = useSocket();
  const messageRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<InputRef>(null);

  const { names, name, messages } = useModelState("chatModel");

  const onSubmitChat = useCallback(
    (msg: string) => {
      console.log("chat submit", msg);
      socket.emit("chat-message", {
        msg,
        who: name,
        when: DateTime.now(),
      } as ChatMessage);
    },
    [socket]
  );

  const onSubmitName = useCallback(
    (name: string) => {
      console.log("change name", name);
      socket.emit("user-name", name);
      chatInputRef.current?.focus();
    },
    [socket]
  );

  return (
    <div style={chatStyle}>
      <Input
        key="name"
        label="Chat naam"
        onSubmit={onSubmitName}
        style={{ justifySelf: "flex-start" }}
      />
      <div id="messages" ref={messageRef} style={{ flex: 1 }}>
        {messages.map((msg) => (
          <ChatMessageCard {...msg} />
        ))}
      </div>
      <Input
        key="chat-input"
        onSubmit={onSubmitChat}
        showButton
        ref={chatInputRef}
      />
    </div>
  );
};
