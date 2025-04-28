import React, { useState, useEffect } from 'react';
import '../../css/Cleaner/CleanerViewMyBookings.css';
import { Link } from 'react-router-dom';
import LogoutModal from '../../components/LogoutModal';
import logo from '../../assets/logo.png';

interface UserAccountResponse {
  id: number;
  username: string;
  userProfile: string;
}

interface History {
  cleanerName: string | null;
  typeOfService: string | null;
  price: string | null;
  date: Date;
  status: string;
}

const CleanerViewMyBookings: React.FC = () => {
  const sessionUser: UserAccountResponse = JSON.parse(localStorage.getItem('sessionObject') || '{}');

  const [services, setServices] = useState<string[]>([]);
  const [serviceName, setServiceName] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [history, setHistory] = useState<History[]>([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Confirmed' | 'Cancelled'>('All');

  const formatDate = (dateString: string) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-');
    return `${month}/${day}/${year}`;
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/services/uniqueservices');
        if (!response.ok) {
          throw new Error('Failed to fetch services');
        }
        const data = await response.json();
        setServices(data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  const fetchServiceHist = async (statusFilter?: string) => {
    try {
      const response = await fetch('http://localhost:3000/api/homeowner/servicehistory', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cleanerName: search,
          service: serviceName,
          fromDate: fromDate ? formatDate(fromDate) : null,
          toDate: toDate ? formatDate(toDate) : null,
          status: statusFilter ?? null, // <<==== Add status filter into request body
        }),
      });
  
      if (!response.ok) {
        setHistory([]);
        throw new Error('Failed to fetch service history');
      }
  
      const json = await response.json();
      const formatted: History[] = json.data.map((item: any) => ({
        cleanerName: item.cleanerName,
        typeOfService: item.serviceName,
        price: item.price,
        date: item.date,
        status: item.status,
      }));
  
      setHistory(formatted);
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  useEffect(() => {
    fetchServiceHist();
  }, []);

  const filteredHistory = filterStatus === 'All'
    ? history
    : history.filter(item => item.status.toLowerCase() === filterStatus.toLowerCase());

  const countStatus = (status: 'Pending' | 'Confirmed' | 'Cancelled') =>
    history.filter(item => item.status.toLowerCase() === status.toLowerCase()).length;

  return (
    <div className="view-mybooking-container">
      <div className="header_container">
        <img src={logo} alt="Logo" height={40} />
        <h2><Link to="/cleaner-dashboard">Home</Link></h2>
        <h2><Link to="/cleaner-view-services">My Services</Link></h2>
        <h2><Link to="/cleaner-view-bookings">My Bookings</Link></h2>
        <h2 id="logout_button" onClick={() => setShowLogoutModal(true)} style={{ cursor: 'pointer' }}>
          <span style={{ marginRight: '8px' }}>👤</span>{sessionUser.username}/Logout
        </h2>
      </div>

      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />

      <div className="content-center">
        <div className="card">
          <h1>My Bookings</h1>

          {/* Status Tabs */}
          <div className="status-tabs">
            <span className={`tab ${filterStatus === 'All' ? 'active' : ''}`} onClick={() => setFilterStatus('All')}>
              All Bookings ({history.length})
            </span>
            <span className={`tab ${filterStatus === 'Pending' ? 'active' : ''}`} onClick={() => setFilterStatus('Pending')}>
              Pending ({countStatus('Pending')})
            </span>
            <span className={`tab ${filterStatus === 'Confirmed' ? 'active' : ''}`} onClick={() => setFilterStatus('Confirmed')}>
              Confirmed ({countStatus('Confirmed')})
            </span>
            <span className={`tab ${filterStatus === 'Cancelled' ? 'active' : ''}`} onClick={() => setFilterStatus('Cancelled')}>
              Cancelled ({countStatus('Cancelled')})
            </span>
          </div>

          {/* Top Bar Filters */}
          <div className="top-bar">
            <select
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
            >
              <option value="">Select Service</option>
              {services.map((service, index) => (
                <option key={index} value={service}>
                  {service}
                </option>
              ))}
            </select>

            <div className="date-range">
              <label>From:</label>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
              <label>To:</label>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>

            <input
              type="text"
              placeholder="🔍 Search...."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button onClick={() => fetchServiceHist()}>Search</button>
          </div>

          {/* Table */}
          <table>
            <thead>
              <tr>
                <th><b>ID</b></th>
                <th><b>Services</b></th>
                <th><b>Status</b></th>
                <th><b>Date</b></th>
                <th><b>Home Owner</b></th>
              </tr>
            </thead>
            <tbody>
              {filteredHistory.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center' }}>No history found for the selected filters.</td>
                </tr>
              ) : (
                filteredHistory.map((service, index) => (
                  <tr key={index}>
                    <td>{service.cleanerName}</td>
                    <td>{service.typeOfService}</td>
                    <td>{service.status}</td>
                    <td>{new Date(service.date).toLocaleDateString('en-GB')}</td>
                    <td>${service.price}</td>
                  </tr>
                ))
              )}
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

export default CleanerViewMyBookings;