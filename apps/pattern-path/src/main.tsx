import React from "react";
import ReactDOM from "react-dom/client";
import { Global, css } from "@emotion/react";
import App from "./App";
import { SoundProvider } from "@emoji-minis/kit";
import "@emoji-minis/kit";

const globalStyles = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100vh;
    font-family: var(--emoji-font-family);
    background: radial-gradient(circle at top, #fff4e7, #fdebd7 45%, #f9d7bd);
  }

  #root {
    min-height: 100vh;
  }
`;

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Global styles={globalStyles} />
    <SoundProvider>
      <App />
    </SoundProvider>
  </React.StrictMode>,
);
