import React from 'react';
import ReactDOM from 'react-dom/client';
import { Global, css } from '@emotion/react';
import App from './App';
import '@emoji-minis/kit';

const globalStyles = css`
  :root {
    --em-card-back-bg: #c7d2fe;
    --em-card-back-fg: #4338ca;
    --em-card-front-bg: #e0e7ff;
    --em-card-front-fg: #1f2933;
    --em-card-match-bg: #34d399;
    --em-card-match-fg: #064e3b;
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100vh;
    font-family: var(--emoji-font-family);
    background: linear-gradient(160deg, #f0f4ff 0%, #fdf3f0 100%);
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
