import React from 'react';
import ReactDOM from 'react-dom/client';
import { Global, css } from '@emotion/react';
import App from './App';
import '@emoji-minis/kit';

const globalStyles = css`
  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100vh;
    font-family: var(--emoji-font-family);
    background: radial-gradient(circle at top, #fef3f0, #e4f0ff 60%, #d8eafd);
  }

  #root {
    min-height: 100vh;
  }
`;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Global styles={globalStyles} />
    <App />
  </React.StrictMode>
);
