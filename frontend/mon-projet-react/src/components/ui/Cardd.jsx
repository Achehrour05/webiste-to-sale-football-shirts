
/*import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const list = [
  { id: 1, title: 'R.Madrid', img: require("../assets/Real-Madrid-football-club-badge-removebg-preview.png"), image: require("../assets/modric.jpg"), text: "Real Madrid", price: "800 DH" },
  { id: 2, title: 'PSG', img: require("../assets/paris-saint-germain-PSG-logo-design-removebg-preview.png"), image: require("../assets/paris.jpg"), text: "Paris Saint Germain", price: "800 DH" },
  { id: 3, title: 'Juventus', img: require("../assets/old-Juventus-logo-design-removebg-preview.png"), image: require("../assets/juventus.jpg"), text: "Juventus", price: "800 DH" },
  { id: 4, title: 'MUN', img: require("../assets/Manchester-United-logo-removebg-preview.png"), image: require("../assets/garnacho.jpg"), text: "Manchester United", price: "800 DH" },
  { id: 5, title: 'Liverpool', img: require("../assets/liverpool-football-club-logo-design-removebg-preview.png"), image: require("../assets/lv.jpg"), text: "Liverpool", price: "800 DH" },
  { id: 6, title: 'Inter Milan', img: require("../assets/Inter-Milan-football-club-logo-removebg-preview.png"), image: require("../assets/inter.jpg"), text: "Inter Milan", price: "800 DH" },
  { id: 7, title: 'Barcelona', img: require("../assets/FC-Barcelona-logo-design-removebg-preview.png"), image: require("../assets/barcelona.jpg"), text: "Barcelona", price: "800 DH" },
  { id: 8, title: 'Chelsea', img: require("../assets/chelsea-logo-design-removebg-preview.png"), image: require("../assets/palmer.jpg"), text: "Chelsea", price: "400 DH" }
];

const SLIDE_HEIGHT_PX = 100;
const SLIDE_WIDTH_PX = 200; 
const GRADIENT_WIDTH_PERCENT = 15; 
const MAX_GRADIENT_WIDTH_PX = 150;

function Cardd() {
  const navigate = useNavigate();
  
  const teamLogosData = list.map(club => ({
    id: club.id,
    src: club.img,
    alt: club.title,
    fullText: club.text,
    kitImage: club.image,
    price: club.price
  }));

  const duplicatedTeamLogos = [...teamLogosData, ...teamLogosData];

  const numUniqueSlides = teamLogosData.length;
  const animationSpeedSeconds = numUniqueSlides * 4.5; 

  useEffect(() => {
    const styleElementId = 'dynamic-teamlogo-keyframes';
    let styleElement = document.getElementById(styleElementId);

    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = styleElementId;
      document.head.appendChild(styleElement);
    }
    
    const keyframesRule = `
      @keyframes scrollTeamLogos {
        0% { transform: translateX(0); }
        100% { transform: translateX(calc(-${SLIDE_WIDTH_PX}px * ${numUniqueSlides})); }
      }
    `;
    
    styleElement.innerHTML = keyframesRule;

    return () => {
      const el = document.getElementById(styleElementId);
      if (el) {
      }
    };

  }, [numUniqueSlides]); 

  const handleClick = (clubData) => {
    navigate(`/produit/${clubData.id}`, {
      state: {
        img: clubData.kitImage,
        text: clubData.fullText,
        price: clubData.price,
      }
    });
  };

  return (
    <div 
      className="bg-[#ffe9e4] shadow-lg mx-auto overflow-hidden relative mt-[30px] w-full border border-red"
      style={{ height: `${SLIDE_HEIGHT_PX}px` }}
    >
      <div 
        className="absolute top-0 left-0 z-10 h-full bg-gradient-to-r from-[#ffe9e4] via-[#ffe9e4] to-transparent"
        style={{ width: `${GRADIENT_WIDTH_PERCENT}%`, maxWidth: `${MAX_GRADIENT_WIDTH_PX}px` }}
      ></div>
      
      <div 
        className="absolute top-0 right-0 z-10 h-full bg-gradient-to-l from-[#ffe9e4] via-[#ffe9e4] to-transparent"
        style={{ width: `${GRADIENT_WIDTH_PERCENT}%`, maxWidth: `${MAX_GRADIENT_WIDTH_PX}px` }}
      ></div>

      <div
        className="flex animate-scrollTeamLogos" 
        style={{
          width: `calc(${SLIDE_WIDTH_PX}px * ${numUniqueSlides * 2})`,
          animationDuration: `${animationSpeedSeconds}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
        }}
      >
        {duplicatedTeamLogos.map((club, index) => (
          <div
            key={`${club.id}-${index}`}
            className="flex items-center justify-center shrink-0 cursor-pointer px-2.5 box-border" // shrink-0 est important
            style={{ 
                height: `${SLIDE_HEIGHT_PX}px`, 
                width: `${SLIDE_WIDTH_PX}px` 
            }}
            onClick={() => handleClick(club)}
            title={club.fullText}
          >
            <img 
              src={club.src} 
              alt={club.alt} 
              className="max-h-[70%] max-w-[80%] object-contain" 
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cardd;
*/