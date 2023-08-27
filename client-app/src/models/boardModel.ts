import { createModel } from "@rematch/core";
import { RootModel } from "./";
import { Position } from "../types/Position";
import { Size } from "../types/Size";

export type CardState = {
  id: string;
  position: Position;
  size?: Size;
  scale?: number;
  rotation?: number;
};

const cards = [0, 1, 2, 3, 4, 5]
  .map((c) => ({
    position: { x: 100 + c * 20, y: 200 + Math.abs(c - 2.5) * 7 },
    size: { w: 1, h: 1 },
    rotation: -25 + c * 10,
    scale: 1,
  }))
  .reduce((dict, c, i) => {
    const id = `${i + 1}`;
    dict[id] = { ...c, id };
    return dict;
  }, {} as { [id: string]: CardState });

const initialBoardState = {
  cards,
};

export type BoardState = typeof initialBoardState;
type PartialState = Partial<BoardState>;

export const boardModel = createModel<RootModel>()({
  state: { ...initialBoardState },
  reducers: {
    reset: (s, partial?: PartialState) => ({
      ...initialBoardState,
      ...partial,
    }),
    set: (s, partial?: PartialState) => ({ ...s, ...partial }),
    addCard: (s, card: CardState) => {
      return {
        ...s,
        cards: { ...s.cards, [card.id]: card },
      };
    },
    moveCard: (s, { id, position }: { id: string; position: Position }) => ({
      ...s,
      ...s,
      cards: { ...s.cards, [id]: { ...s.cards[id], position } },
    }),
  },
  effects: (dispatch) => ({}),
});
