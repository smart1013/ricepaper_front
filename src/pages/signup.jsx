import React, { useState } from 'react';
import '../styles/signup.css';

function isValidPassword(password) {
  const minLength = 8;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*.]/.test(password);

  return (
    password.length >= minLength &&
    hasUppercase &&
    hasLowercase &&
    hasNumber &&
    hasSpecialChar
  );
}

function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}



const Signup = ({ setCurrentPage }) => {
  const [userEmail, setUserEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [error, setError] = useState('');


  const handleSignUp = (e) => {
    e.preventDefault(); // Prevent form submission
    if (!userEmail) {
      setError('Email is required');
      return;
    }
    else if (!password) {
      setError('Password is required');
      return;
    }
    else if (!nickname) {
      setError('Nickname is required');
      return;
    }
    else if (!isValidEmail(userEmail)) {
      setError('Invalid email address');
      return;
    }
    else if (!isValidPassword(password)) {
      setError('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character.');
      return;
    }
    setError('');
    console.log('Sign up attempt:', userEmail, nickname, password);
    setCurrentPage('login');
  }

  
  const handleBackToLogin = () => {
    console.log('Back to login clicked');
    setCurrentPage('login');
  };


  return (
    <div className="signup-container">
      {/* Background Image */}
      <div 
        className="background-image"
      ></div>

      {/* Signup Form Card */}
      <div className="signup-card">
        <form onSubmit={handleSignUp} className="signup-form">
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
              type="text"
              name="nickname"
              placeholder="Nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              required
            />
          </div>

          {error && (
            <div style={{ color: 'red', fontSize: '12px', marginTop: '5px', textAlign: 'center' }}>
              {error}
            </div>
          )}

          <div className="button-group">
            <button type="button" onClick={handleSignUp} className="signup-btn">
              Sign Up
            </button>
            
            <div className="separator"></div>
            
            <button type="button" onClick={handleBackToLogin} className="login-btn">
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;