import {init, RematchDispatch, RematchRootState, RematchStore,} from "@rematch/core";
import {models, RootModel} from "./";
import persistPlugin from "@rematch/persist";
import storage from "redux-persist/lib/storage";
import {useSelector} from "react-redux";
import {PersistConfig} from "redux-persist/es/types";
import {userModel} from "./userModel";

export type Store = RematchStore<RootModel, RootModel>;
export type Dispatch = RematchDispatch<RootModel>;
export type RootState = RematchRootState<RootModel>;
export const useModelState = <K extends keyof RootState>(model: K) =>
  useSelector((state: RootState) => state[model] as RootState[K]);

const persistConfig: PersistConfig<Store, any, any, any> = {
  key: "root",
  storage,
  whitelist: ["userModel", "chatModel"],
};

const persist = persistPlugin<Store, RootModel, RootModel>(persistConfig);

export const store: Store = init({
  name: "game-collaborator",
  models,
  plugins: [persist],
});
