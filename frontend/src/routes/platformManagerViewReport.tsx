import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PlatformManagerViewReports: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [reportData, setReportData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(event.target.value);
  };

  const fetchReport = async () => {
    if (!selectedDate) {
      alert('Please select a date');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:3000/api/platform-manager/daily', {
        chosenDate: selectedDate, // now sent in request body
      });
      setReportData(response.data);
    } catch (error) {
      console.error('Failed to fetch daily report:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>Daily Report</h2>
      <label htmlFor="report-date">Select Date:</label>
      <input
        id="report-date"
        type="date"
        value={selectedDate}
        onChange={handleDateChange}
        style={{ marginLeft: '10px' }}
      />
      <button onClick={fetchReport} style={{ marginLeft: '10px' }}>
        View Report
      </button>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h3>Report Results:</h3>
          {reportData.length === 0 ? (
            <p>No data available.</p>
          ) : (
            <ul>
              {reportData.map((item, index) => (
                <li key={index}>
                  {JSON.stringify(item)}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
};

export default PlatformManagerViewReports;
