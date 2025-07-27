import '../styles/home.css'
import React from "react";
import glassBottle from '../assets/glassbottle.png';
import emptyBottle from '../assets/emptyBottle.png';

const bottles = [
  { id: 1, hasMessage: true , name: "김병주"},
  { id: 2, hasMessage: false , name: "한유진"},
  { id: 3, hasMessage: false , name: "구자윤"},
  { id: 4, hasMessage: false , name: "김수연"},
  { id: 5, hasMessage: false , name: "박보연"},
  { id: 6, hasMessage: false , name: "김시연"},
  { id: 7, hasMessage: false , name: "정태희"},
  { id: 8, hasMessage: true , name: "김진웅"},
  { id: 9, hasMessage: false , name: "이건오벌도스"}
];

const Home = ( { setCurrentPage } ) => {

  const handleLogout = () => {
    setCurrentPage('login');
  }

  const handleBottleClick = (bottleId) => {
    console.log(bottleId);
  }


  return (
    <div className="container">
      <div className="bottle-grid">
        {bottles.map((bottle) => (
          <div key={bottle.id} className="bottle" onClick={() => handleBottleClick(bottle.id)}>
            <img
              src={
                bottle.hasMessage
                  ? glassBottle
                  : emptyBottle
              }
              alt="bottle"
              className="bottle-img"
            />
            <div className="label">{bottle.name}</div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Home;
