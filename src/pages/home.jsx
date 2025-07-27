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
      const response = await fetch('http://localhost:3000/users');
      const data = await response.json();
      setUsers(data);
      console.log(data);
    }
    fetchData();
    console.log(selectedUser);
  }, []);



  const handleLogout = () => {
    navigate('/login');
  }

  const handleBottleClick = (targetUserId) => {
    setTargetUser(targetUserId);
    navigate('/message');
  }

  return (
    <div className="container">
      <img 
        src={homePageImage}
        alt="background"
        className="home-background-image"
        onLoad={(e) => {
          const img = e.target;
          const container = img.parentElement;
          const aspectRatio = img.naturalWidth / img.naturalHeight;
          
          // Mobile screen dimensions (iPhone 12/13/14 size)
          const mobileWidth = 390;
          const mobileHeight = 844;
          
          let width, height;
          if (mobileWidth / aspectRatio <= mobileHeight) {
            width = mobileWidth;
            height = mobileWidth / aspectRatio;
          } else {
            height = mobileHeight;
            width = mobileHeight * aspectRatio;
          }
          
          container.style.width = width + 'px';
          container.style.height = height + 'px';
        }}
      />
      
      <div className="bottle-container">
        <div className="bottle-grid">
          {users.map((user) => (
            <div key={user.id} className="bottle" onClick={() => handleBottleClick(user.id)}>
              <img
                src={
                  user.hasMessage
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
        <button className="gallery-button" onClick={() => console.log('Gallery clicked')}>
          갤러리
        </button>
      </div>
    </div>
  );
};

export default Home;
