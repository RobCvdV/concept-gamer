import React, {
  FC,
  UIEventHandler,
  useCallback,
  useRef,
  useState,
} from "react";
import { Input, InputRef } from "./Input";
import { ChatMessageCard } from "./ChatMessageCard";
import { ManageChats } from "../useCases/ManageChats";
import { useModelState } from "../models/store";
import { Button } from "react-bootstrap";

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

const isScrollingOffset = 60;

export const Chat: FC<Props> = ({ uc = new ManageChats() }) => {
  const [scrollingMode, setScrollingMode] = useState(0);
  const chatInputRef = useRef<InputRef>(null);

  const { names, messages } = useModelState("chatModel");
  const { name } = useModelState("userModel");

  const userIsScrolling = useCallback<UIEventHandler<HTMLDivElement>>(
    (ev) => {
      const { scrollTop, scrollHeight, offsetHeight } = ev.currentTarget;
      const distBottom = scrollHeight - offsetHeight - scrollTop;

      setScrollingMode((scr) => {
        const newScr =
          scr === 0
            ? distBottom > isScrollingOffset
              ? 0
              : 1
            : scr === 1
            ? distBottom > isScrollingOffset
              ? 2
              : 1
            : distBottom > isScrollingOffset
            ? 2
            : 1;
        return newScr;
      });
    },
    [setScrollingMode]
  );

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
        style={{
          overflowY: "scroll",
          scrollBehavior: "revert",
          maxHeight: "90%",
        }}
        onScroll={userIsScrolling}
      >
        <div id="messages" style={{ flex: 1 }}>
          {messages.map(({ msg, who, when }, i) => (
            <ChatMessageCard
              key={i}
              msg={msg}
              who={who}
              when={when}
              isMe={who === name}
              scrollToMe={scrollingMode < 2 && messages.length - 1 === i}
            />
          ))}
        </div>
      </div>
      {scrollingMode === 2 && (
        <Button
          style={{ margin: "2px" }}
          variant="outline-light"
          onClick={() => setScrollingMode(0)}
        >
          Go Down
        </Button>
      )}
      <Input
        key="chat-input"
        onSubmit={onSubmitChat}
        showButton
        ref={chatInputRef}
      />
    </div>
  );
};
