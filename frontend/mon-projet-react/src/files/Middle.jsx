import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import React from "react";
import Card from "./Cardd.jsx";
import Ads from "./Ads.jsx";
import "./Middle.css";
import { Carousel } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import { tab } from "./AllKits.js";
import { boots } from "./AllBoots.js";
import { jak } from "./AllJackets.js";
import { ba } from "./AllBalls.js";
import Caroousel  from "./Caroousel.jsx";

function HorizontalScroll() {
  const navigate = useNavigate();

  const handleItemClick = (productId, productImg, productText, productPrice) => {
    navigate(`/produit/${productId}`, {
      state: {
        img: productImg,
        text: productText,
        price: productPrice
      }
    });
  };
function findProductById (id) {
    // Get all categories as arrays
    const categories = Object.values(tab);
    
    // Flatten all arrays into one and find the product
    const allProducts = categories.flat();
     return allProducts.find(product => product.id === id);
  };
  return (
    <>
      <Card />
      <div className="ads-container">
        <Ads />
      </div>
      {/* Scrollable Sections */}
      <Caroousel handleItemClick={handleItemClick} />
      <p className="section-title">Top Picks! <a href="/products">View All</a></p>
      
      {[tab.english, boots.BOOTS, jak.jacket ,ba.balls].map((league, index) => (
        <div key={index} className="scroll-container">
          <div className="scroll-content">
            {league.map((kit) => (
              <div key={kit.id} className="scroll-item "  onClick={() => handleItemClick(kit.id, kit.img, kit.text, kit.price)}>
                <img src={kit.img} alt={kit.text} />
                <p>{kit.text}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

export default HorizontalScroll;