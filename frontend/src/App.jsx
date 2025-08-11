import { useState } from 'react'
import './App.css'
import Header from './components/Header'
import { AppRoutes } from './Routes'

function App() {
  return (
    <div className="app">
      <AppRoutes />
    </div>
  )
}

export default App
