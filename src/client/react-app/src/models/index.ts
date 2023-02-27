import { Models } from "@rematch/core";
import { chatModel } from "./chatModel";
import { userModel } from "./userModel";
import { boardModel } from "./boardModel";

export interface RootModel extends Models<RootModel> {
  userModel: typeof userModel;
  chatModel: typeof chatModel;
  boardModel: typeof boardModel;
}

export const models: RootModel = { userModel, chatModel, boardModel };
