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
  const [users, setUsers] = useState<UserAccountResponse[]>([]);  // State to store user data
  const [error, setError] = useState<string>('');  // State to store any errors
  const [search, setSearch] = useState<string>('');  // State to store the search query

  // Fetch users from the backend API on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // Make the request to your backend endpoint
        const response = await axios.get('http://localhost:3000/api/user-accounts', {
          withCredentials: true, // If you're using cookies or sessions
        });

        // Get the data from the response and update state
        const data: UserAccountResponse[] = response.data;
        console.log(data);
        
        if (Array.isArray(data)) {
          // Filter the users to only get cleaners (role: 1)
          const cleaners = data.filter(user => user.userProfile === "cleaner");  // Assuming role 1 is for cleaner
          setUsers(cleaners);  // Set the filtered users into the state
        } else {
          console.error('Unexpected server response:', data);
          setError('Unexpected server response.');
        }
      } catch (err) {
        console.error('Failed to fetch users:', err);
        setError('Could not load users. Please try again later.');
      }
    };

    fetchUsers();  // Call the function to fetch users
  }, []);  // Empty dependency array means the effect will run only once

  // Filter users based on the search query
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
        
        {/* Display error message if there's an error */}
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

        {/* User Table */}
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
      </div>

      {/* Footer */}
      <div className="footer"><b>© Copyright 2025 Easy & Breezy - All Rights Reserved</b></div>
    </div>
  );
};

export default ViewCleanerService;
