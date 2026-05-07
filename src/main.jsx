import { StrictMode, useState } from 'react'
import { createRoot } from 'react-dom/client'
import LoginPage from './pages/loginPage.jsx'
import MainPage from './pages/mainPage.jsx'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <>
      {isLoggedIn ? <MainPage onLogout={handleLogout} /> : <LoginPage onLogin={handleLogin} />}
    </>
  )
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
