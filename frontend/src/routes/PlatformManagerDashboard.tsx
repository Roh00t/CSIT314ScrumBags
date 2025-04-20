import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../css/PlatformManagerDashboard.css';
import { Link } from 'react-router-dom';

// Define the type for the service data
interface ServicesResponse {
  id: number;
  Category: string;
  serviceName: string;
}

const PlatformManagerDashboard: React.FC = () => {
  const sessionUser = localStorage.getItem('sessionUser') || 'defaultUser';
  const [services, setServices] = useState<ServicesResponse[]>([]);
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user-services', {
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

  // Filter services based on the search query
  const filteredServices = services.filter(service =>
    service.serviceName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="user-account-page">
      {/* Navbar */}
      <div className="header_container">
        <h2><Link to="/">Home</Link></h2>
        <h2><Link to="/">My Services</Link></h2>
        <h2><Link to="/">My Bookings</Link></h2>
        <h2 id="logout_button">{sessionUser}/Logout</h2>
      </div>

      {/* Services Section */}
      <div className="account-container">
        <h2>My Services</h2>
        <div className="top-row">
          <input
            type="text"
            className="search-bar"
            placeholder="Search by service name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button className="create-btn">Create New Category</button>
        </div>

        {/* Services Table */}
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Category</th>
              <th>Services</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <tr key={service.id}>
                  <td>{service.id}</td>
                  <td>{service.serviceName}</td>
                  <td>${service.Category}</td>
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
                <td colSpan={4}>No services available.</td>
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

export default PlatformManagerDashboard;
