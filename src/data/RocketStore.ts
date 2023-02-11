import { Json } from "../types/Json";
import _ from "lodash";
import { randomUUID } from "crypto";
import { Id } from "../types/Id";
import { getNamedLogs } from "../utils/cons";

const rs = require("rocket-store");
const storagePath = "./.storage/";

export enum Get {}

type GetResult<V> = { count: number; key: string[]; result: V[] };
type SortOrder = "asc" | "desc";

const { injectCons, cons } = getNamedLogs({ name: "RocketStore" });

export class RocketStore<V extends Json> {
  static async initialize() {
    return rs.options({
      data_storage_area: storagePath,
      data_format: rs._FORMAT_JSON,
    });
  }

  readonly postOptions = 0;

  constructor(
    readonly name: string,
    readonly idGenerator?: (item: V) => Id,
    idOptions: "addGuid" | "addAutoInc" | "nothing" = "nothing"
  ) {
    this.postOptions =
      idOptions === "addGuid"
        ? rs._ADD_GUID
        : idOptions === "addAutoInc"
        ? rs._ADD_AUTO_INC
        : 0;
  }

  add = (value: V): Promise<V> => {
    cons.log("add", value);
    const id = this.idGenerator ? this.idGenerator(value) : randomUUID();
    return this.update(`${id}`, value);
  };

  update(key: Id, value: V): Promise<V> {
    return rs.post(this.name, key, value, this.postOptions).then(() => value);
  }

  updateBunch(dict: { [key: Id]: V }): Promise<any> {
    return Promise.all(
      _.entries(dict).map(([k, v]) =>
        rs.post(this.name, k, v, this.postOptions)
      )
    );
  }

  // Excepts wildcards, like "Mr\*" and "Jo? P?rini". Defaults to "\*"
  get(search = "*", order: SortOrder = "asc"): Promise<V[]> {
    const options = order === "asc" ? rs._ORDER : rs._ORDER_DESC;
    return rs
      .get(this.name, search, options)
      .then(injectCons.log("get"))
      .then(({ result }: GetResult<V>) => result || [])
      .then(injectCons.log("get result"))
      .catch(injectCons.log("get rejected"));
  }

  // Excepts wildcards, like "Mr\*" and "Jo? P?rini". Defaults to "\*"
  getKeys(search = "*", order: SortOrder = "asc"): Promise<string[]> {
    const options = order === "asc" ? rs._ORDER : rs._ORDER_DESC;
    return rs
      .get(this.name, search, options)
      .then(({ key }: GetResult<V>) => key || [])
      .catch(injectCons.log("getKeys rejected"));
  }

  // Excepts wildcards, like "Mr*" and "Jo??f" and "*". Be careful
  delete(matching: string): Promise<number> {
    return rs.delete(this.name, matching);
  }
}
