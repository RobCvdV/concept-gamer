import {createModel} from "@rematch/core";
import {RootModel} from "./";

const initialUserState = {
  name: "",
};

export type UserState = typeof initialUserState;
type PartialState = Partial<UserState>;

export const userModel = createModel<RootModel>()({
  state: { ...initialUserState },
  reducers: {
    reset: (s, partial?: PartialState) => ({ ...initialUserState, ...partial }),
    set: (s, partial?: PartialState) => ({ ...s, ...partial }),
  },
  effects: (dispatch) => ({}),
});
