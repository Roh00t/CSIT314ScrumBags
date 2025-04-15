import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Optional: use default styles

const AdminDashboardRoute: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Date, Date] | Date>(new Date());

  return (
    <div style={{ backgroundColor: '#a7c6ec', minHeight: '100vh', fontFamily: 'Arial, sans-serif', padding: '1rem' }}>
      {/* Welcome Message */}
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2>Welcome back, Cleaner 1!!</h2>
        <p>Manage your cleaning services.</p>
      </div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '2fr 1fr',
          gap: '2rem',
          marginTop: '2rem',
          padding: '0 2rem',
        }}
      >
        {/* Calendar part*/}
        <div style={{ backgroundColor: 'white', borderRadius: '12px', padding: '1rem' }}>
          <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Your Calendar</h3>
          <Calendar
            onChange={(value) => setDateRange(value as Date | [Date, Date])}
            value={dateRange}
            selectRange={true}
          />
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <button style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: '#fff' }}>
          </button>
          <select style={{ padding: '0.75rem 1rem', borderRadius: '8px' }}>
           
          </select>
          <select style={{ padding: '0.75rem 1rem', borderRadius: '8px' }}>
          
          </select>
          <button style={{ padding: '0.75rem 1rem', borderRadius: '8px', backgroundColor: '#fff' }}>
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ textAlign: 'center', marginTop: '4rem', padding: '1rem', fontSize: '0.9rem' }}>
        © Copyright 2025 Easy & Breezy - All Rights Reserved
      </footer>
    </div>
  );
};

export default AdminDashboardRoute;
