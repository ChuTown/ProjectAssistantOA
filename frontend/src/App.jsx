import { useState } from 'react'
import './App.css'
import { AppRoutes } from './Routes'
import { ThemeProvider } from './contexts/ThemeContext'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUsername('')
  }

  const handleLogin = (user) => {
    setIsLoggedIn(true)
    setUsername(user.username)
  }

  return (
    <ThemeProvider>
      <div className="app">
        <AppRoutes 
          isLoggedIn={isLoggedIn} 
          username={username}
          onLogout={handleLogout}
          onLogin={handleLogin}
        />
      </div>
    </ThemeProvider>
  )
}

export default App
