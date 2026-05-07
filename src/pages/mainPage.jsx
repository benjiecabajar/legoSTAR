import { useState } from 'react'
import '../styles/mainPage.css'
import Sidebar from '../components/sideBar'

function App({ onLogout }) {
  return (
    <div className="app-container">
      <Sidebar onLogout={onLogout} />
      <main className="main-content">
      </main>
    </div>
  )
}
export default App

