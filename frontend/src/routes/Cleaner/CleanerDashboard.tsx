import React, { useState } from 'react'
import logo from '../../assets/logo.png'
import { Link } from 'react-router-dom'
import LogoutModal from '../../components/LogoutModal'

interface UserAccountResponse {
  id: number
  username: string
  userProfile: string
}

const CleanerDashboardRoute: React.FC = () => {
  const sessionUser: UserAccountResponse = JSON.parse(localStorage.getItem('sessionObject') || '{}')

  // Logout Modal State
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  return (
    <div className="page-container">
            <div className="header-container">
                <div>
                    <img src={logo} alt="Logo" height={40} />
                    <h2><Link to="/cleaner-dashboard">Home</Link></h2>
                    <h2><Link to="/cleaner-view-services">My Services</Link></h2>
                    <h2><Link to="/cleaner-view-bookings">My Bookings</Link></h2>
                </div>

                <div>
                    <h2 id="logout-button" onClick={() => setShowLogoutModal(true)} style={{ cursor: 'pointer' }}>
                    <span style={{ marginRight: '8px' }}>👤</span>{sessionUser.username}/Logout
                    </h2>
                </div>

                <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
            </div>

      {/* Logout Modal */}
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
      
      <div className="body-container">
        <div className="dashboard-body">
          <h2>Welcome back, {sessionUser.username}!!</h2>
        </div>
      </div>


      <footer className="footer-container">
        © Copyright 2025 Easy & Breezy - All Rights Reserved
      </footer>
    </div>
  )
}

export default CleanerDashboardRoute
