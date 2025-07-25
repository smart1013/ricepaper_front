import React, { useState } from 'react';
import '../styles/signup.css';

const Signup = ({ setCurrentPage }) => {
  const [formData, setFormData] = useState({
    id: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    console.log('Sign up attempt:', formData);
    // Add your signup logic here
  };

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
              type="text"
              name="id"
              placeholder="ID"
              value={formData.id}
              onChange={handleInputChange}
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleInputChange}
              className="input-field"
              required
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className="input-field"
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="signup-btn">
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