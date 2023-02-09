import { Json } from "../types/Json";
import _ from "lodash";
import { randomUUID } from "crypto";
import { Id } from "../types/Id";

const rs = require("rocket-store");
const storagePath = "./.storage/";

export enum Get {}

type GetResult<V> = { count: number; keys: string[]; results: V[] };
type SortOrder = "asc" | "desc";

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
    const id = this.idGenerator ? this.idGenerator(value) : randomUUID();
    return this.put(`${id}`, value);
  };

  put(key: Id, value: V): Promise<V> {
    return rs.post(this.name, key, value, this.postOptions);
  }

  putBunch(dict: { [key: Id]: V }): Promise<any> {
    return Promise.all(
      _.entries(dict).map(([k, v]) =>
        rs.post(this.name, k, v, this.postOptions)
      )
    );
  }

  get(search = "*", order: SortOrder = "asc"): Promise<V[]> {
    const options = order === "asc" ? rs._ORDER : rs._ORDER_DESC;
    return rs
      .get(this.name, search, options)
      .then(({ results }: GetResult<V>) => results);
  }

  getKeys(search = "*", order: SortOrder = "asc"): Promise<string[]> {
    const options = order === "asc" ? rs._ORDER : rs._ORDER_DESC;
    return rs
      .get(this.name, search, options)
      .then(({ keys }: GetResult<V>) => keys);
  }

  delete(matching = "*"): Promise<number> {
    return rs.delete(this.name, matching);
  }
}
