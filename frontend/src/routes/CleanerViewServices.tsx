import React, { useState, useEffect } from 'react';
import './CleanerViewServices.css';
import { Link } from 'react-router-dom';

interface Service {
  id: number;
  type: string;
  price: number;
  status: 'Active' | 'Deactivate';
}

const CleanerViewServicesRoute: React.FC = () => {
  const sessionUser = localStorage.getItem('sessionUser') || 'Cleaner 1';
  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    // Replace this with real API call
    setServices([
      { id: 1, type: 'Floor Cleaning', price: 20, status: 'Active' },
      { id: 2, type: 'Fan Cleaning', price: 20, status: 'Active' },
      { id: 3, type: 'Window Cleaning', price: 20, status: 'Active' },
      { id: 4, type: 'Toilet Cleaning', price: 20, status: 'Active' },
      { id: 5, type: 'Garage Cleaning', price: 20, status: 'Deactivate' },
    ]);
  }, []);

  const filteredServices = services.filter(service =>
    service.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard-container">
      <div className="header_container">
        <h2><Link to="/cleaner-dashboard">Home</Link></h2>
        <h2><Link to="/cleaner-view-services">View My Services</Link></h2>
        <h2 id="logout_button"><Link to="/login">{sessionUser}/Logout</Link></h2>
      </div>
<div className="content-center">
      <div className="card">
        <h1>View Services</h1>

        <div className="top-bar">
          <input
            type="text"
            placeholder="🔍 Search...."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button className="create-btn">Create New Services</button>
        </div>

        <table>
          <thead>
            <tr>
              <th><b>Type of Service</b></th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredServices.map(service => (
              <tr key={service.id}>
                <td>{service.type}</td>
                <td>${service.price}</td>
                <td className={service.status === 'Active' ? 'status-active' : 'status-inactive'}>
                  {service.status}
                </td>
                <td><button className="edit-btn">Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>

      <footer className="footer">
        © Copyright 2025 Easy & Breezy - All Rights Reserved
      </footer>
    </div>
  );
};

export default CleanerViewServicesRoute;