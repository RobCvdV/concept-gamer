import {Models} from "@rematch/core";
import {chatModel} from "./chatModel";
import {userModel} from "./userModel";

export interface RootModel extends Models<RootModel> {
  userModel: typeof userModel;
  chatModel: typeof chatModel;
}

export const models: RootModel = { userModel, chatModel };
