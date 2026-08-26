import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { initGA4 } from './lib/gtag.ts';
import ErrorBoundary from './components/Common/ErrorBoundary.tsx';
import { ThemeProvider } from './context/ThemeContext.tsx';

initGA4();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary fallbackTitle="CRIBR Platform Encountered an Issue" fallbackMessage="An unexpected error occurred. Please refresh your browser or return to the homepage.">
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </ErrorBoundary>
  </StrictMode>,
);
