import "./Shop.css";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import Tri from "./Tri";

function Other() {
  const [checkedItems, setCheckedItems] = useState(["Chaussures de football","Kits","Balls"]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3600);
  const [taille, setTaille] = useState(["taille",38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48]);
  const [selectedSize, setSelectedSize] = useState("Taille");
  const [selectedCat, setSelectedCat] = useState("Tri du plus recent au plus ancien");
  const [cat, setCat] = useState(["Tri du plus recent au plus ancien","Tri par prix croissante","Tri par prix decroissante"]);
  const product = [
    { id: 1, img: require("../assets/ajax.jpg"), text: "Ajax", price: "800 DH" },
    { id: 2, img: require("../assets/benfica.jpg"), text: "Benfica", price: "800 DH" },
    { id: 3, img: require("../assets/sporting.jpg"), text: "Sporting", price: "800 DH" },
    { id: 4, img: require("../assets/porto.jpg"), text: "Porto", price: "800 DH" },
    { id: 5, img: require("../assets/fenerbahce.jpg"), text: "Fenerbahce", price: "800 DH" }
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
            <div key={kit.id} className="scroll-item eme" >
              <img src={kit.img} alt={kit.text}  onClick={() => handleItemClick(kit.id, kit.img, kit.text, kit.price)}/>
              <p className="descrip"  onClick={() => handleItemClick(kit.id, kit.img, kit.text, kit.price)}>{kit.text} </p>
              <div className="productinput">
              <button className="button"><span className="p">Choix des option</span></button>
              <span className="heart"><CiHeart /></span>
              </div>
            </div>
          ))}
      </div>
      </div>
    </div>
  );
}

export default Other;
