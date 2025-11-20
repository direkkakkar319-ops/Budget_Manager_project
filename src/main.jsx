import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './context/AuthContext.jsx'

const root = document.getElementById('root')
createRoot(root).render(
  <AuthProvider>
    <App />
  </AuthProvider>
)