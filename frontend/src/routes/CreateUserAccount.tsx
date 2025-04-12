  import React, { useState } from 'react'
  import axios from 'axios'

  const CreateAccountPage: React.FC = () => {
    const [role, setRole] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleCreateAccount = async (e: React.FormEvent) => {
      e.preventDefault()

      if (password !== confirmPassword) {
        setError('Passwords do not match')
        setSuccess('')
        return
      }

      try {
        const response = await axios.post('http://localhost:3000/api/user-accounts/create', {
          createAs:"cleaner",
          username:username,
          password:password,
        },
        { withCredentials: true } 
      )

        if (response.data === true) {
          setSuccess('Account created successfully!')
          setError('')
          setRole('')
          setUsername('')
          setPassword('')
          setConfirmPassword('')
        } else {
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
              <option value="admin">Admin</option>
              <option value="cleaner">Cleaner</option>
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
    )
  }

  export default CreateAccountPage