import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import React from "react";
import "./Middle.css";
import { Carousel } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';
import {Button} from "@heroui/react";

const items = [
  { id: 1, img: require("../assets/mu.jpg"), text: "Welcome to Manchester United" },
  { id: 2, img: require("../assets/rm.jpg"), text: "Real Madrid X Adidas" },
  { id: 3, img: require("../assets/am.jpg"), text: "Jackets" },
  { id: 4, img: require("../assets/nassr.jpg"), text: "Trending Fashion" },
  { id: 5, img: require("../assets/ball.jpg"), text: "Balls" },
  { id: 6, img: require("../assets/boots.jpg"), text: "Boots" }
];

const english = [
  { id: 7, img: require("../assets/trosard.jpg"), text: "Arsenal", price: "800DH" },
  { id: 8, img: require("../assets/garnacho.jpg"), text: "Manchester United", price: "900DH" },
  { id: 9, img: require("../assets/debruyne.jpg"), text: "Manchester City", price: "700DH" },
  { id: 10, img: require("../assets/palmer.jpg"), text: "Chelsea", price: "800DH" },
  { id: 11, img: require("../assets/lv.jpg"), text: "Liverpool", price: "800DH" }
];

const spanish = [
  { id: 12, img: require("../assets/modric.jpg"), text: "Real Madrid", price: "900DH" },
  { id: 12, img: require("../assets/bilbao.jpg"), text: "Blibao", price: "600DH" },
  { id: 13, img: require("../assets/barcelona.jpg"), text: "Barcelona", price: "800DH" },
  { id: 14, img: require("../assets/athletico.png"), text: "Athletico Madrid", price: "600DH" },
  { id: 15, img: require("../assets/villareal.jpg"), text: "Villareal", price: "600DH" }
];

const italie = [
  { id: 16, img: require("../assets/juventus.jpg"), text: "Juventus", price: "800DH" },
  { id: 17, img: require("../assets/milan.jpg"), text: "AC Milan", price: "800DH" },
  { id: 18, img: require("../assets/inter.jpg"), text: "Inter Milan", price: "800DH" },
  { id: 19, img: require("../assets/atalanta.jpg"), text: "Atalanta", price: "600DH" },
  { id: 20, img: require("../assets/napoli.jpg"), text: "Napoli", price: "700DH" }
];

const bendisliga = [
  { id: 21, img: require("../assets/bayern.jpg"), text: "Bayern Munich", price: "800DH" },
  { id: 22, img: require("../assets/dortmund.jpg"), text: "Brossia Dortmund", price: "700DH" },
  { id: 23, img: require("../assets/leverkusen.jpg"), text: "Leverkusen", price: "600DH" },
  { id: 24, img: require("../assets/liepzig.jpg"), text: "Liepzig", price: "600DH" },
  { id: 25, img: require("../assets/worlfsburg.jpg"), text: "Worlfsburg", price: "500DH" }
];

const ligue1 = [
  { id: 26, img: require("../assets/paris.jpg"), text: "Paris Saint Germain", price: "700DH" },
  { id: 27, img: require("../assets/monaco.jpg"), text: "Monaco", price: "600DH" },
  { id: 28, img: require("../assets/marseille.jpg"), text: "Marseille", price: "600DH" },
  { id: 29, img: require("../assets/lion.jpg"), text: "Olympic Lion", price: "600DH" },
  { id: 30, img: require("../assets/lile.jpg"), text: "Lile", price: "600DH" }
];

const international = [
  { id: 31, img: require("../assets/ajax.jpg"), text: "Ajax", price: "700DH" },
  { id: 32, img: require("../assets/benfica.jpg"), text: "Benfica", price: "600DH" },
  { id: 33, img: require("../assets/sporting.jpg"), text: "Sporting", price: "600DH" },
  { id: 34, img: require("../assets/porto.jpg"), text: "Porto", price: "600DH" },
  { id: 35, img: require("../assets/fenerbahce.jpg"), text: "Fenerbahce", price: "500DH" }
];

