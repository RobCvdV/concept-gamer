import { userModel } from "../models/userModel";
import { getNamedLogs } from "../utils/cons";
import { Manage } from "./Manage";
import { User } from "../types/User";

const { injectCons } = getNamedLogs({ name: "ManageUser" });

export class ManageUser extends Manage<"userModel"> {
  constructor() {
    super("user", "userModel");

    this.initialize([
      {
        event: "names",
        handler: (names) => this.dispatch.setNames(names),
      },
      {
        event: "*",
        handler: () => this.dispatch.updateLastActivity(),
      },
    ]);
  }

  connect = () => {};

  register = (name: string) => {
    console.log("register user (name)", name);
    this.request<User>("register", name)
      .then((user) => this.dispatch.updateUser(user))
      .catch(injectCons.warn("something went wrong while registering"));
  };

  changeName = (name: string) => {
    console.log("change name to", name);
    const user = { ...this.state.user, name };
    this.request<User>("change-name", user)
      .then((user) => this.dispatch.changeMyName(user.name))
      .catch(injectCons.warn("something went wrong while changing user name"));
  };
}
