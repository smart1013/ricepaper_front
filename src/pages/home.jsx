import '../styles/home.css'
import React from "react";

const bottles = [
  { id: 1, hasMessage: true },
  { id: 2, hasMessage: false },
  { id: 3, hasMessage: false },
  { id: 4, hasMessage: false },
  { id: 5, hasMessage: false },
  { id: 6, hasMessage: false },
  { id: 7, hasMessage: false },
  { id: 8, hasMessage: true },
  { id: 9, hasMessage: false },
];

const Home = ( { setCurrentPage } ) => {

  const handleLogout = () => {
    setCurrentPage('login');
  }


  return (
    <div className="container">
      <div className="bottle-grid">
        {bottles.map((bottle) => (
          <div key={bottle.id} className="bottle">
            <img
              src={
                bottle.hasMessage
                  ? "your-message-bottle-url.png"
                  : "your-empty-bottle-url.png"
              }
              alt="bottle"
              className="bottle-img"
            />
            <div className="label">이름</div>
          </div>
        ))}
      </div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Home;
