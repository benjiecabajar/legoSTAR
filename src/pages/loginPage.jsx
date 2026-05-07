import { useState } from 'react'
import '../styles/loginPage.css'
import logo from '../assets/LegoStar-LOGO.png'

function LoginPage({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Simple authentication logic (replace with real auth)
    if (formData.username && formData.password) {
      onLogin()
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={logo} alt="PastryStar POS Logo" className="login-logo" />
          <h1 className="login-title">PastryStar POS</h1>
          <p className="login-subtitle">Point of Sales System</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              className="form-input"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" className="login-button">
            Sign In
          </button>
        </form>

        <div className="login-footer">
          <p className="login-footer-text">
            © 2026 PastryStar POS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}

export default LoginPage