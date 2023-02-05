import React, {useContext} from "react";
import * as io from "socket.io-client";

export const socket = io.connect("ws://127.0.0.1:8080", {
  extraHeaders: {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "X-Requested-With",
  },
});
export const SocketContext = React.createContext(socket);

export const useSocket = () => useContext(SocketContext);
