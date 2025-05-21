import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState, useRef, useEffect, useCallback } from "react";
import Card from "./Cardd.jsx";
import Ads from "./Adsss.jsx";
import "./Middle.css";
import { useNavigate } from 'react-router-dom';
import { FaAngleRight, FaChevronLeft } from "react-icons/fa6";
import FullWidthVideo from './FullWidthVideo.jsx';
import { fetchAndFormatProducts } from '../utils/fetchProducts';

// debounce helper
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export default function HorizontalScroll() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const scrollContentRef = useRef(null);
  const [showPrevArrow, setShowPrevArrow] = useState(false);
  const [showNextArrow, setShowNextArrow] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    fetchAndFormatProducts("http://localhost:3000/api/products/all?limit=17")
      .then(setProducts);
  }, []);

  const handleItemClick = (product) => {
    navigate(`/produit/${product.id}`);
  };

  const checkArrows = useCallback(() => {
    const c = scrollContentRef.current;
    if (!c) return;
    const { scrollLeft, scrollWidth, clientWidth } = c;
    const tol = 1;
    const overflowing = scrollWidth > clientWidth + tol;
    setIsOverflowing(overflowing);
    if (!overflowing) {
      setShowPrevArrow(false);
      setShowNextArrow(false);
    } else {
      setShowPrevArrow(scrollLeft > tol);
      setShowNextArrow(scrollLeft + clientWidth < scrollWidth - tol);
    }
  }, []);

  const handleScroll = useCallback(debounce(checkArrows, 50), [checkArrows]);

  useEffect(() => {
    const c = scrollContentRef.current;
    if (!c) return;
    checkArrows();
    c.addEventListener('scroll', handleScroll);
    const onResize = debounce(checkArrows, 200);
    window.addEventListener('resize', onResize);
    return () => {
      c.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', onResize);
    };
  }, [checkArrows, handleScroll]);

  const scrollByAmount = (dir) => {
    const c = scrollContentRef.current;
    if (c) c.scrollBy({ left: dir * c.clientWidth * 0.8, behavior: 'smooth' });
  };

  return (
    <>
      <FullWidthVideo src={require('../assets/video.mp4')} title="Demo Video" controls autoPlay muted />
      <Card />
      <div className="ads-container"><Ads/></div>
      <p className="section-title mb-5">RECOMMANDÉ POUR VOUS</p>
      <div className="scroll-container with-arrows mt-0">
        {isOverflowing && showPrevArrow && (
          <button className="scroll-arrow prev-arrow bg-" onClick={() => scrollByAmount(-1)}>
            <FaChevronLeft/>
          </button>
        )}
        <div className="scroll-content" ref={scrollContentRef}>
          {products.map(item => (
            <div
              key={item.id}
              className="scroll-item product-card"
              onClick={() => handleItemClick(item)}
            >
              <div className="scroll-item-image-wrapper">
                {item.img
                  ? <img src={item.img} alt={item.text} className="scroll-item-image" loading="lazy"/>
                  : <div className="scroll-item-image-placeholder">Image not available</div>
                }
              </div>
              <div className="scroll-item-details">
                <p className="item-name">{item.text}</p>
                <p className="item-price">{item.price}</p>
                <p className="item-category">{item.category}</p>
                <p className="item-status">{item.status}</p>
              </div>
            </div>
          ))}
        </div>
        {isOverflowing && showNextArrow && (
          <button className="scroll-arrow next-arrow" onClick={() => scrollByAmount(1)}>
            <FaAngleRight/>
          </button>
        )}
      </div>
    </>
  );
}
