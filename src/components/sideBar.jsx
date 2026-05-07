import '../styles/sidebar.css'
import logo from '../assets/LegoStar-LOGO.png'
import { LayoutGrid, Package, BarChart3, ClipboardList, Users, LogOut } from 'lucide-react'

function Sidebar({ onLogout, setView, currentView }) {
  const handleNavClick = (e, view) => {
    e.preventDefault();
    if (setView) setView(view);
  }

  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <img src={logo} alt="PastryStar POS Logo" className="sidebar-logo" />

        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Main</h3>
          <ul className="sidebar-menu">
            <li>
              <a href="#pos" onClick={(e) => handleNavClick(e, 'pos')} className={`sidebar-link ${currentView === 'pos' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <LayoutGrid size={18} />
                <span>Point of Sale</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Inventory</h3>
          <ul className="sidebar-menu">
            <li>
              <a href="#inventory" onClick={(e) => handleNavClick(e, 'inventory')} className={`sidebar-link ${currentView === 'inventory' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Package size={18} />
                <span>Products</span>
              </a>
            </li>
          </ul>
        </div>

        <div className="sidebar-section">
          <h3 className="sidebar-section-title">Reports</h3>
          <ul className="sidebar-menu">
            <li>
              <a href="#sales" onClick={(e) => handleNavClick(e, 'sales')} className={`sidebar-link ${currentView === 'sales' ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <BarChart3 size={18} />
                <span>Sales Report</span>
              </a>
            </li>
            <li><a href="#inventory-report" className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><ClipboardList size={18} /> <span>Inventory Report</span></a></li>
            <li><a href="#customer-report" className="sidebar-link" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Users size={18} /> <span>Customer Report</span></a></li>
          </ul>
        </div>

        <div className="sidebar-logout">
          <button onClick={onLogout} className="sidebar-logout-button" style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </nav>
    </aside>
  )
}

export default Sidebar
