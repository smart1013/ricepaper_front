import React, { useState } from 'react';
import '../styles/login.css';


function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}


const Login = ( { setCurrentPage } ) => {
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');


  const handleLogin = () => {
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
    console.log('Login attempt:', userEmail, password);
    setCurrentPage('home');
  };



  const handleSignUp = () => {
    console.log('Sign up clicked'); 
    setCurrentPage('signup');
  };



  return (
    <div className="login-container">
      {/* Background Image */}
      <div 
        className="background-image"
      ></div>

      {/* Login Form Card */}
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
            <div style={{ color: 'red', fontSize: '12px', marginTop: '5px' }}>
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
