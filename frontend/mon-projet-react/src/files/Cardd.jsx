import React from 'react';
import './Cardd.css';
import { useNavigate } from 'react-router-dom';

const list = [
  { title: 'R.Madrid', img: require("../assets/Real-Madrid-football-club-badge-removebg-preview.png"), image: require("../assets/modric.jpg"), text: "Real Madrid", price: "800 DH"  },
  { title: 'PSG',  img: require("../assets/paris-saint-germain-PSG-logo-design-removebg-preview.png"),image: require("../assets/paris.jpg"), text: "Paris Saint Germain", price: "800 DH" },
  { title: 'Juventus',  img: require("../assets/old-Juventus-logo-design-removebg-preview.png") , image: require("../assets/juventus.jpg"), text: "Juventus", price: "800 DH"},
  { title: 'MUN',  img: require("../assets/Manchester-United-logo-removebg-preview.png"), image: require("../assets/garnacho.jpg"), text: "Manchester United", price: "800 DH" },
  { title: 'Liverpool',  img: require("../assets/liverpool-football-club-logo-design-removebg-preview.png"), image: require("../assets/lv.jpg"), text: "Liverpool", price: "800 DH", },
  { title: 'Inter Milan',  img: require("../assets/Inter-Milan-football-club-logo-removebg-preview.png"), image: require("../assets/inter.jpg"), text: "Inter Milan", price: "800 DH" },
  { title: 'Barcelona', img: require("../assets/FC-Barcelona-logo-design-removebg-preview.png"), image: require("../assets/barcelona.jpg"), text: "Barcelona", price: "800 DH" },
  { title: 'Chelsea',  img: require("../assets/chelsea-logo-design-removebg-preview.png"), image: require("../assets/palmer.jpg"), text: "Chelsea", price: "400 DH" }
];

function Cardd() {
  const navigate = useNavigate(); // Initialize navigate

  const handleClick = (id, productImg, productText, productPrice) => {
    navigate(`/produit/${id}`, { 
      state: { 
        img: productImg, 
        text: productText, 
        price: productPrice 
      } 
    });
  };

  return (
    <div className="App">
      <div className="fruit-list">
        {list.map((fruit, index) => (
          <div 
            className="fruit-item" 
            key={index} 
            onClick={() => handleClick(fruit.id,fruit.image,fruit.text,fruit.price)}
            style={{ cursor: 'pointer' }}
          >
            <img src={fruit.img} alt={fruit.title} className="fruit-image" />
            <span className="fruit-name">{fruit.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cardd;