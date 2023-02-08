import {createModel} from "@rematch/core";
import {RootModel} from "./";

export type ChatMessage = { who: string; msg: string; when: string };

const initialChatState = {
  names: [] as string[],
  messages: [] as ChatMessage[],
};

export type ChatState = typeof initialChatState;
type PartialState = Partial<ChatState>;

export const chatModel = createModel<RootModel>()({
  state: { ...initialChatState },
  reducers: {
    reset: (s, partial?: PartialState) => ({ ...initialChatState, ...partial }),
    set: (s, partial?: PartialState) => ({ ...s, ...partial }),
    addChat: (s, msg: ChatMessage) => ({
      ...s,
      messages: s.messages.concat(msg),
    }),
  },
  effects: (dispatch) => ({}),
});
