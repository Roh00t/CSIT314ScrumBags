import React, { useState, useEffect } from 'react';
import './CleanerViewServices.css';
import { Link } from 'react-router-dom';

interface UserAccountResponse{
  id: number
  username: string
  userProfile: string
}

interface Service {
  id: number;
  type: string;
  price: number;
  status: 'Active' | 'Deactivate';
}

const CleanerViewServicesRoute: React.FC = () => {
  const sessionUser: UserAccountResponse = JSON.parse(localStorage.getItem('sessionUser') || '{}');


  const [services, setServices] = useState<Service[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/services/${sessionUser.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }

        const data = await response.json();

        // Adjust field names if needed based on your backend structure
        const formatted: Service[] = data.map((item: any) => ({
          id: item.id,
          type: item.service || item.type, // depending on backend
          price: item.price,
          status: item.status === true || item.status === 'Active' ? 'Active' : 'Deactivate',
        }));

        setServices(formatted);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, [sessionUser.id]);


  return (
    <div className="dashboard-container">
      <div className="header_container">
        <h2><Link to="/cleaner-dashboard">Home</Link></h2>
        <h2><Link to="/cleaner-view-services">View My Services</Link></h2>
        <h2 id="logout_button"><Link to="/login">{sessionUser.id}/Logout</Link></h2>
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
              {services.map(service => (
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
