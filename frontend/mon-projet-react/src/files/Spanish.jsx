import "./Shop.css";
import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useNavigate } from 'react-router-dom';
import { useWishlist } from "./WishlistContext";  // Import the wishlist context
import Tri from "./Tri";
import CustomHeart from "./Heart"; 
import { tab } from "./AllKits";  // Import the shared product list

function Germain() {
  const { wishlist, toggleWishlist } = useWishlist();  // Access wishlist and toggle function
  const [checkedItems, setCheckedItems] = useState(["Chaussures de football", "Kits", "Balls"]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3600);
  const [taille, setTaille] = useState(["taille", 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48]);
  const [selectedSize, setSelectedSize] = useState("Taille");
  const [selectedCat, setSelectedCat] = useState("Tri du plus recent au plus ancien");
  const [cat, setCat] = useState(["Tri du plus recent au plus ancien", "Tri par prix croissante", "Tri par prix decroissante"]);
  const [products, setProducts] = useState(tab.germain);  // Use the shared product list for Germain

  const handleMinPriceChange = (e) => {
    setMinPrice(Number(e.target.value));
  };

  const handleMaxPriceChange = (e) => setMaxPrice(Number(e.target.value));

  const handleSizeSelect = (size) => {
    setSelectedSize(size);
  };

  const handleCatSelect = (cat) => {
    setSelectedCat(cat);

    if (cat === "Tri par prix croissante") {
      setProducts([...tab.spanish].sort((a, b) => parseInt(a.price) - parseInt(b.price)));
    } else if (cat === "Tri par prix decroissante") {
      setProducts([...tab.spanish].sort((a, b) => parseInt(b.price) - parseInt(a.price)));
    } else {
      setProducts(tab.spanish);
    }
  };

  useEffect(() => {
    setProducts(tab.spanish.filter(item => parseInt(item.price) >= minPrice && parseInt(item.price) <= maxPrice));
  }, [minPrice, maxPrice]);

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

  const handleSortChange = (sortedProducts) => {
    setProducts(sortedProducts);
  };

  return (
    <div className="containerr">
      <div className="left">
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
                <div style={{ width: "2rem" }} className="heart">
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

export default Germain;