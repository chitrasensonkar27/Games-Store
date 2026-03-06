import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    
    {/* Professional Top-Middle Toasts */}
    <Toaster 
      position="top-center"
      richColors
      closeButton
      toastOptions={{
        duration: 3500,
        style: {
          padding: '16px 24px',
          borderRadius: '14px',
          fontSize: '15px',
          boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
          background: '#ffffff',
          color: '#0f172a',
          border: '1px solid #e2e8f0',
        },
        success: {
          style: { borderLeft: '5px solid #10b981' },
        },
        error: {
          style: { borderLeft: '5px solid #ef4444' },
        },
      }}
    />
  </React.StrictMode>
)