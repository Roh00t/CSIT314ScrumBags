import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LogoutModal from '../components/LogoutModal';

// Define the type for the response data
interface UserAccountResponse {
  id: number | null;
  username: string;
  userProfile: string;
  isSuspended: boolean;
}

const HomeownerDashBoard: React.FC = () => {
  const sessionUser = localStorage.getItem('sessionUser') || 'defaultUser';

  // Logout Modal State
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // For Update User Account
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState<{
    id: number | null;
    username: string;
    role: string;
    password: string;
    confirmPassword: string;
  }>({
    id: null,
    username: '',
    role: '',
    password: '',
    confirmPassword: ''
  });

  const [users, setUsers] = useState<UserAccountResponse[]>([]);
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user-accounts', {
          withCredentials: true,
        });

        const data: UserAccountResponse[] = response.data;
        console.log(data);

        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error('Unexpected server response:', data);
          setError('Unexpected server response.');
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Could not load users. Please try again later.');
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="user-account-page">
      {/* Header */}
      <div className="header_container">
        <h2><Link to="/homeowner-dashboard">Home</Link></h2>
        <h2><Link to="/">My Booking</Link></h2>
        <h2><Link to="/ViewShortlist">View Shortlist</Link></h2>
        <h2 id="logout_button" onClick={() => setShowLogoutModal(true)} style={{ cursor: 'pointer' }}>
          {sessionUser}/Logout
        </h2>
      </div>

     {/* Logout Modal */}
     <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />
<h1>Welcome, {sessionUser} !!</h1>
      {/* Footer */}
      <div className="footer">
        <b>© Copyright 2025 Easy & Breezy - All Rights Reserved</b>
      </div>
    </div>
  );
};

export default HomeownerDashBoard;
