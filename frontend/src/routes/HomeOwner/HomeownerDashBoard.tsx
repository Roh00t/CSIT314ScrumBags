import React, { useState } from 'react'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'
import LogoutModal from '../../components/LogoutModal'

// Define the type for the response data


const HomeownerDashBoard: React.FC = () => {
  const sessionUser = localStorage.getItem('sessionUser') || 'defaultUser'

  // Logout Modal State
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  return (
    <div className="page-container">
      <div className="header-container">
        <div>
          <img src={logo} alt="Logo" height={40} />
          <h2><Link to="/homeowner-dashboard">Home</Link></h2>
          <h2><Link to="/ViewCleanerService">View All Cleaners</Link></h2>
          <h2><Link to="/ViewServiceHistory">My History</Link></h2>
          <h2><Link to="/ViewShortlist">My Shortlist</Link></h2>
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
        <h1>Welcome, {sessionUser} !!</h1>
      </div>

      <div className="footer-container">
        <b>© Copyright 2025 Easy & Breezy - All Rights Reserved</b>
      </div>
    </div>
  )
}

export default HomeownerDashBoard