function HorizontalScroll() {
  const navigate = useNavigate();

  const handleItemClick = (productId, productImg, productText, productPrice) => {
    // Vérifiez que vous passez bien tous les paramètres
    navigate(`/produit/${productId}`, { 
      state: { 
        img: productImg, 
        text: productText, 
        price: productPrice 
      } 
    });
  };
  
  



  return (
    <>
    <div className="mainpicture">
        <img src= {require("../assets/victory.jpg")} alt="Victory" />
      </div>
      <h4>Featured Collections</h4>
      <div className="scroll-container">
        <div className="scroll-content">
          {items.map((item) => (
            <div key={item.id} className="scroll-item">
              <img src={item.img} alt={item.text} />
              <p>{item.text}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Carousel Section */}
      <Carousel interval={2000} pause="false" id="carousel">
        <Carousel.Item>
          <img className="d-block w-100" src={require("../assets/cr7.jpg")} alt="First slide" />
          <p className="txt-left">Get Your New Real Madrid Kit</p>
          <p className="des">Just for the original madridistas</p>
          <button className="shop-button">Shop Now</button>
        </Carousel.Item>

        <Carousel.Item>
          <img className="d-block w-100" src={ require( "../assets/messi.jpg") } alt="Second slide" />
          <p className="txt-left">Barcelona X Nike 15/16 Shirt</p>
          <p className="des">Shop the full collection of the barcelonistas</p>
          <button className="shop-button">Shop Now</button>
        </Carousel.Item>

        <Carousel.Item>
            <img className="d-block w-100 bg-dark" src={ require( "../assets/eq.jpg") } alt="Third slide" />
            <p className="txt-left">Champions League Adidas 11/12</p>
            <p className="des">Limited edition design</p>
            <button className="shop-button">Shop Now</button>
        </Carousel.Item>

        <Carousel.Item>
          <img className="d-block w-100" src={ require("../assets/boot.jpg")} alt="Fourth slide" />
          <p className="txt-left">Get Your New Boot</p>
          <p className="des">Limited edition boots</p>
          <div className="flex flex-wrap gap-4 items-center">
                <Button color="primary" variant="bordered">
                  Bordered
                </Button>
          </div>
        </Carousel.Item>
      </Carousel>
      <h4>Top Picks!</h4>
      <div className="scroll-container">
        <div className="scroll-content etage">
          {english.map((kit) => (
          <div key={kit.id} className="scroll-item eme" onClick={() => handleItemClick(kit.id, kit.img, kit.text, kit.price)}>
            <img src={kit.img} alt={kit.text} />
            <p>{kit.text}</p>
          </div>
        ))}

        </div>
      </div>
      <div className="scroll-container">
        <div className="scroll-content etage">
          {spanish.map((kit) => (
            <div key={kit.id} className="scroll-item eme" onClick={() => handleItemClick(kit.id, kit.img, kit.text, kit.price)}>
              <img src={kit.img} alt={kit.text} />
              <p>{kit.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="scroll-container">
        <div className="scroll-content etage">
          {italie.map((kit) => (
            <div key={kit.id} className="scroll-item eme" onClick={() => handleItemClick(kit.id, kit.img, kit.text, kit.price)}>
              <img src={kit.img} alt={kit.text} />
              <p>{kit.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="scroll-container">
        <div className="scroll-content etage">
          {bendisliga.map((kit) => (
            <div key={kit.id} className="scroll-item eme" onClick={() => handleItemClick(kit.id, kit.img, kit.text, kit.price)}>
              <img src={kit.img} alt={kit.text} />
              <p>{kit.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="scroll-container">
        <div className="scroll-content etage">
          {ligue1.map((kit) => (
            <div key={kit.id} className="scroll-item eme" onClick={() => handleItemClick(kit.id, kit.img, kit.text, kit.price)}>
              <img src={kit.img} alt={kit.text} />
              <p>{kit.text}</p>
            </div>
          ))}
        </div>
      </div>
      <div className="scroll-container">
        <div className="scroll-content etage">
          {international.map((kit) => (
            <div key={kit.id} className="scroll-item eme" onClick={() => handleItemClick(kit.id, kit.img, kit.text, kit.price)}>
              <img src={kit.img} alt={kit.text} />
              <p>{kit.text}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default HorizontalScroll;
