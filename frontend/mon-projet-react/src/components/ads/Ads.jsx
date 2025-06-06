import React from 'react';
import './Ads.css'; 
import { useNavigate } from 'react-router-dom';

function Ads() {

    const navigate = useNavigate(); 
    const handleButtonClick = (route) => {
      navigate(route);
    };

  return (
    <div className="app">
      <header className="header">
        <h1>WHAT TO WATCH</h1>
        <p>Categories</p>
      </header>

      <div className="content">

  <section className="card card1" onClick={() => handleButtonClick("/english")}>
     
    <img src={require("../assets/mu.jpg")} alt="Manchester United Shirt" className="card-image" />
    <h2>MANCHESTER UNITED</h2>
    <p>Represent your team with pride</p>
     
  </section>


  <section className="card card2" onClick={() => handleButtonClick("/spanish")}>
     
    <img src={require("../assets/rm.jpg")} alt="Real Madrid Shirt" className="card-image" />
    <h2>REAL MADRID</h2>
    <p>Wear the colors of champions</p>
     
  </section>

  <section className="card card3" onClick={() => handleButtonClick("/Jackets")}>
     
    <img src={require("../assets/am.jpg")} alt="AC Milan Shirt" className="card-image" />
    <h2>AC MILAN</h2>
    <p>Embrace the legacy of greatness</p>
     
  </section>

  <section className="card card4" onClick={() => handleButtonClick("/Balls")}>
     
    <img src={require("../assets/ball.jpg")} alt="Football Ball" className="card-image" />
    <h2>FOOTBALL BALL</h2>
    <p>The essence of the beautiful game</p>
     
  </section>


  <section className="card card5" onClick={() => handleButtonClick("/Boots")}>
     
    <img src={require("../assets/boots.jpg")} alt="Football Boots" className="card-image" />
    <h2>FOOTBALL BOOTS</h2>
    <p>Step up your game with the right gear</p>

  </section>
</div>
    </div>
  );
}

export default Ads;