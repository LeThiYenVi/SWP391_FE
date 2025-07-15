
import { Buffer } from 'buffer';

// Polyfill cho SockJS và WebSocket
if (typeof global === 'undefined') {
  window.global = window;
}

if (typeof window.Buffer === 'undefined') {
  window.Buffer = Buffer;
}

import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/globals.css';
import './index.css';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Bọc App trong GoogleOAuthProvider
createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="420621561906-mnr3i6fpt0utd6867v78806t0kd8i464.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
);
