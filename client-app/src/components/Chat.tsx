import React, {
  FC,
  UIEventHandler,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { Input, InputRef } from "./Input";
import { ChatMessageCard } from "./ChatMessageCard";
import { ManageChats } from "../useCases/ManageChats";
import { useModelState } from "../models/store";
import { Button, Stack } from "react-bootstrap";
import { Account } from "./Account";

const chatStyle: React.CSSProperties = {
  minWidth: "300px",
  maxWidth: "40%",
  width: "20%",
  height: "100vh",
  display: "flex",
  flexDirection: "column",
  justifyContent: "flex-start",
  padding: "5px",
  fontSize: "14pt",
  backgroundColor: "black",
  border: "gray solid 1px",
};

const messagesStyle: React.CSSProperties = {
  flex: 1,
  fontSize: "14pt",
};

type Props = {
  uc?: ManageChats;
};

const isScrollingOffset = 60;

export const Chat: FC<Props> = ({ uc = new ManageChats() }) => {
  const [scrollingMode, setScrollingMode] = useState(0);
  const chatInputRef = useRef<InputRef>(null);

  const { messages } = useModelState("chatModel");
  const {
    user: { name },
  } = useModelState("userModel");

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

  return (
    <Stack direction="vertical" gap={1} style={chatStyle}>
      <Account nextFocusRef={chatInputRef} />
      <div
        style={{
          flex: 1,
          overflowY: "scroll",
          scrollBehavior: "revert",
          maxHeight: "100%",
          padding: "5px 0",
        }}
        onScroll={userIsScrolling}
      >
        <Stack id="messages" style={messagesStyle} direction="vertical" gap={2}>
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
        </Stack>
      </div>
      <Stack
        gap={3}
        style={{ flex: 0, marginTop: "6px", backgroundColor: "black" }}
      >
        {scrollingMode === 2 && (
          <Button
            style={{
              margin: "2px",
            }}
            variant="outline-light"
            onClick={() => setScrollingMode(0)}
          >
            Go Down
          </Button>
        )}
        <Input
          key="chat-input"
          onSubmit={onSubmitChat}
          rightElement="Send"
          ref={chatInputRef}
        />
      </Stack>
    </Stack>
  );
};
