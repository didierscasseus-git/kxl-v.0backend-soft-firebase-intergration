import './types';
import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

import { ThemeModeProvider } from './context/ThemeModeContext';

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Could not find root element");

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ThemeProvider>
        <ThemeModeProvider>
          <App />
        </ThemeModeProvider>
      </ThemeProvider>
    </AuthProvider>
  </React.StrictMode>
);
