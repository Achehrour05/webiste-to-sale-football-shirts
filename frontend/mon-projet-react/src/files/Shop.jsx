import React, { useState, useEffect } from "react";
import "./Shop.css";
import { useNavigate } from 'react-router-dom';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import { useWishlist } from "./WishlistContext";
import CustomHeart from "./Heart";
import Tri from "./Tri";
import { all } from "./AllProducts.js";

// Get all products and categories
const allProducts = Object.values(all).flat();
const categories = [...new Set(allProducts.map(product => product.category))];

function Shop() {
  const [checkedItems, setCheckedItems] = useState(categories);
  const [minPrice, setMinPrice] = useState(100);
  const [maxPrice, setMaxPrice] = useState(3000);
  const [products, setProducts] = useState([]);
  const { wishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    const filteredProducts = allProducts.filter(item => {
      const price = parseInt(item.price.replace(' DH', ''));
      return (
        price >= minPrice && 
        price <= maxPrice &&
        checkedItems.includes(item.category)
      );
    });
    setProducts(filteredProducts);
  }, [minPrice, maxPrice, checkedItems]);

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
          checkedItems={checkedItems}
          setCheckedItems={setCheckedItems}
          categories={categories}
        />
      </div>

      <div className="right">
        <div className="product">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="scroll-item eme">
                <img 
                  src={product.img} 
                  alt={product.text} 
                  onClick={() => handleItemClick(product.id, product.img, product.text, product.price)} 
                  style={{ cursor: 'pointer' }}
                />
                <p 
                  className="descrip" 
                  onClick={() => handleItemClick(product.id, product.img, product.text, product.price)}
                  style={{ cursor: 'pointer' }}
                >
                  {product.text}
                </p>
                <p className="price">{product.price}</p>
                <div className="productinput">
                  <button className="button">
                    <span className="p">Choix des options</span>
                  </button>
                  <div style={{ width: "2rem" }} className="heart">
                    <CustomHeart
                      isActive={wishlist.some((p) => p.id === product.id)}
                      onClick={() => toggleWishlist(product)}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="no-products">
              <p>Aucun produit ne correspond à vos critères de recherche.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop;