import '../styles/sidebar.css'
import logo from '../assets/LegoStar-LOGO.png'

function Sidebar({ onLogout }) {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <img src={logo} alt="LegoStar POS Logo" className="sidebar-logo" />

        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Main</h3>
          <ul className="sidebar-menu">
            <li><a href="#pos" className="sidebar-link">🛒 Point of Sale</a></li>
            <li><a href="#dashboard" className="sidebar-link">💰 Dashboard</a></li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Inventory</h3>
          <ul className="sidebar-menu">
            <li><a href="#products" className="sidebar-link">📦 Products</a></li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Reports</h3>
          <ul className="sidebar-menu">
            <li><a href="#sales-report" className="sidebar-link">📈 Sales Report</a></li>
            <li><a href="#inventory-report" className="sidebar-link">📋 Inventory Report</a></li>
            <li><a href="#customer-report" className="sidebar-link">👥 Customer Report</a></li>
          </ul>
        </div>

        <div className="sidebar-logout">
          <button onClick={onLogout} className="sidebar-logout-button">
            🚪 Logout
          </button>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
