import { useState } from 'react'
import './App.css'
import { AppRoutes } from './Routes'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  return (
    <div className="app">
      <AppRoutes 
        isLoggedIn={isLoggedIn} 
        onLogout={handleLogout}
        onLogin={handleLogin}
      />
    </div>
  )
}

export default App
