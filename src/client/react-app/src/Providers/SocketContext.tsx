import React, {useContext} from "react";
import * as io from "socket.io-client";

export const socket = io.connect();
export const SocketContext = React.createContext(socket);

export const useSocket = () => useContext(SocketContext);
