import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ViewUserProfile.css';
import { Link } from 'react-router-dom';

const ViewUserRoles: React.FC = () => {
  const sessionUser = localStorage.getItem('sessionUser') || 'defaultUser';
  const [roles, setRoles] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState<string>(''); // Search state

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user-profiles/', {
          withCredentials: true,
        });

        const data: string[] = response.data;
        if (Array.isArray(data)) {
          setRoles(data);
        } else {
          console.error('Unexpected server response:', data);
          setError('Unexpected server response.');
        }
      } catch (err) {
        console.error('Failed to fetch roles:', err);
        setError('Could not load roles. Please try again later.');
      }
    };

    fetchRoles();
  }, []);

  // Filter roles based on search
  const filteredRoles = roles.filter(role =>
    role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="user-account-page">
      {/* Navbar */}
      <div className="header_container">
        <h2><Link to="/">Home</Link></h2>
        <h2><Link to="/">User Account</Link></h2>
        <h2><Link to="/">User Profile</Link></h2>
        <h2 id="logout_button">{sessionUser}/Logout</h2>
      </div>

      {/* Roles Section */}
      <div className="account-container">
        <h2>User Roles</h2>
        <input
          type="text"
          className="search-bar"
          placeholder="Search by role name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {error && <p className="error-message">{error}</p>}
        <table className="user-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Role Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRoles.length > 0 ? (
              filteredRoles.map((role, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{role}</td>
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
                <td colSpan={3}>No roles available.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="footer">
        <b>© Copyright 2025 Easy & Breezy - All Rights Reserved</b>
      </div>
    </div>
  );
};

export default ViewUserRoles;
