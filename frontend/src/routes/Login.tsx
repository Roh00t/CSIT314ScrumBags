import React, { useState } from 'react'

const Login: React.FC = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
  
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault()
      console.log('Logging in with:', { username, password })
      // Replace with actual login logic (API call etc.)
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