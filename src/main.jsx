import React from 'react'
import ReactDOM from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
import App from './App.jsx'
import './index.css'
import { ThemeProvider } from './contexts/ThemeContext'
import { LocalizationProvider } from './contexts/LocalizationContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <ThemeProvider>
        <LocalizationProvider>
          <App />
        </LocalizationProvider>
      </ThemeProvider>
    </HelmetProvider>
  </React.StrictMode>
);

// ── Cache-busting & fresh SW registration ──────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // 1. Unregister ALL existing service workers
      const registrations = await navigator.serviceWorker.getRegistrations();
      await Promise.all(registrations.map(r => r.unregister()));

      // 2. Clear ALL cache storages
      if ('caches' in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }

      // 3. Re-register the fresh SW
      await navigator.serviceWorker.register('/sw.js');
    } catch (err) {
      console.warn('SW setup error:', err);
    }
  });
}

