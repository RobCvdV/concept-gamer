import express from "express";
import { projects } from "./resources/projects";
import cors from "cors";
import http from "http";
import { client, clientApp } from "./client/client";
import path from "path";
import { SocketServer } from "./data/SocketServer";
import { RocketStore } from "./data/RocketStore";
import { ChatGateway } from "./data/ChatGateway";
import { UserGateway } from "./data/UserGateway";

const port = process.env.PORT || 8080;

const app = express();
const server = http.createServer(app);

const socketServer = new SocketServer(server);
export const io = socketServer.io;
socketServer.registerService(UserGateway);
socketServer.registerService(ChatGateway);

const resources = [...client, ...projects];

app.use(express.json());
app.use(cors());
app.use(clientApp);

resources.forEach(({ method, route, handler }) => {
  const r = path.join(route);
  console.log("add route", r);
  app[method](r, handler);
});

RocketStore.initialize().then(() => {
  server.listen(port, () => {
    console.log("This server is listening at port", port);
  });
});

export type ResourceFunction = typeof app.get;
