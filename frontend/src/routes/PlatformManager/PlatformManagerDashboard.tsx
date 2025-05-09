import { Link } from 'react-router-dom'
import React, { useState } from 'react'
import LogoutModal from '../../components/LogoutModal'
import logo from '../../assets/logo.png'

const PlatformManagerDashboard: React.FC = () => {
  const sessionUser = localStorage.getItem('sessionUser') || 'defaultUser'
  const sessionRole = localStorage.getItem('sessionRole') || 'defaultRole'
  // Logout Modal State
  const [showLogoutModal, setShowLogoutModal] = useState(false)
  return (
    <div className="page-container">
      {/* Navbar */}
      <div className="header-container">
        <div>
          <img src={logo} alt="Logo" height={40} />
          <h2><Link to="/platformManager-dashboard">Home</Link></h2>
          <h2><Link to="/ViewServiceCategories">Service Categories</Link></h2>
          <h2><Link to="/platformManager-view-report">Report</Link></h2>
        </div>

        <div>
          <h2 id="logout_button" onClick={() => setShowLogoutModal(true)} style={{ cursor: 'pointer' }}>
            <span style={{ marginRight: '8px' }}>👤</span>{sessionUser}/Logout
          </h2>
        </div>
      </div>

      {/* Logout Modal */}
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
      <div className="body-container">
        <h2>Welcome back, {sessionRole}!!</h2>
      </div>

      {/* Footer */}
      <div className="footer-container">
        <b>© Copyright 2025 Easy & Breezy - All Rights Reserved</b>
      </div>
    </div>
  )
}

export default PlatformManagerDashboard
