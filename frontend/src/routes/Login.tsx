import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Login: React.FC = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault()
    
      try {
        const response = await axios.post(
          'http://localhost:3000/api/user-accounts/login',
          { username, password },
          { withCredentials: true } // 👈 important for session cookies
        )
    
        const user = response.data
        const role = user.userProfile?.toLowerCase() // ✅ Define role here!
        console.log('Login successful:', response.data)
        // You can redirect or store user data here
        // Redirect based on user profile
        if (role === 'cleaner') {
          navigate('/cleaner-dashboard')
        } else if (role === 'user admin') {
          navigate('/admin-dashboard')
        } else if (role === 'homeowner') {
          navigate('/homeowner-dashboard')
        } else if (role === 'platform manager') {
          navigate('/platform-dashboard')
        } else {
          alert('Unknown role: ' + role)
        }
      } catch (error: any) {
        if (error.response) {
          // Server responded with a status other than 2xx
          console.error('Login failed:', error.response.data?.message)
          alert('Login failed: ' + error.response.data?.message)
        } else {
          // Something else went wrong (network, timeout, etc.)
          console.error('Network or server error:', error.message)
          alert('Something went wrong. Please try again.')
        }
      }
    }
  
    return (
      <div className="login_container">
        <div className="login_left">
          <img
            src="src/assets/login_image.jpg"
            alt="Cleaning"
            className="login_image"
          />
        </div>
        <div className="login_right">
        <div className="login_form_h2"><b>Welcome</b></div>
        <div className="login_form_p">Please enter your details</div>
          <form className="login_form" onSubmit={handleSubmit}>
            <label><b>Enter Username:</b></label>
            <div className="input_group">
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
  
            <label><b>Enter Password:</b></label>
            <div className="input_group">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div> 
            <button type="submit" className="login_button">Login</button>
          </form>
        </div>
      </div>
    )
  }
  
  export default Login