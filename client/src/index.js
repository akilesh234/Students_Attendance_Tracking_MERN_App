import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css'; // Basic styling (optional)
import App from './App';
import { AuthProvider } from './contexts/AuthContext'; // Import AuthProvider
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* Wrap App with AuthProvider */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);