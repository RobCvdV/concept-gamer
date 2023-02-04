import {Request, Response} from "express";

export type ResourcePath = string;
export type ResourceHandler = (req: Request, res: Response) => void;
export type ApiMethod = "get" | "post" | "put" | "delete" | "use";

export type Resource = {
  method: ApiMethod;
  route: ResourcePath;
  handler: ResourceHandler;
};
