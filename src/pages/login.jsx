import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/login.css';
import loginScreenImage from '../assets/loginScreen.jpg';

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

const Login = ( { setSelectedUser } ) => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!userEmail) {
      setError('Email is required');
      return;
    }
    else if (!password) {
      setError('Password is required');
      return;
    }
    else if (!isValidEmail(userEmail)) {
      setError('Invalid email address');
      return;
    }
    setError('');
    // console.log('Login attempt:', userEmail, password);


    // Send data to backend
    try {
      const response = await fetch('https://ricepaper-backend.onrender.com/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          password: password,
        }),
      });
      if (!response.ok) {
        // const errorText = await response.text();
        setError(`Login failed.`);
        return;
      }
      const data = await response.json();
      // console.log('Login successful:', data);
      setSelectedUser(data.user);
      // Save user data to localStorage for persistence
      localStorage.setItem('selectedUser', JSON.stringify(data.user));
      navigate('/home');
    } catch (error) {
      // console.error('Error logging in:', error);
    }
  };



  const handleSignUp = () => {
    // console.log('Sign up clicked'); 
    navigate('/signup');
  };



  return (
    <div className="login-container">
      <img 
        src={loginScreenImage}
        alt="background"
        className="login-background-image"
      />

      <div className="login-card">
        <form className="login-form">
          <div className="input-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="PW"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          {error && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '5px', textAlign: 'center', zIndex: '1000' }}>
              {error}
            </div>
          )}

          <div className="button-group">
            <button type="button" onClick={handleLogin} className="login-btn">
              Log In
            </button>
            
                <div className="separator"></div>
            
            <button type="button" onClick={handleSignUp} className="signup-btn">
              Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
