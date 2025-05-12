import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import LogoutModal from '../../components/LogoutModal';
import logo from '../../assets/logo.png';

interface Role {
  id: number;
  label: string;
  isSuspended: boolean;
}

const ViewUserRoles: React.FC = () => {
  const sessionUser = localStorage.getItem('sessionUser') || 'defaultUser';
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([]);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showProfileEditModal, setShowProfileEditModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<Role | null>(null);
  const [newStatus, setNewStatus] = useState<'Active' | 'Suspended'>('Active');
  const [editingProfile, setEditingProfile] = useState({ currentProfile: '', updatedProfile: '' });
  const [search, setSearch] = useState<string>('');

  const fetchRoles = async () => {
    try {
      const response = await axios.get('http://localhost:3000/api/user-profiles/', { withCredentials: true });
      const data: Role[] = response.data;
      setFilteredRoles(data);
    } catch (err) {
      console.error('Failed to fetch roles:', err);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      try {
        const response = await axios.get(`http://localhost:3000/api/user-profiles/search?search=${search}`, { withCredentials: true });
        const data = response.data;
        const results = Array.isArray(data) ? data : [data];
        const mappedResults = results.map((r: any) => ({
          id: r.id,
          label: r.label,
          isSuspended: r.isSuspended
        }));
        setFilteredRoles(mappedResults);
      } catch (err) {
        console.error('Search failed:', err);
        setFilteredRoles([]);
      }
    }
  };

  const confirmStatusUpdate = async () => {
    if (!selectedProfile) return;
    const url = `http://localhost:3000/api/user-profiles/${newStatus === 'Active' ? 'unsuspend' : 'suspend'}`;
    try {
      await axios.post(url, { profileName: selectedProfile.label }, { withCredentials: true });
      setShowSuspendModal(false);
      fetchRoles();
    } catch (error) {
      console.error('Failed to update profile status:', error);
    }
  };

  return (
    <div className="page-container">
      <div className="header-container">
        <div>
          <img src={logo} alt="Logo" height={40} />
          <h2><Link to="/admin-dashboard">Home</Link></h2>
          <h2><Link to="/user-account-management">User Account</Link></h2>
          <h2><Link to="/ViewUserProfile">User Profile</Link></h2>
        </div>

        <div>
          <h2 id="logout_button" onClick={() => setShowLogoutModal(true)} style={{ cursor: 'pointer' }}>
            <span style={{ marginRight: '8px' }}>👤</span>{sessionUser}/Logout
          </h2>
        </div>
      </div>

      <LogoutModal isOpen={showLogoutModal} onClose={() => setShowLogoutModal(false)} />

      <div className="body-container">
        <div className="card">
          <h2>User Profiles</h2>
          <div className="top-bar">
            <input
              type="text"
              className="search-bar"
              placeholder="Search by profiles"
              value={search}
              onChange={e => {
                const value = e.target.value;
                setSearch(value);
                if (!value.trim()) fetchRoles();
              }}
              onKeyDown={handleSearch}
            />
            <button className="create-btn"><Link to="/create-profile" className="create-btn">Create New Profile</Link></button>
          </div>

          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Profile Name</th>
                <th>Status</th>
                <th id="actionCol">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRoles.length > 0 ? (
                filteredRoles.map((role, index) => (
                  <tr key={index}>
                    <td>{role.id}</td>
                    <td>{role.label}</td>
                    <td style={{ color: role.isSuspended ? 'red' : 'green', fontWeight: 'bold' }}>
                      {role.isSuspended ? 'Suspended' : 'Active'}
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="edit-btn"
                          onClick={() => {
                            setEditingProfile({ currentProfile: role.label, updatedProfile: '' });
                            setShowProfileEditModal(true);
                          }}
                        >Edit</button>
                        <button
                          className={role.isSuspended ? 'unsuspend-btn' : 'suspend-btn'}
                          onClick={() => {
                            setSelectedProfile(role);
                            setNewStatus(role.isSuspended ? 'Active' : 'Suspended');
                            setShowSuspendModal(true);
                          }}
                        >{role.isSuspended ? 'Unsuspend' : 'Suspend'}</button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4}>No roles available.</td></tr>
              )}
            </tbody>
          </table>

          {showSuspendModal && selectedProfile && (
            <div className="modal-overlay">
              <div className="modal">
                <h2>Are you sure you want to {newStatus === 'Active' ? 'unsuspend' : 'suspend'} user profile"{selectedProfile.label}"?</h2>
                <select value={newStatus} onChange={e => setNewStatus(e.target.value as 'Active' | 'Suspended')}>
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
                <div className="modal-buttons">
                  <button onClick={() => setShowSuspendModal(false)}>Cancel</button>
                  <button className="submit-btn" onClick={confirmStatusUpdate}>Update Status</button>
                </div>
              </div>
            </div>
          )}

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
                  onChange={e => setEditingProfile({ ...editingProfile, updatedProfile: e.target.value })}
                  required
                />
                <div className="modal-buttons">
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
                        fetchRoles();
                      } catch (err) {
                        console.error(err);
                        alert('Update failed!');
                      }
                    }}
                  >Save Profile</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="footer-container">
        <b>© Copyright 2025 Easy & Breezy - All Rights Reserved</b>
      </div>
    </div>
  );
};

export default ViewUserRoles;