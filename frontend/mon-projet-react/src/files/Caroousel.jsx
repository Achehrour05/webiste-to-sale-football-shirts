import React from 'react';
import { Carousel } from "react-bootstrap";
import { useNavigate } from 'react-router-dom';

function Caroousel({ handleItemClick }) {
  const navigate = useNavigate();

  // Product data for the first two slides
  const carouselItems = [
    { id: 26, img: require("../assets/modric.jpg"), text: "Real Madrid", price: "800 DH", category: "Kits" },
    { id: 28, img: require("../assets/barcelona.jpg"), text: "Barcelona", price: "800 DH", category: "Kits" },
  ];

  // Carousel slides configuration
  const carouselSlides = [
    { 
      img: require("../assets/cr7.jpg"), 
      title: "Get Your New Real Madrid Kit", 
      subtitle: "Just for the original madridistas",
      type: "product",
      productId: 26 // Links to first item in carouselItems
    },
    { 
      img: require("../assets/messi.jpg"), 
      title: "Barcelona X Nike 15/16 Shirt", 
      subtitle: "Shop the full collection",
      type: "product",
      productId: 28 // Links to second item in carouselItems
    },
    { 
      img: require("../assets/eq.jpg"), 
      title: "Champions League Adidas 11/12", 
      subtitle: "Limited edition design",
      type: "link",
      url: "./Balls" // Custom URL
    },
    { 
      img: require("../assets/boot.jpg"), 
      title: "Premium Football Boots", 
      subtitle: "Performance meets style",
      type: "link",
      url: "./Boots" // Custom URL
    }
  ];

  const handleButtonClick = (slide) => {
    if (slide.type === "product") {
      const product = carouselItems.find(item => item.id === slide.productId);
      if (product) {
        handleItemClick(
          product.id, 
          product.img, 
          product.text, 
          product.price
        );
      }
    } else if (slide.type === "link") {
      navigate(slide.url); // Navigate to custom URL
    }
  };

  return (
    <Carousel
      interval={2000}
      pause={false}
      fade
      indicators={false}
      controls={false}
      className="main-carousel"
    >
      {carouselSlides.map((slide, index) => (
        <Carousel.Item key={index} className="carousel-item">
          <img className="d-block w-100" src={slide.img} alt={slide.title} />
          <Carousel.Caption className="carousel-caption">
            <div className="sponsor-badge">QATAR AIRWAYS</div>
            <h3>{slide.title}</h3>
            <p className="carousel-subtitle">{slide.subtitle}</p>
            
            <button 
              className="shop-button"
              onClick={(e) => {
                e.stopPropagation();
                handleButtonClick(slide);
              }}
            >
              Shop Now
            </button>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
}

export default Caroousel;