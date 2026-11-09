import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/anton/index.css';
import '@fontsource-variable/hanken-grotesk/index.css';
import '@fontsource-variable/jetbrains-mono/index.css';
import './styles.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
