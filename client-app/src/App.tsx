import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.css";
import { socket, SocketContext } from "./Providers/SocketContext";
import { store } from "./models/store";
import { Provider } from "react-redux";
import { getPersistor } from "@rematch/persist";
import { PersistGate } from "redux-persist/lib/integration/react";
import { Document } from "./components/designBoard/Document";
import { row } from "./components/layoutStyles";

const persistor = getPersistor();

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <PersistGate persistor={persistor} loading={"loading..."}>
          <SocketContext.Provider value={socket}>
            <div className="App-content" style={row("flex-end", "stretch")}>
              <Document />
              {/*<Chat />*/}
            </div>
          </SocketContext.Provider>
        </PersistGate>
      </Provider>
    </div>
  );
}

export default App;
