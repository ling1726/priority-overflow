import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { FluentProvider, teamsLightTheme } from "@fluentui/react-components";

ReactDOM.render(
  <FluentProvider theme={teamsLightTheme}>
    <App />
  </FluentProvider>,
  document.getElementById("root")
);
