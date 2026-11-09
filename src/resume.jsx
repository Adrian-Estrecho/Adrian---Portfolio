import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './resume.css';
import Resume from './components/Resume.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Resume />
  </StrictMode>,
);
