import React, { useState, useEffect } from "react";
import "./Shop.css";
import { CiHeart } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import { useWishlist } from "./WishlistContext";  // Import the wishlist context
import Heart from "react-heart";
import Tri from "./Tri";

const CustomHeart = ({ isActive, onClick }) => (
  <div
    style={{
      width: "24px",
      cursor: "pointer",
      color: isActive ? "red" : "gray",
      transition: "color 0.3s ease",
    }}
    onClick={onClick}
  >
    {isActive ? "❤️" : <CiHeart />}
  </div>
);

function Shop() {
  const [checkedItems, setCheckedItems] = useState(["Chaussures de football", "Kits", "Balls"]);
  const [value, setValue] = useState([100, 300]);
  const [selectedSize, setSelectedSize] = useState("Taille");
  const [selectedCat, setSelectedCat] = useState("recent au ancien");
  const [minPrice, setMinPrice] = useState(100);
  const [maxPrice, setMaxPrice] = useState(300);
  const [products, setProducts] = useState([]);
  const { wishlist, toggleWishlist } = useWishlist();  // Access wishlist and toggle function

  const product = [
    { id: 1, img: require("../assets/bayern.jpg"), text: "Bayern Munich", price: "100 DH" },
    { id: 2, img: require("../assets/dortmund.jpg"), text: "Brossia Dortmund", price: "400 DH" },
    { id: 3, img: require("../assets/leverkusen.jpg"), text: "Bayern Leverkusen", price: "800 DH" },
    { id: 4, img: require("../assets/liepzig.jpg"), text: "Lipzig", price: "800 DH" },
    { id: 5, img: require("../assets/worlfsburg.jpg"), text: "Worlfsburg", price: "800 DH" },
    { id: 6, img: require("../assets/trosard.jpg"), text: "Arsenal", price: "800 DH" },
    { id: 7, img: require("../assets/garnacho.jpg"), text: "Manchester United", price: "800 DH" },
    { id: 8, img: require("../assets/debruyne.jpg"), text: "Manchester City", price: "800 DH" },
    { id: 9, img: require("../assets/palmer.jpg"), text: "Chelsea", price: "800 DH" },
    { id: 10, img: require("../assets/lv.jpg"), text: "Liverpool", price: "800 DH" },
    { id: 11, img: require("../assets/modric.jpg"), text: "Real Madrid", price: "800 DH" },
    { id: 12, img: require("../assets/bilbao.jpg"), text: "Blibao", price: "800 DH" },
    { id: 13, img: require("../assets/barcelona.jpg"), text: "Barcelona", price: "800 DH" },
    { id: 14, img: require("../assets/athletico.png"), text: "Athletico Madrid", price: "800 DH" },
    { id: 15, img: require("../assets/villareal.jpg"), text: "Villareal", price: "800 DH" },
    { id: 16, img: require("../assets/juventus.jpg"), text: "Juventus", price: "800 DH" },
    { id: 17, img: require("../assets/milan.jpg"), text: "AC Milan", price: "800 DH" },
    { id: 18, img: require("../assets/inter.jpg"), text: "Inter Milan", price: "800 DH" },
    { id: 19, img: require("../assets/atalanta.jpg"), text: "Atalanta", price: "800 DH" },
    { id: 20, img: require("../assets/napoli.jpg"), text: "Napoli", price: "800 DH" },
    { id: 21, img: require("../assets/paris.jpg"), text: "Paris Saint Germain", price: "800 DH" },
    { id: 22, img: require("../assets/monaco.jpg"), text: "Monaco", price: "800 DH" },
    { id: 23, img: require("../assets/marseille.jpg"), text: "Marseille", price: "800 DH" },
    { id: 24, img: require("../assets/lion.jpg"), text: "Olympic Lion", price: "800 DH" },
    { id: 25, img: require("../assets/lile.jpg"), text: "Lile", price: "800 DH" },
    { id: 26, img: require("../assets/ajax.jpg"), text: "Ajax", price: "800 DH" },
    { id: 27, img: require("../assets/benfica.jpg"), text: "Benfica", price: "800 DH" },
    { id: 28, img: require("../assets/sporting.jpg"), text: "Sporting", price: "800 DH" },
    { id: 29, img: require("../assets/porto.jpg"), text: "Porto", price: "800 DH" },
    { id: 30, img: require("../assets/fenerbahce.jpg"), text: "Fenerbahce", price: "800 DH" }
  ];

  useEffect(() => {
    setProducts(product.filter(item => {
      const price = parseInt(item.price.replace(' DH', ''));
      return price >= minPrice && price <= maxPrice;
    }));
  }, [minPrice, maxPrice]);

  const handleSliderChange = (newValue) => {
    setValue(newValue);
    setMinPrice(newValue[0]);
    setMaxPrice(newValue[1]);
  };

  const handleMinPriceChange = (e) => {
    const newMinPrice = Number(e.target.value);
    setMinPrice(newMinPrice);
    setValue([newMinPrice, maxPrice]);
  };

  const handleMaxPriceChange = (e) => {
    const newMaxPrice = Number(e.target.value);
    setMaxPrice(newMaxPrice);
    setValue([minPrice, newMaxPrice]);
  };

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

  const handleSizeSelect = (event) => {
    setSelectedSize(event.target.value);
  };

  const handleSortChange = (sortedProducts) => {
    setProducts(sortedProducts);
  };

  return (
    <div className="containerr">
      <div className="left">
        {/* Passez la fonction de rappel à Tri */}
        <Tri
          item={products}
          onSortChange={handleSortChange}
          minPrice={minPrice}
          maxPrice={maxPrice}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
        />
      </div>

      <div className="right">
        <div className="product">
          {products.map((kit) => (
            <div key={kit.id} className="scroll-item eme">
              <img src={kit.img} alt={kit.text} onClick={() => handleItemClick(kit.id, kit.img, kit.text, kit.price)} />
              <p className="descrip" onClick={() => handleItemClick(kit.id, kit.img, kit.text, kit.price)}>{kit.text}</p>
              <div className="productinput">
                <button className="button"><span className="p">Choix des options</span></button>
                <div style={{ width: "2rem" }}>
                  <CustomHeart
                    isActive={wishlist.some((p) => p.id === kit.id)}
                    onClick={() => toggleWishlist(kit)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Shop;