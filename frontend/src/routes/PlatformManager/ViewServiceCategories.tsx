import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LogoutModal from '../../components/LogoutModal';
import logo from '../../assets/logo.png';

interface ServicesResponse {
  id: number;
  label: string;
}

const ViewServiceCategories: React.FC = () => {
  const sessionUser = localStorage.getItem('sessionUser') || 'defaultUser';
  const [services, setServices] = useState<ServicesResponse[]>([]);
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // For Delete Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedService, setSelectedService] = useState<ServicesResponse | null>(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/services/categories', {
          withCredentials: true,
        });
  
        // backend returns ["Home", "Office", ...] → wrap into { label }
        const data = response.data.map((label: string, index: number) => ({
          id: index + 1,   // assign fake ID if you need it
          label: label,
        }));
  
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

  const filteredServices = services.filter((service) =>
    service.label?.toLowerCase().includes(search.toLowerCase())
  );

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

      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />

      {/* Delete Modal */}
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
          />
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
            {filteredServices.length > 0 ? (
              filteredServices.map((service) => (
                <tr key={service.id}>
                  <td>{service.label}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="edit-btn">Edit</button>
                      <button
                      className="delete-btn"
                      onClick={() => {
                        setSelectedService(service); // service includes {id, label}
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