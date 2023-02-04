import {Resource} from "../types/Resource";
import path from "path";
import express from "express";

export const clientApp = express.static(
  path.join(__dirname, "./react-app/build")
);

export const client: Resource[] = [
  {
    method: "get",
    route: "/test",
    handler: (req, res) => {
      res.sendFile(path.join(__dirname, "index.html"));
    },
  },
];
