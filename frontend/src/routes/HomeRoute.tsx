import React from 'react'
import { useNavigate } from 'react-router-dom'

const HomeRoute: React.FC = () => {
  const navigate = useNavigate()

  const goToLogin = () => {
    navigate('/login')
  }

  const goToCreate = () => {
    navigate('/create')
  }

  const goToCreateProfile = () => {
    navigate('create-profile')
  }

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        gap: '1rem',
      }}
    >
      <h2>The beginning of a multi-million dollar cleaning service venture</h2>
      <button onClick={goToLogin}>Go to Login</button>
      <button onClick={goToCreate}>Go to Create</button>
      <button onClick={goToCreateProfile}>Go to Create Profile</button>
    </div>
  )
}

export default HomeRoute
