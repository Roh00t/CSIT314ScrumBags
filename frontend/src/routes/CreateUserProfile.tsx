import React, { useState } from 'react'
import axios from 'axios'

const CreateProfilePage: React.FC = () => {
  const [profileName, setProfileName] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleCreateProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await axios.post('http://localhost:3000/api/user-profiles', {
        profileName:profileName
      },
      { withCredentials: true } 
    )

      if (response.data === true) {
        setSuccess('Profile created successfully!🥳')
        setProfileName('')
      } else {
        setError('Failed to create account. Please try again.😢')
        setSuccess('')
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong.😡')
      console.log({ profileName });
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
        <form className="create_form" onSubmit={handleCreateProfile}>
          <h2>Create User Profile</h2>
          <p>Please enter your details</p>

          {error && <p className="error_msg">{error}</p>}
          {success && <p className="success_msg">{success}</p>}

          <label>Enter User Profile name:</label>
          <div className="input_group">
            <input
              type="text"
              placeholder="User Profile name"
              value={profileName}
              onChange={e => setProfileName(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="create_btn">
            Save Profile
          </button>
          <button
            type="button"
            className="cancel_btn"
            onClick={() => {
              setProfileName('')
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

export default CreateProfilePage