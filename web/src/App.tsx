import React from "react";
import { Router } from "react-router";
import "./App.css";

import ReactNotification from "react-notifications-component";
import Routes from "./routes/routes";
import history from "./services/history";
import AppProvider from "./Context";

import "react-notifications-component/dist/theme.css";

function App() {
  return (
    <Router history={history}>
      <ReactNotification />
      <AppProvider>
        <Routes />
      </AppProvider>
    </Router>
  );
}

export default App;
