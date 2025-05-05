import React from 'react';
import './Cardd.css'; // We'll create this CSS file
import { useNavigate } from 'react-router-dom';

// Your original data
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

// --- Calculate number of items for CSS variables ---
const numItems = list.length;
const animationDuration = numItems * 4; // Adjust multiplier for speed (higher = slower)
// ----------------------------------------------------

function Cardd() {
  const navigate = useNavigate();
  // Duplicate items for seamless looping animation
  const duplicatedItems = [...list, ...list];

  const handleClick = (id, productKitImg, productFullName, productPrice) => {
    // Navigate to product page, passing kit image, full text, and price
    navigate(`/produit/${id}`, {
      state: {
        img: productKitImg, // Use the kit image ('image' field)
        text: productFullName, // Use the full name ('text' field)
        price: productPrice    // Pass the price
        // You might want to pass the original 'id' too if it's different from a product ID
        // or potentially other details like the badge ('img') if needed on the next page.
      }
    });
  };

  return (
    // Container with borders and sets CSS variables
    <div
      className="optimal-carousel-container "
      style={{
          '--num-items': numItems,
          '--animation-duration': `${animationDuration}s`,
      }}
    >
      {/* The track contains duplicated items and is animated */}
      <div className="optimal-carousel-track">
        {duplicatedItems.map((club, index) => (
          <div
            className="optimal-club-item" // Renamed class for clarity
            key={`${club.id}-${index}`} // Unique key using original ID and index
            // Pass ALL relevant data to the handler
            onClick={() => handleClick(club.id, club.image, club.text, club.price)}
            title={club.text} // Add tooltip with full name
          >
            {/* Display the club badge */}
            <img src={club.img} alt={club.title} className="optimal-club-badge" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default Cardd;