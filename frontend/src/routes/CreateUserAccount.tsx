import React, { useState } from 'react'

const CreateAccountPage: React.FC = () => {
  const [role, setRole] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ role, username, password, confirmPassword })
    
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

          <label>Create As:</label>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            required
          >
            {/* change this part wif an api call */}
            <option value="">Select Role</option>
            <option value="customer">Admin</option>
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
              placeholder="Password"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="create_btn">
            Create Account
          </button>
          <button type="button" className="cancel_btn">
            Cancel
          </button>
        </form>
      </div>
    </div>
  )
}

export default CreateAccountPage
