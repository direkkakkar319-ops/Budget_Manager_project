import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout.jsx'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}> 
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App