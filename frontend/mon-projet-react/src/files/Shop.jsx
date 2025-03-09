import "./Shop.css";
import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import { useEffect } from "react";
import { CiHeart } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';

function Shop() {
  const [checkedItems, setCheckedItems] = useState(["Chaussures de football","Kits","Balls"]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3600);
  const [taille, setTaille] = useState(["taille",38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48]);
  const [selectedSize, setSelectedSize] = useState("Taille");
  const [selectedCat, setSelectedCat] = useState("Tri du plus recent au plus ancien");
  const [cat, setCat] = useState(["Tri du plus recent au plus ancien","Tri par prix croissante","Tri par prix decroissante"]);
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

  return (
    <div className="containerr">
      <div className="left">
        <div className="categories">
        <h6>Product Categories</h6>
        {checkedItems.map((x) => (
          <label key={x.id} style={{ display: "block", marginBottom: "5px" }}  >
            <input type="checkbox" />
            {x}
          </label>
        ))}
        </div>

        <h6>Filter by price</h6>
        <div className="input">
          <input className="text" type="number" min="0" max="3600" value={minPrice} onChange={handleMinPriceChange} />
          <input className="text" type="number" min="0" max="3600" value={maxPrice} onChange={handleMaxPriceChange} />
        </div>
        <div className="input">
          <input className="change" type="range" min="0" max="3600" value={minPrice} onChange={handleMinPriceChange} />
          <input className="change" type="range" min="0" max="3600" value={maxPrice} onChange={handleMaxPriceChange} />
        </div>

        <div className="dropdown marg">
          <button className="btn btn1 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            {selectedSize} 
          </button>
          <ul className="dropdown-menu">
            {taille.map((t, index) => (
              <li key={index}>
                <button className="dropdown-item btn2" onClick={() => handleSizeSelect(t)}>
                  {t}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="dropdown">
          <button className="btn btn1 dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
            {selectedCat} 
          </button>
          <ul className="dropdown-menu">
            {cat.map((t, index) => (
              <li key={index}>
                <button className="dropdown-item btn2" onClick={() => handleCatSelect(t)}>
                  {t}
                </button>
              </li>
            ))}
          </ul>
        </div>
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

export default Shop;
