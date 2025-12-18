import React from "react";
import ReactDOM from "react-dom/client";
import App from "./components/App/App";
import "./styles/globals.css";
import "modern-normalize/modern-normalize.css";
import "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
