
import '../css/PlatformManagerDashboard.css';
import { Link } from 'react-router-dom';


const PlatformManagerDashboard: React.FC = () => {
  const sessionUser = localStorage.getItem('sessionUser') || 'defaultUser';
  const sessionRole = localStorage.getItem('sessionRole') || 'defaultRole';

  return (
    <div className="user-account-page">
      {/* Navbar */}
      <div className="header_container">
        <h2><Link to="/platformManager-dashboard">Home</Link></h2>
        <h2><Link to="/ViewServiceCategories">Service Categorizes</Link></h2>
        <h2><Link to="/">Report</Link></h2>
        <h2 id="logout_button"><Link to="/">{sessionUser}/Logout</Link></h2>
      </div>

      <h2>Welcome back, {sessionRole}!!</h2>

      {/* Footer */}
      <div className="footer">
        <b>© Copyright 2025 Easy & Breezy - All Rights Reserved</b>
      </div>
    </div>
  );
};

export default PlatformManagerDashboard;
