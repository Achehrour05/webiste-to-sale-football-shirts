import React from "react";
import { useWishlist } from "./WishlistContext";
import "./Wishlist.css"
import { useNavigate } from 'react-router-dom';

const Wishlist = () => {
  const { wishlist } = useWishlist();

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

  return (
    <div className="wishlist-container">
      <h2>Your Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>No products in wishlist</p>
      ) : (
        <div className="wishlist-items">
          {wishlist.map((item) => (
            <div className="wishlist-item" key={item.id}>
             <img src={item.img} alt={item.text} onClick={() => handleItemClick(item.id, item.img, item.text, item.price)} />
             <p className="descrip" onClick={() => handleItemClick(item.id, item.img, item.text, item.price)}>{item.text}</p>
              <p>{item.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;