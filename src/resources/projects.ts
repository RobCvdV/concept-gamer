import {Resource} from "../types/Resource";
import {StorageGateway} from "../data/StorageGateway";
import StatusCodes from "http-status-codes";

const projectStorage = () => new StorageGateway("projects");

export const projects: Resource[] = [
  {
    method: "get",
    route: "/projects/",
    handler: (req, res) => {
      projectStorage()
        .getNames()
        .then((data) => {
          const names = data.map((fn) => fn.replace(".json", ""));
          console.debug("projects /", names);
          return res.send(names);
        })
        .catch((e) => {
          console.error("projects /", e);
          res.status(StatusCodes.NOT_FOUND);
          res.send(e);
        });
    },
  },

  {
    method: "get",
    route: "/projects/:name",
    handler: (req, res) => {
      const { name: n } = req.params;
      const name = n.replace("+", " ");
      console.debug("projects load", name);

      if (!name) {
        res.status(StatusCodes.BAD_REQUEST);
        res.send(
          "Missing or empty :name parameter. use /projects/a+proper+name"
        );
      }
      projectStorage()
        .load(`${name}.json`)
        .then((data) => {
          console.debug("projects load", name, data);
          return res.send(data);
        })
        .catch((e) => {
          console.error("projects load", name, e);
          res.status(StatusCodes.NOT_FOUND);
          res.send(e);
        });
    },
  },

  {
    method: "post",
    route: "/projects/:name",
    handler: (req, res) => {
      const {
        params: { name: n },
        body,
      } = req;
      const name = n.replace("+", " ");
      console.debug("projects save", name, JSON.stringify(body));

      if (!name) {
        res.status(StatusCodes.BAD_REQUEST);
        res.send(
          "Missing or empty :name parameter. use /projects/a+proper+name"
        );
      }
      projectStorage()
        .save(`${name}.json`, body)
        .then(() => {
          console.debug("projects saved", name);
          return res.sendStatus(StatusCodes.OK);
        })
        .catch((e) => {
          console.error("projects save", name, e);
          res.status(StatusCodes.METHOD_FAILURE);
          res.send(e);
        });
    },
  },
];
