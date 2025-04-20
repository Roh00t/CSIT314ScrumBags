import React, { useEffect, useState } from 'react';
import axios from 'axios';
// import '../css/ViewServiceCategories.css';
import { Link } from 'react-router-dom';

// Updated interface to match the actual response structure
interface ServicesResponse {
  id: number;
  category: string;
  label: string;
}

interface newServiceCategory {
  serviceName: string;
}

const ViewServiceCategories: React.FC = () => {
  const sessionUser = localStorage.getItem('sessionUser') || 'defaultUser';
  const sessionRole = localStorage.getItem('sessionRole') || 'defaultRole';
  const [services, setServices] = useState<ServicesResponse[]>([]);
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState<string>('');

  const [showPopup, setShowPopup] = useState(false);
  const [newServiceCategory, setNewServiceCategory] = useState<newServiceCategory>({
    serviceName: ''
  });

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
      <h2><Link to="/platformManager-dashboard">Home</Link></h2>
        <h2><Link to="/ViewServiceCategories">Service Categorizes</Link></h2>
        <h2><Link to="/">Report</Link></h2>
        <h2 id="logout_button"><Link to="/">{sessionUser}/Logout</Link></h2>
      </div>

      {showPopup && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Service Category</h2>
            <label>Category Name:</label>
            <input
              id="categoryInput"
              type="string"
              placeholder="e.g Floor cleaning"
              value={newServiceCategory.serviceName}
              onChange={(e) => setNewServiceCategory({ ...newServiceCategory, serviceName: e.target.value })}
            />
            <div className="modal-buttons">
              <button onClick={() => setShowPopup(false)}>Cancel</button>
              <button onClick={async () => {
                try {
                  const response = await fetch('http://localhost:3000/api/services/categories', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      category: newServiceCategory.serviceName
                    }),
                    credentials: 'include',
                  });
      
                  if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Failed to create service category');
                  }
      
                  setShowPopup(false);
                  setNewServiceCategory({ serviceName: '' });
                  window.location.reload(); // or re-fetch services
                } catch (error) {
                  console.error('Error creating service category:', error);
                  alert('Failed to create service category.');
                }
              }}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}


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
          <button  className="create-btn" onClick={() => setShowPopup(true)}>Create New Category</button>
        </div>

        {/* Display error message if any */}
        {error && <div className="error-message">{error}</div>}
        
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

export default ViewServiceCategories;
