import '../css/platformManagerViewReport.css';
import { Link } from 'react-router-dom';
import LogoutModal from '../components/LogoutModal';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const PlatformManagerViewReports: React.FC = () => {
  const sessionUser = localStorage.getItem('sessionUser') || 'defaultUser';
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [reportData, setReportData] = useState<any[]>([]);

  // For the downloading of report
  const handleDownloadCSV = () => {
    const csvRows = [
      ['Booking ID', 'Services', 'Cleaners', 'Price', 'Date'],
      ...reportData.map(row => [
        `#${row.bookingId}`,
        row.service,
        row.cleaner,
        `$${row.price}`,
        row.date
      ])
    ];

    const csvContent = csvRows.map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${filter}_report.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const today = new Date();
        const chosenDate = today.toISOString(); // backend expects chosenDate

        const response = await axios.post(`http://localhost:3000/api/platform-manager/${filter}`, {
          data: { chosenDate },
          withCredentials: true,
        });

        setReportData(response.data);
      } catch (err) {
        console.error(`Failed to fetch ${filter} report:`, err);
      }
    };

    fetchReport();
  }, [filter]);

  const filteredData = reportData.filter((entry) =>
    entry.service.toLowerCase().includes(searchQuery.toLowerCase()) ||
    entry.cleaner.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="user-account-page">
      {/* Navbar */}
      <div className="header_container">
        <h2><Link to="/platformManager-dashboard">Home</Link></h2>
        <h2><Link to="/ViewServiceCategories">Service Categorizes</Link></h2>
        <h2><Link to="/platformManager-view-report">Report</Link></h2>
        <h2 id="logout_button" onClick={() => setShowLogoutModal(true)} style={{ cursor: 'pointer' }}>
          {sessionUser}/Logout
        </h2>
      </div>

      {/* Logout Modal */}
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />

      {/* Report Section */}
      <div className="report-container">
        <h2>Report</h2>
        <div className="report-controls">
          <input
            type="text"
            placeholder="Search...."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          {/* 🔹 Filter Radio Options */}
          <div className="filter-options">
            <label><input type="radio" value="daily" checked={filter === 'daily'} onChange={() => setFilter('daily')} /> Daily</label>
            <label><input type="radio" value="weekly" checked={filter === 'weekly'} onChange={() => setFilter('weekly')} /> Weekly</label>
            <label><input type="radio" value="monthly" checked={filter === 'monthly'} onChange={() => setFilter('monthly')} /> Monthly</label>
          </div>
        </div>

        <table className="report-table">
          <thead>
            <tr>
              <th>Booking ID</th>
              <th>Services</th>
              <th>Cleaners</th>
              <th>Price</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={index}>
                  <td>#{item.bookingId}</td>
                  <td>{item.service}</td>
                  <td>{item.cleaner}</td>
                  <td>${item.price}</td>
                  <td>{item.date}</td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={5}>No data available</td></tr>
            )}
          </tbody>
        </table>

        <button className="download-btn" onClick={handleDownloadCSV}>Download</button>
      </div>

      {/* Footer */}
      <div className="footer">
        <b>© Copyright 2025 Easy & Breezy - All Rights Reserved</b>
      </div>
    </div>
  );
};

export default PlatformManagerViewReports;
