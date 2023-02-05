import React, {FC, useCallback, useRef} from "react";
import {Input, InputRef} from "./Input";
import {ChatMessageCard} from "./ChatMessageCard";
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
  const messageRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<InputRef>(null);

  const { names, messages } = useModelState("chatModel");
  const { name } = useModelState("userModel");

  const onSubmitChat = useCallback(
    (msg: string) => {
      msg && uc?.sendChatMessage(msg);
    },
    [uc]
  );

  const onSubmitName = useCallback(
    (name: string) => {
      uc?.changeName(name);
      chatInputRef.current?.focus();
    },
    [uc, chatInputRef]
  );

  return (
    <div style={chatStyle}>
      <Input
        key="name"
        label="Chat naam"
        placeholder={name}
        onSubmit={onSubmitName}
        style={{ justifySelf: "flex-start" }}
      />
      <div
        id="messages"
        ref={messageRef}
        style={{ flex: 1, overflowY: "scroll" }}
      >
        {messages.map(({ msg, who, when }, i) => (
          <ChatMessageCard
            key={i}
            msg={msg}
            who={who}
            when={when}
            isMe={who === name}
          />
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
