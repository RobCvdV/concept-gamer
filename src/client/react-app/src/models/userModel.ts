import { createModel } from "@rematch/core";
import { RootModel } from "./";
import { User } from "../types/User";

const initialUserState = {
  user: { name: "" } as User,
  userNames: [] as string[],
};

export type UserState = typeof initialUserState;
type PartialState = Partial<UserState>;

export const userModel = createModel<RootModel>()({
  state: { ...initialUserState },
  reducers: {
    reset: (s, partial?: PartialState) => ({ ...initialUserState, ...partial }),
    set: (s, partial: PartialState) => ({ ...s, ...partial }),
    updateUser: (s, user: Partial<User>) => ({
      ...s,
      user: { ...s.user, ...user },
    }),
    setNames: (s, userNames: string[]) => ({ ...s, userNames }),
    changeMyName: (s, newName: string) => ({
      ...s,
      user: { ...s.user, name: newName },
      userNames: s.userNames.map((n) => (s.user.name === n ? newName : n)),
    }),
  },
  effects: (dispatch) => ({}),
});
