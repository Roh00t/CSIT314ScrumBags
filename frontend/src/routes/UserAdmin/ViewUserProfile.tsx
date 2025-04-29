import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../css/UserAdmin/ViewUserProfile.css'
import { Link } from 'react-router-dom';
import LogoutModal from '../../components/LogoutModal';
import logo from '../../assets/logo.png';
interface Role {
  name: string;
  isSuspended: boolean;
}

const ViewUserRoles: React.FC = () => {
  const sessionUser = localStorage.getItem('sessionUser') || 'defaultUser';
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  // Logout Modal State
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  // For Update User Profile
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState<{
    currentProfile: string;
    updatedProfile: string;
  }>({
    currentProfile: '',
    updatedProfile: ''
  });
  const [, setRoles] = useState<Role[]>([]);
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState<string>(''); // Search state

  const handleToggleSuspendProfile = async (profileName: string, isSuspended: boolean) => {
    try {
      const confirmText = isSuspended
        ? `Are you sure you want to un-suspend "${profileName}"?`
        : `Are you sure you want to suspend "${profileName}"?`;
  
      if (!window.confirm(confirmText)) return;
  
      const url = `http://localhost:3000/api/user-profiles/${isSuspended ? 'unsuspend' : 'suspend'}`;
  
      await axios.post(url, {
        profileName
      }, {
        withCredentials: true
      });
  
      alert(`Profile "${profileName}" has been ${isSuspended ? 'unsuspended' : 'suspended'} successfully!`);
  
      // Refresh list
      const refreshed = await axios.get('http://localhost:3000/api/user-profiles/', {
        withCredentials: true,
      });
      setRoles(refreshed.data);
  
    } catch (error) {
      console.error('Failed to toggle suspension:', error);
      alert('Failed to update profile status.');
    }
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/user-profiles/', {
          withCredentials: true,
        });
  
        const data: Role[] = response.data;
        if (Array.isArray(data)) {
          setFilteredRoles(data); // set this instead of `roles`
        } else {
          console.error('Unexpected server response:', data);
          setError('Unexpected server response.');
        }
      } catch (err) {
        console.error('Failed to fetch roles:', err);
        setError('Could not load roles. Please try again later.');
      }
    };
  
    fetchRoles();
  }, []);

  // Filter roles based on search

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      try {
        const response = await axios.get(`http://localhost:3000/api/user-profiles/search?search=${search}`, {
          withCredentials: true,
        });
  
        // If your endpoint returns a single role object
        const data = response.data;
        const results = Array.isArray(data) ? data : [data]; // Normalize to array
        const mappedResults = results.map(r => ({
          name: r.label,  // map label to name
          isSuspended: r.isSuspended
        }));
        setFilteredRoles(mappedResults);
      } catch (err) {
        console.error('Search failed:', err);
        setFilteredRoles([]); // Clear results if not found
        setError('Search failed. Try again.');
      }
    }
  };

  return (
    <div className="user-account-page">
      {/* Navbar */}
      <div className="header_container">
        <img src={logo} alt="Logo" height={40} />
        <h2><Link to="/admin-dashboard">Home</Link></h2>
        <h2><Link to="/user-account-management">User Account</Link></h2>
        <h2><Link to="/ViewUserProfile">User Profile</Link></h2>
        <h2 id="logout_button" onClick={() => setShowLogoutModal(true)} style={{ cursor: 'pointer' }}>
          <span style={{ marginRight: '8px' }}>👤</span>{sessionUser}/Logout
        </h2>
      </div>
      {/* Logout Modal */}
      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />

      {/* Roles Section */}
      {/* User Accounts Section */}
      <div className="account-container">
        <h2>User Profiles</h2>
        <div className="top-row">
        <input
          type="text"
          className="search-bar"
          placeholder="Search by profiles"
          value={search}
          onChange={async (e) => {
            const value = e.target.value;
            setSearch(value);
          
            if (value === '') {
              try {
                const response = await axios.get('http://localhost:3000/api/user-profiles/', {
                  withCredentials: true,
                });
                const data: Role[] = response.data;
                setFilteredRoles(data.map(r => ({
                  name: r.name,  // map label to name if needed
                  isSuspended: r.isSuspended
                })));
                setError('');
              } catch (err) {
                console.error('Failed to reload roles:', err);
                setError('Failed to reload roles.');
              }
            }
          }}
          onKeyDown={handleSearch}
        />
          <button className="create-btn"><Link to="/create-profile" className="create-btn">Create New Profile</Link></button>
        </div>

        {error && <p className="error-message">{error}</p>}
        <table className="user-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Profile Name</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
          {filteredRoles.length > 0 ? (
            filteredRoles.map((role, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td>{role.name}</td>
                  <td style={{ color: role.isSuspended ? 'red' : 'green', fontWeight: 'bold' }}>
                    {role.isSuspended ? 'Suspended' : 'Active'}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="view-btn">View</button>
                      <button
                        className="edit-btn"
                        onClick={() => {
                          setEditingProfile({ currentProfile: role.name, updatedProfile: '' });
                          setShowProfileEditModal(true);
                        }}>
                        Edit
                      </button>
                      <button
                      className={role.isSuspended ? 'unsuspend-btn' : 'suspend-btn'}
                      onClick={() => handleToggleSuspendProfile(role.name, role.isSuspended)}
                    >
                      {role.isSuspended ? 'Unsuspend' : 'Suspend'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No roles available.</td>
              </tr>
            )}
          </tbody>
        </table>
        {showProfileEditModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Update User Profile</h2>

              <label>Current Profile:</label>
              <input type="text" value={editingProfile.currentProfile} disabled />

              <label>Updated Profile:</label>
              <input
                type="text"
                value={editingProfile.updatedProfile}
                onChange={e =>
                  setEditingProfile({ ...editingProfile, updatedProfile: e.target.value }
                  )
                }
                required
              />

              <div className="modal-btn-group">
                <button onClick={() => setShowProfileEditModal(false)}>Cancel</button>
                <button
                  onClick={async () => {
                    try {
                      await axios.put('http://localhost:3000/api/user-profiles/update', {
                        oldProfileName: editingProfile.currentProfile,
                        newProfileName: editingProfile.updatedProfile
                      });

                      alert('Profile updated successfully!');
                      setShowProfileEditModal(false);
                      // Optionally refetch profiles here if needed
                    } catch (err) {
                      console.error(err);
                      alert('Update failed!');
                    }
                  }}
                >
                  Save Profile
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="footer">
        <b>© Copyright 2025 Easy & Breezy - All Rights Reserved</b>
      </div>
    </div>
  );
};

export default ViewUserRoles;
