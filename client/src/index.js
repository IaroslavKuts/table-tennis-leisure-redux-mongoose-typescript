import React from "react";
import ReactDOM from "react-dom";

import "./index.css";
import { App } from "./app";
import { BrowserRouter } from "react-router-dom";
import { persistor, store } from "./app/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

// </ContextProvider>
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <PersistGate loading={null} persistor={persistor}>
        <div className="app">
          <App />
        </div>
      </PersistGate>
    </BrowserRouter>
  </Provider>,
  document.getElementById("root")
);
