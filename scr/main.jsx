import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './App.jsx'
import { store } from './store.js'
import { initAuthListener } from './features/auth/authSlice.js'

// keep auth state in sync with firebase
initAuthListener(store)

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
        <App />
    </Provider>
  </React.StrictMode>,
)

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/service-worker.js')
      .then((registration) => {
        console.log('[PWA] Service worker registered', registration);
      })
      .catch((error) => {
        console.error('[PWA] Service worker registration failed', error);
      });
  });
}



