  import React, { useState, useEffect } from 'react'
  import axios from 'axios'
  import { Link } from 'react-router-dom'

  const CreateAccountPage: React.FC = () => {
    const [role, setRole] = useState('')
    const [roles, setRoles] = useState<string[]>([]); // Correct for array of strings
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
      const fetchRoles = async () => {
        try {
          const response = await axios.get('http://localhost:3000/api/user-profiles/', {
            withCredentials: true,
          });
    
          const data = response.data; // ✅ this is already the array of roles
          if (Array.isArray(data)) {
            setRoles(data); // ✅ use directly
          } else {
            console.error('Expected array of roles but got:', data);
            setRoles([]);
            setError('Unexpected server response.');
          }
        } catch (err) {
          console.error('Failed to fetch roles:', err);
          setError('Could not load roles. Please try again later.');
        }
      };
    
      fetchRoles();
    }, []);


    const handleCreateAccount = async (e: React.FormEvent) => {
      e.preventDefault()

      if (password !== confirmPassword) {
        setError('Passwords do not match')
        setSuccess('')
        return
      }

      try {
        const response = await axios.post('http://localhost:3000/api/user-accounts/create', {
          createAs:role,
          username:username,
          password:password,
        },
        { withCredentials: true } 
      )

        if (response.data.message === 'Account created successfully') {
          console.log('response.data:', response.data);
          setSuccess('Account created successfully!')
          setError('')
          setRole('')
          setUsername('')
          setPassword('')
          setConfirmPassword('')
        } else {
          console.log('response.data:', response.data);
          setError('Failed to create account. Please try again.')
          setSuccess('')
        }
      } catch (err: any) {
        setError(err.response?.data?.message || 'Something went wrong.')
        console.log({ role, username, password, confirmPassword });
        setSuccess('')
      }
    }

    return (
      <div className="page_container">
        <div className="header_container">
          <h2><Link to="/">Home</Link></h2>
          <h2><Link to="/">Profiles</Link></h2>
          <h2><Link to="/">Accounts</Link></h2>
          <h2 id="logout_button">Logout</h2>
        </div>

        <div className="create_container">
          <div className="left_side">
            <h1>Experience a New Level of Clean</h1>
            <p>
              Create an account to book reliable, professional cleaning services
              for your home or office.
            </p>
          </div>
          <div className="right_side">
            <form className="create_form" onSubmit={handleCreateAccount}>
              <h2>Create Account</h2>
              <p>Please enter your details</p>

              {error && <p className="error_msg">{error}</p>}
              {success && <p className="success_msg">{success}</p>}

              <label>Create As:</label>
              <select
                value={role}
                onChange={e => setRole(e.target.value)}
                required
              >
                <option value="">Select Role</option>

                {error ? (
                  <option disabled>{error}</option>
                ) : roles.length === 0 ? (
                  <option disabled>Loading roles...</option>
                ) : (
                  roles.map(r => (
                    <option key={r} value={r}>
                      {r.charAt(0).toUpperCase() + r.slice(1)}
                    </option>
                  ))
                )}
              </select>

              <label>Enter Username:</label>
              <div className="input_group">
                <input
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  required
                />
              </div>

              <label>Enter Password:</label>
              <div className="input_group">
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              <label>Enter Confirm Password:</label>
              <div className="input_group">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="create_btn">
                Create Account
              </button>
              <button
                type="button"
                className="cancel_btn"
                onClick={() => {
                  setRole('')
                  setUsername('')
                  setPassword('')
                  setConfirmPassword('')
                  setError('')
                  setSuccess('')
                }}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>

        <div className="footer_container">
            <p>© Copyright 2025 Easy & Breezy - All Rights Reserved</p>
        </div>
      </div>
    )
  }

  export default CreateAccountPage