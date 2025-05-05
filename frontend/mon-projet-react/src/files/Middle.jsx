// HorizontalScroll.js

import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useRef, useEffect, useCallback } from "react"; // Import hooks
import Card from "./Cardd.jsx";
import Ads from "./Adsss.jsx";
import "./Middle.css"; // Styles will be modified
import { useNavigate } from 'react-router-dom';
import { tab } from "./AllKits.js";
import { boots } from "./AllBoots.js";
import { jak } from "./AllJackets.js";
import { ba } from "./AllBalls.js";
import Caroousel from "./Caroousel.jsx";
import { FaAngleRight } from "react-icons/fa6";
import { FaChevronLeft } from "react-icons/fa6";
import FullWidthVideo from './FullWidthVideo.jsx'

// Simple debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}


function HorizontalScroll() {
  const navigate = useNavigate();
  const scrollContentRef = useRef(null); // Ref for the scrollable div
  const [showPrevArrow, setShowPrevArrow] = useState(false);
  const [showNextArrow, setShowNextArrow] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false); // Track if content overflows

  const handleItemClick = (product) => {
    navigate(`/produit/${product.id}`, {
      state: { /* ...product data */ },
    });
  };

  const allProductArrays = [
    ...(tab?.english ?? []),
    ...(boots?.BOOTS ?? []),
    ...(jak?.jacket ?? []),
    ...(ba?.balls ?? []),
  ];

  const productsForScroll = allProductArrays.map(p => ({
      // ... (mapping logic remains the same)
      id: p.id,
      img: p.img,
      text: p.text || "Product Name",
      price: p.price || "MAD 0.00",
      category: p.category || "Hommes Originals",
      status: p.status || "Nouveau"
  }));

  // --- Arrow Navigation Logic ---

  // Function to check scroll state and update arrows
  const checkArrows = useCallback(() => {
    const container = scrollContentRef.current;
    if (!container) return;

    const scrollLeft = container.scrollLeft;
    const scrollWidth = container.scrollWidth;
    const clientWidth = container.clientWidth;
    const tolerance = 1; // Small tolerance for fractional pixels

    const overflowing = scrollWidth > clientWidth + tolerance;
    setIsOverflowing(overflowing); // Set overflow state

    if (!overflowing) {
      setShowPrevArrow(false);
      setShowNextArrow(false);
      return;
    }

    setShowPrevArrow(scrollLeft > tolerance);
    setShowNextArrow(scrollLeft + clientWidth < scrollWidth - tolerance);
  }, []); // No dependencies needed, relies on ref.current

  // Scroll handler - debounced for performance
  const handleScroll = useCallback(debounce(checkArrows, 50), [checkArrows]);

  // Effect to check arrows on mount and window resize
  useEffect(() => {
    const container = scrollContentRef.current;
    if (container) {
        // Initial check
        checkArrows();

        // Add listener for manual scrolls if any (though overflow-x is hidden)
        // and importantly, for programmatic scrolls ending
        container.addEventListener('scroll', handleScroll);

        // Check on resize
        const debouncedCheck = debounce(checkArrows, 200);
        window.addEventListener('resize', debouncedCheck);

        // Cleanup
        return () => {
            container.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', debouncedCheck);
        };
    }
  }, [checkArrows, handleScroll]); // Add checkArrows & handleScroll dependencies

  // Scroll button handlers
  const handlePrevClick = () => {
    const container = scrollContentRef.current;
    if (container) {
      // Scroll by approx 80% of the container width for a smoother feel
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    }
  };

  const handleNextClick = () => {
    const container = scrollContentRef.current;
    if (container) {
      const scrollAmount = container.clientWidth * 0.8;
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };


  return (
    <>
    <div>
      <FullWidthVideo 
        src={require('../assets/video.mp4')}
        title="Demo Video"
        controls
        autoPlay
        muted
      />
    </div>
      <Card />
      <div className="ads-container">
      <Ads/>
      </div>
      <p className="section-title">RECOMMANDE POUR VOUS</p>

      {/* Scroll Container - needs relative positioning for arrows */}
      <div className="scroll-container with-arrows">
        {/* --- Arrow Buttons (Render conditionally based on overflow and position) --- */}
        {isOverflowing && showPrevArrow && (
            <button
                aria-label="Scroll Previous"
                className="scroll-arrow prev-arrow"
                onClick={handlePrevClick}
            >
              <FaChevronLeft /> 
            </button>
        )}

        {/* Content that no longer scrolls natively */}
        <div className="scroll-content" ref={scrollContentRef}> {/* Attach Ref */}
          {productsForScroll.map((item) => (
            <div
              key={item.id}
              className="scroll-item product-card"
              onClick={() => handleItemClick(item)}
            >
              {/* Image Section */}
              <div className="scroll-item-image-wrapper">
                {/* ... image or placeholder */}
                {item.img ? (
                  <img src={item.img} alt={item.text} className="scroll-item-image" loading="lazy" />
                ) : (
                  <div className="scroll-item-image-placeholder">Image not available</div>
                )}
              </div>
              {/* Details Section */}
              <div className="scroll-item-details">
                {/* ... item details (name, price, category, status) */}
                <p className="item-name">{item.text}</p>
                <p className="item-price">{item.price}</p>
                <p className="item-category">{item.category}</p>
                <p className="item-status">{item.status}</p>
              </div>
            </div>
          ))}
        </div>

        {isOverflowing && showNextArrow && (
            <button
                aria-label="Scroll Next"
                className="scroll-arrow next-arrow"
                onClick={handleNextClick}
            >
                  <FaAngleRight />
            </button>
        )}
      </div>
    </>
  );
}

export default HorizontalScroll;