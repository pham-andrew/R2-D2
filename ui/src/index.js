import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./styles/index.css";
import { BrowserRouter as Router } from "react-router-dom";
import Classification from "./components/helpers/Classification";

ReactDOM.render(
  <>
    <Router>
      <footer>
        <Classification />
      </footer>
      <body>
        <App />
      </body>
      <footer
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      >
        <Classification />
      </footer>
    </Router>
  </>,
  document.getElementById("root")
);
