import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/AdminDashboardRoute.css'
import { Link } from 'react-router-dom'
// Define the type for the response data
interface UserAccountResponse {
  id: number | null;
  username: string;
  userProfile: string;
  isSuspended: boolean;
}

const AdminDashboard: React.FC = () => {
  const sessionUser = localStorage.getItem('sessionUser') || 'defaultUser';
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
        console.log(data)
        
        if (Array.isArray(data)) {
          setUsers(data);  // Set the fetched users into the state
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
        <h2><Link to="/admin-dashboard">Home</Link></h2>
        <h2><Link to="/">User Account</Link></h2>
        <h2><Link to="/ViewUserProfile">User Profile</Link></h2>
        <h2 id="logout_button"><Link to="/login">{sessionUser}/Logout</Link></h2>
      </div>

      {/* User Accounts Section */}
      <div className="account-container">
        <h2>User Accounts</h2>
        <div className="top-row">
          <input
            type="text"
            className="search-bar"
            placeholder="Search by username"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="create-btn"><Link to="/create" className="create-btn">Create Account</Link></button>
        </div>

        {/* Display error message if any */}
        {error && <div className="error-message">{error}</div>}

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
                      <button className="view-btn"><Link to="/">View</Link></button>
                      <button
                      className="edit-btn"
                      onClick={() => {
                        setEditingUser({
                          id: user.id,
                          username: user.username,
                          role: user.userProfile || '',
                          password: '',
                          confirmPassword: ''
                        });
                        setShowEditModal(true);
                      }}
                    >
                      Edit
                    </button>
                      <button className="delete-btn"><Link to="/">Delete</Link></button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5}>No users available.</td>
              </tr>
            )}
          </tbody>
        </table>
        {showEditModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Update User Account</h2>

            <label>Update As:</label>
            <select
              value={editingUser.role}
              onChange={e => setEditingUser({ ...editingUser, role: e.target.value })}
            >
              <option value="">Select Role</option>
              <option value="cleaner">Cleaner</option>
              <option value="homeowner">Homeowner</option>
              <option value="platform manager">Platform Manager</option>
              <option value="user admin">User Admin</option>
            </select>

            <label>Username:</label>
            <input
              type="text"
              value={editingUser.username}
              onChange={e => setEditingUser({ ...editingUser, username: e.target.value })}
            />

            <label>Password:</label>
            <input
              type="password"
              value={editingUser.password}
              onChange={e => setEditingUser({ ...editingUser, password: e.target.value })}
            />

            <label>Confirm Password:</label>
            <input
              type="password"
              value={editingUser.confirmPassword}
              onChange={e => setEditingUser({ ...editingUser, confirmPassword: e.target.value })}
            />

            <div className="modal-btn-group">
              <button className="cancel-btn" onClick={() => setShowEditModal(false)}>Cancel</button>
              <button
                className="submit-btn"
                onClick={async () => {
                  if (editingUser.password !== editingUser.confirmPassword) {
                    alert("Passwords do not match!");
                    return;
                  }
                
                  try {
                    const response = await axios.post(
                      `http://localhost:3000/api/user-accounts/update`,
                      {
                        userId: editingUser.id,
                        updatedAs: editingUser.role,
                        updatedUsername: editingUser.username,
                        updatedPassword: editingUser.password,
                      },
                      { withCredentials: true }
                    );
                
                    console.log('User updated:', response.data);
                    alert('User updated successfully');
                
                    // 👇 Re-fetch user list
                    const refreshed = await axios.get('http://localhost:3000/api/user-accounts', {
                      withCredentials: true,
                    });
                
                    setUsers(refreshed.data);
                    setShowEditModal(false);
                  } catch (error) {
                    console.error('Failed to update user:', error);
                    alert('Failed to update user. Please try again.');
                  }
                }}
              >
                Update Account
              </button>
            </div>
          </div>
        </div>
      )}
      </div>

      {/* Footer */}
      <div className="footer"><b>© Copyright 2025 Easy & Breezy - All Rights Reserved</b></div>
    </div>
  );
};

export default AdminDashboard;
