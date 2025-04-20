import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const ViewCleanerService: React.FC = () => {
    const sessionUser = localStorage.getItem('sessionUser') || 'defaultUser';
    const [users, setUsers] = useState<string[]>([]); // Change to string[] since data is an array of usernames
    const [error, setError] = useState<string>('');
    const [search, setSearch] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true); // NEW: for loading spinner

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/api/user-accounts/cleaners', {
                    withCredentials: true,
                });

                // Since the response is an array of strings (usernames), we can set it directly
                const data: string[] = response.data;
                console.log(data); // Log data to inspect the structure
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

    // Adjusted the filtering logic
    const filteredUsers = users.filter(user =>
        (user.toLowerCase().includes(search.toLowerCase()) || false) // Safe check for undefined
    );


    return (
        <div className="user-account-page">
            {/* Navbar */}
            <div className="header_container">
                <h2><Link to="/">Home</Link></h2>
                <h2><Link to="/">Services</Link></h2>
                <h2><Link to="/">My Bookings</Link></h2>
                <h2><Link to="/">My Shortlist</Link></h2>
                <h2 id="logout_button"><Link to="/login">{sessionUser}/Logout</Link></h2>
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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{user}</td>
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
                                    <td colSpan={3}>No users found</td>
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
