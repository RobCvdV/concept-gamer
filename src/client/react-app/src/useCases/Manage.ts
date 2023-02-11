import { getNamedLogs } from "../utils/cons";
import { Store, store } from "../models/store";
import { socket } from "../Providers/SocketContext";
import { RootModel } from "../models";
import { reject } from "lodash";
import { AnyObject } from "../types/AnyObject";
import { SimpleType } from "../types/SimpleType";

export type MessageHandler = (message: any, reply?: Reply) => Promise<unknown>;

type Defined = AnyObject | SimpleType;

export type Reply<T extends any = any> = {
  result?: T;
  error?: any;
};

export type Listener = {
  event: string;
  handler: MessageHandler;
};

export type Post = {
  event: string;
  message: any;
  acknowledge?: () => void;
};

const { cons } = getNamedLogs({ name: "Manage" });

export class Manage<M extends keyof RootModel, E extends string = string> {
  protected log = (cmd: string, ...args: any[]) =>
    cons.log(`"${cmd}"`, ...args);
  protected error = (cmd: string, ...args: any[]) =>
    cons.error(`"${cmd}"`, ...args);

  protected listeners: Listener[] = [];

  constructor(
    protected readonly name: string,
    protected readonly modelName: M
  ) {}

  protected get state(): RootModel[M]["state"] {
    return store.getState()[this.modelName];
  }

  protected get dispatch(): Store["dispatch"][M] {
    return store.dispatch[this.modelName];
  }

  protected initialize(listeners: Listener[]) {
    this.listeners = listeners;
    this.listeners.map(({ event, handler }) => {
      const cmd = `${this.name}.${event}`;
      return socket.on(cmd, (m) => {
        this.log(cmd, `received from server`);
        return handler(m).then(() => {
          this.log(cmd, `handled from server`);
        });
      });
    });
  }

  protected request<O extends Defined>(event: E, msg: any): Promise<O> {
    const cmd = `${this.name}.${event}`;
    this.log(cmd, `to server, waiting for reply`, JSON.stringify(msg));
    return new Promise<O>((resolve, reject) =>
      socket
        .timeout(5000)
        .emit(cmd, msg, (timeout: string, { result, error }: Reply) => {
          const err = error || timeout;
          if (err) {
            this.error(cmd, `reply error: ${JSON.stringify(err)}`);
            reject(err);
          } else {
            this.log(cmd, `reply result: ${JSON.stringify(result)}`);
            resolve(result);
          }
        })
    );
  }

  protected post<T = any>(event: E, msg: T) {
    const cmd = `${this.name}.${event}`;
    this.log(cmd, `emitting to server`, JSON.stringify(msg));
    return new Promise((resolve, reject1) =>
      socket.emit(cmd, msg, ({ result, error }: Reply) => {
        if (error) {
          this.error(cmd, `reply error: ${JSON.stringify(error)}`);
          reject(error);
        } else {
          this.log(cmd, `reply result: ${JSON.stringify(result)}`);
          resolve(result);
        }
      })
    );
  }
}
