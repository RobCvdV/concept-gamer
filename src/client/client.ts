import {Resource} from "../types/Resource";
import path from "path";
import express from "express";

export const clientApp = express.static(
  path.join(__dirname, "./react-app/build"),
  {
    setHeaders: (res) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "X-Requested-With");
    },
  }
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
