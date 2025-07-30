import '../styles/home.css'
import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import glassBottle from '../assets/glassbottle.png';
import emptyBottle from '../assets/emptyBottle.png';
import homePageImage from '../assets/homepage.jpg';

const Home = ( { selectedUser, setTargetUser } ) => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://ricepaper-backend.onrender.com/users');
      const data = await response.json();
      setUsers(data);
      // console.log(data);
    }
    fetchData();
    // console.log(selectedUser);
  }, []);

  const handleLogout = () => {
    // Clear selectedUser from localStorage
    localStorage.removeItem('selectedUser');
    navigate('/login');
  }

  const handleBottleClick = (targetUserId) => {
    const selectedBottle = users.find(user => user.id === targetUserId);
    setTargetUser(selectedBottle);
    // Save targetUser to localStorage for persistence
    localStorage.setItem('targetUser', JSON.stringify(selectedBottle));
    navigate('/message');
  }

  const handleGalleryClick = () => {
    navigate('/gallery');
  }

  return (
    <div className="home-container">
      <img 
        src={homePageImage}
        alt="background"
        className="home-background-image"
      />
      
      <div className="bottle-container">
        <div className="bottle-grid">
          {users.map((user) => (
            <div key={user.id} className="bottle" onClick={() => handleBottleClick(user.id)}>
              <img
                src={
                  user.allWritten
                    ? glassBottle
                    : emptyBottle
                }
                alt="bottle"
                className="bottle-img"
              />
              <div className="label">{user.nickname}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="button-container">
        <button className="logout-button" onClick={handleLogout}>
          로그아웃
        </button>
        <button className="gallery-button" onClick={handleGalleryClick}>
          갤러리
        </button>
      </div>
    </div>
  );
};

export default Home;
