import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/home'
import Login from './pages/login'
import Signup from './pages/signup'
import Message from './pages/message'

const App = () => {
  const [selectedUser, setSelectedUser] = useState(() => {
    // Get the saved user from localStorage, default to null if none exists
    const savedUser = localStorage.getItem('selectedUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [targetUser, setTargetUser] = useState(() => {
    // Get the saved targetUser from localStorage, default to null if none exists
    const savedTargetUser = localStorage.getItem('targetUser');
    return savedTargetUser ? JSON.parse(savedTargetUser) : null;
  });

  // Save selectedUser to localStorage whenever it changes
  useEffect(() => {
    if (selectedUser) {
      localStorage.setItem('selectedUser', JSON.stringify(selectedUser));
    } else {
      localStorage.removeItem('selectedUser');
    }
  }, [selectedUser]);

  // Save targetUser to localStorage whenever it changes
  useEffect(() => {
    if (targetUser) {
      localStorage.setItem('targetUser', JSON.stringify(targetUser));
    } else {
      localStorage.removeItem('targetUser');
    }
  }, [targetUser]);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login setSelectedUser={setSelectedUser} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<Home selectedUser={selectedUser} setTargetUser={setTargetUser} />} />
          <Route path="/message" element={<Message targetUser={targetUser} selectedUser={selectedUser}/>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
