import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/PlatformManagerDashboard.css';
import { Link } from 'react-router-dom';

// Updated interface to match the actual response structure
interface ServicesResponse {
  id: number;
  category: string;
  label: string;
}

const PlatformManagerDashboard: React.FC = () => {
  const sessionUser = localStorage.getItem('sessionUser') || 'defaultUser';
  const sessionRole = localStorage.getItem('sessionRole') || 'defaultRole';
  const [services, setServices] = useState<ServicesResponse[]>([]);
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/services/', {
          withCredentials: true,
        });

        const data: ServicesResponse[] = response.data;
        console.log(data);

        if (Array.isArray(data)) {
          setServices(data);
        } else {
          console.error('Unexpected server response:', data);
          setError('Unexpected server response.');
        }
      } catch (err) {
        console.error('Failed to fetch services:', err);
        setError('Could not load services. Please try again later.');
      }
    };

    fetchServices();
  }, []);

  // Adjusted filtering logic to match the new field names
  const filteredServices = services.filter((service) =>
    service.category?.toLowerCase().includes(search.toLowerCase()) ||
    service.label?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="user-account-page">
      {/* Navbar */}
      <div className="header_container">
        <h2><Link to="/">Home</Link></h2>
        <h2><Link to="/">Service Categorizes</Link></h2>
        <h2><Link to="/">Report</Link></h2>
        <h2 id="logout_button">{sessionUser}/Logout</h2>
      </div>

      <h2>Welcome back, {sessionRole}!!</h2>
      {/* Services Section */}
      <div className="account-container">
        <h2>List of Service Categories</h2>
        <div className="top-row">
          <input
            type="text"
            className="search-bar"
            placeholder="Search by service name or category"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="create-btn">Create New Category</button>
        </div>

        {/* Services Table */}
        <table className="user-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Service Name</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <tr key={service.id}>
                  <td>{service.category}</td>
                  <td>{service.label}</td> {/* Display the correct field */}
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn">Edit</button>
                      <button className="delete-btn">Delete</button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No services available.</td>
              </tr>
            )}
          </tbody>
        </table>

        {error && <div className="error-message">{error}</div>}
      </div>

      {/* Footer */}
      <div className="footer">
        <b>© Copyright 2025 Easy & Breezy - All Rights Reserved</b>
      </div>
    </div>
  );
};

export default PlatformManagerDashboard;
