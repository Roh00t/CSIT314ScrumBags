import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

// Define the type for the response data
interface UserAccountResponse {
  id: number;
  username: string;
  userProfile: string;
  isSuspended: boolean;  
}

const ViewCleanerService: React.FC = () => {
  const sessionUser = localStorage.getItem('sessionUser') || 'defaultUser';
  const [users, setUsers] = useState<UserAccountResponse[]>([]);
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true); // NEW: for loading spinner

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/cleaners/', {
          withCredentials: true,
        });

        const data: UserAccountResponse[] = response.data;
        console.log(data);
        setUsers(data); // Set the state with received data
        setLoading(false); // Stop loading
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Could not load users. Please try again later.');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="user-account-page">
      {/* Navbar */}
      <div className="header_container">
        <h2><Link to="/">Home</Link></h2>
        <h2><Link to="/">Services</Link></h2>
        <h2><Link to="/">My Bookings</Link></h2>
        <h2><Link to="/">My Shortlist</Link></h2>
        <h2 id="logout_button">{sessionUser}/Logout</h2>
      </div>

      {/* User Accounts Section */}
      <div className="account-container">
        <h2>Cleaners' Accounts</h2>

        {error && <div className="error-message">{error}</div>}
        
        <div className="top-row">
          <input
            type="text"
            className="search-bar"
            placeholder="Search by username"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="create-btn">Create Account</button>
        </div>

        {/* Loading Spinner */}
        {loading ? (
          <div className="loading">Loading cleaners...</div>
        ) : (
          <table className="user-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Profile</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.username}</td>
                    <td>{user.userProfile}</td>
                    <td>
                      <span
                        className={user.isSuspended ? 'status-suspended' : 'status-active'}
                      >
                        {user.isSuspended ? 'Suspended' : 'Active'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="view-btn">View</button>
                        <button className="edit-btn">Edit</button>
                        <button className="delete-btn">Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>No cleaners available.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Footer */}
      <div className="footer">
        <b>© Copyright 2025 Easy & Breezy - All Rights Reserved</b>
      </div>
    </div>
  );
};

export default ViewCleanerService;
