import express from "express";
import { projects } from "./resources/projects";
import cors from "cors";
import StatusCodes from "http-status-codes";

const app = express();
app.use(express.json());
app.use(cors());

const port = 3000;

const resources = [...projects];
//
resources.forEach(({ method, route, handler }) => {
  const r = route.startsWith("/") ? route : `/${route}`;
  app[method](r, handler);
});

app.post("/test/:alles", (req, res) => {
  console.log(req);
  res.sendStatus(StatusCodes.OK);
});

// app.get("/", (req, res) => {
//   res.send("this is the game concept app server");
// });

app.listen(port, () => {
  console.log("This server is listening at port", port);
});

export type ResourceFunction = typeof app.get;
