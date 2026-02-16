import React from "react";
import ReactDOM from "react-dom/client";
import { Global, css } from "@emotion/react";
import { SoundProvider } from "@emoji-minis/kit";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Global
      styles={css`
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        body {
          font-family: "Inter", system-ui, sans-serif;
          background-color: #f0f2f5;
        }
      `}
    />
    <SoundProvider>
      <App />
    </SoundProvider>
  </React.StrictMode>,
);
