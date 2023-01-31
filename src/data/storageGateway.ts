import * as filesystem from "fs";
import _ from "lodash";

const storagePath = "./.storage/";
const toRelativePath = (...paths: string[]): string =>
  paths
    .flatMap((p) => p.split("/"))
    .filter((s) => !_.isEmpty(s))
    .join("/");

export class StorageGateway {
  path: string = "";

  constructor(readonly name: string, readonly fs = filesystem) {
    this.path = toRelativePath(storagePath, name);

    if (this.fs.existsSync(this.path)) return;
    this.fs.mkdirSync(this.path, { recursive: true });
  }

  private filePath = (filename: string) => toRelativePath(this.path, filename);

  save(filename: string, data: JSON): Promise<void> {
    return new Promise((resolve, reject) => {
      this.fs.writeFile(
        this.filePath(filename),
        JSON.stringify(data),
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  load(filename: string): Promise<JSON> {
    return new Promise((resolve, reject) => {
      this.fs.readFile(this.filePath(filename), (err, data) => {
        if (err) reject(err);
        else {
          try {
            console.log("load data", data.toString("utf-8"));
            resolve(JSON.parse(data.toString("utf-8")));
          } catch (e) {
            reject(e);
          }
        }
      });
    });
  }

  getNames(): Promise<string[]> {
    return new Promise((resolve, reject) => {
      this.fs.readdir(this.path, (err, names) => {
        if (err) reject(err);
        else {
          try {
            console.log("load dir", names);
            resolve(names);
          } catch (e) {
            reject(e);
          }
        }
      });
    });
  }
}
