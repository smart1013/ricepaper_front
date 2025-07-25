import React, { useState } from 'react';
import '../styles/login.css';


const Login = ( { setCurrentPage } ) => {
  const [formData, setFormData] = useState({
    id: '',
    password: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('Login attempt:', formData);
    // Add your login logic here
  };

  const handleSignUp = () => {
    console.log('Sign up clicked'); 
    setCurrentPage('signup');
    // Add your sign up logic here
  };

  return (
    <div className="login-container">
      {/* Background Image */}
      <div 
        className="background-image"
      ></div>

      {/* Login Form Card */}
      <div className="login-card">
        <form onSubmit={handleLogin} className="login-form">
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
              placeholder="PW"
              value={formData.password}
              onChange={handleInputChange}
              className="input-field"
              required
            />
          </div>

          <div className="button-group">
            <button type="submit" className="login-btn">
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
