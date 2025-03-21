import "./Shop.css";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { useWishlist } from "./WishlistContext";  // Import the wishlist context
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
    {isActive ? "❤️" : <CiHeart/>}
  </div>
);

function English() {
   const { wishlist, toggleWishlist } = useWishlist();  // Access wishlist and toggle function
  const [checkedItems, setCheckedItems] = useState(["Chaussures de football","Kits","Balls"]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3600);
  const [taille, setTaille] = useState(["taille",38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48]);
  const [selectedSize, setSelectedSize] = useState("Taille");
  const [selectedCat, setSelectedCat] = useState("Tri du plus recent au plus ancien");
  const [cat, setCat] = useState(["Tri du plus recent au plus ancien","Tri par prix croissante","Tri par prix decroissante"]);
  const product = [
    { id: 1, img: require("../assets/trosard.jpg"), text: "Arsenal", price: "800 DH" },
    { id: 2, img: require("../assets/garnacho.jpg"), text: "Manchester United", price: "800 DH" },
    { id: 3, img: require("../assets/debruyne.jpg"), text: "Manchester City", price: "800 DH" },
    { id: 4, img: require("../assets/palmer.jpg"), text: "Chelsea", price: "800 DH" },
    { id: 5, img: require("../assets/lv.jpg"), text: "Liverpool", price: "800 DH" },
  ];

  
  const handleMinPriceChange = (e) => {
    setMinPrice(Number(e.target.value));
  }
  const handleMaxPriceChange = (e) => setMaxPrice(Number(e.target.value));

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const [products, setProducts] = useState(product);
  const handleCatSelect = (cat) => {
    setSelectedCat(cat);

    if (cat === "Tri par prix croissante") {
        setProducts([...product].sort((a, b) => 
            parseInt(a.price) - parseInt(b.price)
        )) 
    } 
    else if (cat === "Tri par prix decroissante") {
      setProducts([...product].sort((a, b) => 
        parseInt(b.price) - parseInt(a.price)
    )) 
    } 
    else{
      setProducts(product)
    }
  
};


useEffect(() => {
  setProducts(product.filter(item => parseInt(item.price) >= minPrice && parseInt(item.price) <= maxPrice));
}, [minPrice, maxPrice]);




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

  const sortedByPriceCroi = [...product].sort((a, b) => 
    parseInt(a.price) - parseInt(b.price)
);
const handleSortChange = (sortedProducts) => {
  setProducts(sortedProducts);
};
  return (
    <div className="containerr">
      <divddddddddddddd className="left">
      <Tri
          item={products}
          onSortChange={handleSortChange}
          minPrice={minPrice}
          maxPrice={maxPrice}
          setMinPrice={setMinPrice}
          setMaxPrice={setMaxPrice}
        />
      </divddddddddddddd>
      <div className="right">
        <div className="product">
          {products.map((kit) => (
            <div key={kit.id} className="scroll-item eme" >
              <img src={kit.img} alt={kit.text}  onClick={() => handleItemClick(kit.id, kit.img, kit.text, kit.price)}/>
              <p className="descrip"  onClick={() => handleItemClick(kit.id, kit.img, kit.text, kit.price)}>{kit.text} </p>
              <div className="productinput">
                <button className="button"><span className="p">Choix des option</span></button>
                <div style={{ width: "2rem" }}>
                  <CustomHeart
                    isActive={wishlist.some((p) => p.id === kit.id)} // Check if product is in wishlist
                    onClick={() => toggleWishlist(kit)} // Toggle wishlist
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

export default English;
