import "./Shop.css";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useWishlist } from "./WishlistContext";
import Tri from "./Tri";
import CustomHeart from "./Heart"; 
import { jak } from "./AllJackets";

function Jackets() {
  const { wishlist, toggleWishlist } = useWishlist();
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(3600);
  const [products, setProducts] = useState(jak.ALL);

  // Filter by price
  useEffect(() => {
    setProducts(jak.ALL.filter(item => 
      parseInt(item.price.replace(' DH', '')) >= minPrice && 
      parseInt(item.price.replace(' DH', '')) <= maxPrice
    ));
  }, [minPrice, maxPrice]);

  const navigate = useNavigate();
  const handleItemClick = (productId, productImg, productText, productPrice) => {
    navigate(`/produit/${productId}`, { 
      state: { img: productImg, text: productText, price: productPrice } 
    });
  };

  const handleSortChange = (sortedProducts) => {
    setProducts(sortedProducts);
  };

  return (
    <div className="containerr">
      <div className="left">
        {/* No categories passed (only jackets) */}
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

export default Jackets;