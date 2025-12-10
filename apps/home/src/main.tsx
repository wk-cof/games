import React from 'react';
import ReactDOM from 'react-dom/client';
import { Global, css } from '@emotion/react';
import App from './App';
import { SoundProvider } from '@emoji-minis/kit';
import '@emoji-minis/kit';
import './index.css';


const globalStyles = css`
  :root {
    font-family: var(--emoji-font-family);
  }

  *, *::before, *::after {
    box-sizing: border-box;
  }

  body {
    margin: 0;
    min-height: 100vh;
    background: radial-gradient(circle at top, #fdf1ff, #eef7ff 55%, #e5f5ff);
  }

  #root {
    min-height: 100vh;
  }
`;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Global styles={globalStyles} />
    <SoundProvider>
      <App />
    </SoundProvider>
  </React.StrictMode>
);
