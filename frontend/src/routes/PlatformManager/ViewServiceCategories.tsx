import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LogoutModal from '../../components/LogoutModal';
import logo from '../../assets/logo.png';

// Updated interface to match the actual response structure
interface ServicesResponse {
  id: number;
  category: string;
  label: string;
}

// interface newServiceCategory {
//   serviceName: string;
// }

const ViewServiceCategories: React.FC = () => {
  const sessionUser = localStorage.getItem('sessionUser') || 'defaultUser';
  const [services, setServices] = useState<string[]>([]);  // Change to array of strings
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  // Logout Modal State
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
    // For Delete Modal
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedService, setSelectedService] = useState<ServicesResponse | null>(null);
  const [newServiceCategory, setNewServiceCategory] = useState<{ serviceName: string }>({
    serviceName: ''
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/Services/categories', {
          withCredentials: true,
        });

        const data: string[] = response.data;  // Change to array of strings
        console.log("Fetched services:", data);

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
  // 🛑 Delete function
  const handleDelete = async () => {
    if (!selectedService) return;
    try {
      await axios.delete(`http://localhost:3000/api/platform-manager/categories/${selectedService.label}`, {
        withCredentials: true,
      });
      alert(`Service category '${selectedService.label}' deleted successfully.`);
      setServices(services.filter(service => service.id !== selectedService.id));
      setShowDeleteModal(false);
    } catch (err) {
      console.error('Failed to delete service category:', err);
      alert('Failed to delete service category.');
    }
  };

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (search.trim() === '') {
        // If search is empty, fetch all categories
        try {
          const response = await axios.get('http://localhost:3000/api/services/categories', {
            withCredentials: true,
          });
          setServices(response.data);
          setError('');
        } catch (err) {
          console.error('Failed to reload categories:', err);
          setError('Could not reload service categories.');
        }
        return;
      }
  
      try {
        const response = await axios.get(`http://localhost:3000/api/services/categories/search?search=${search}`, {
          withCredentials: true,
        });
  
        // API returns a string (not array), so wrap it in an array
        setServices([response.data]);
        setError('');
      } catch (err) {
        console.error('Search failed:', err);
        setServices([]);  // Clear table
        setError('Search failed. Try again.');
      }
    }
  };


  return (
    <div className="user-account-page">
      {/* Navbar */}
      <div className="header_container">
        <img src={logo} alt="Logo" height={40} />
        <h2><Link to="/platformManager-dashboard">Home</Link></h2>
        <h2><Link to="/ViewServiceCategories">Service Categories</Link></h2>
        <h2><Link to="/platformManager-view-report">Report</Link></h2>
        <h2 id="logout_button" onClick={() => setShowLogoutModal(true)} style={{ cursor: 'pointer' }}>
          <span style={{ marginRight: '8px' }}>👤</span>{sessionUser}/Logout
        </h2>
      </div>
      {/* Logout Modal */}
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />

      {/* Modal for creating new category */}
      {showPopup && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Create New Service Category</h2>
            <label>Category Name:</label>
            <input
              id="categoryInput"
              type="text"
              placeholder="e.g. Floor cleaning"
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
                  window.location.reload(); // Or re-fetch services instead of reloading
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
      {/* 🛑 Delete Modal */}
      {showDeleteModal && selectedService && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Are you sure you want to delete "{selectedService.label}"?</h2>
            <div className="modal-buttons">
              <button onClick={() => setShowDeleteModal(false)}>Cancel</button>
              <button onClick={handleDelete} className="delete-btn">Save Changes</button>
            </div>
          </div>
        </div>
      )}
      {/* Services Section */}
      <div className="account-container">
        <h2>List of Service Categories</h2>
        <div className="top-row">
        <input
          type="text"
          className="search-bar"
          placeholder="Search by category name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
        />
          <button className="create-btn" onClick={() => setShowPopup(true)}>Create New Category</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <table className="user-table">
          <thead>
            <tr>
              <th>Category</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {services.length > 0 ? (
            services.map((service, index) => (
                <tr key={index}>
                  <td>{service}</td>  {/* Displaying category directly */}
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn">Edit</button>
                      <button
                        className="delete-btn"
                        onClick={() => {
                          setSelectedService(service);
                          setShowDeleteModal(true);
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2}>No services available.</td>
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

export default ViewServiceCategories;
