import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { useWishlist } from "../wishlist/WishlistContext";
import CustomHeart from "../ui/Heart";
import Tri, { SORT_OPTIONS } from "../Layout/Tri";
import '../../assets/css/Shop.css';

function Shop() {
  const [products, setProducts] = useState([]);
  const [filters, setFilters] = useState({
    categories: [],
    size: "Taille",
    sort: SORT_OPTIONS.RECENT,
    minPrice: 0,
    maxPrice: 3000,
  });

  const navigate = useNavigate();
 const { wishlist, toggleWishlist, isWishlisted } = useWishlist();

  useEffect(() => {
    fetch("http://localhost:3000/api/products/italie")
      .then(res => res.json())
      .then(data => {
        console.log("✅ Data reçue :", data);
        setProducts(data);
      })
      .catch(err => console.error("❌ Erreur Fetch :", err));
  }, []);

  const allCategories = useMemo(() => {
    return [...new Set(products.map(product => product.category || "Uncategorized"))].filter(Boolean);
  }, [products]);

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      categories: allCategories,
    }));
  }, [allCategories]);

  const filteredAndSortedProducts = useMemo(() => {
    let itemsToDisplay = [...products];

    if (filters.categories.length > 0 && filters.categories.length < allCategories.length) {
      itemsToDisplay = itemsToDisplay.filter(product =>
        filters.categories.includes(product.category || "Uncategorized")
      );
    }

    itemsToDisplay = itemsToDisplay.filter(product => {
      const price = parseFloat(product.price) || 0;
      return price >= filters.minPrice && price <= filters.maxPrice;
    });

    switch (filters.sort) {
      case SORT_OPTIONS.PRICE_ASC:
        itemsToDisplay.sort((a, b) => (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0));
        break;
      case SORT_OPTIONS.PRICE_DESC:
        itemsToDisplay.sort((a, b) => (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0));
        break;
      case SORT_OPTIONS.RECENT:
      default:
        break;
    }

    return itemsToDisplay;
  }, [products, filters, allCategories]);

  const handleCategoryChange = (newCategories) => {
    setFilters(prev => ({ ...prev, categories: newCategories }));
  };

  const handleSizeChange = (newSize) => {
    setFilters(prev => ({ ...prev, size: newSize }));
  };

  const handleSortChange = (newSort) => {
    setFilters(prev => ({ ...prev, sort: newSort }));
  };

  const handlePriceChange = ({ min, max }) => {
    setFilters(prev => ({ ...prev, minPrice: min, maxPrice: max }));
  };

  const handleItemClick = (product) => {
    navigate(`/produit/${product.id}`, {
      state: {
        id: product.id,
        img: product.path,
        text: product.text,
        price: product.price,
      }
    });
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 pt-28 md:pt-32 pb-16 overflow-hidden">
      <div className="md:flex md:gap-8 lg:gap-12">
        <aside className="w-full md:w-64 lg:w-72 flex-shrink-0 mb-8 md:mb-0 md:sticky md:top-24 h-full md:max-h-[calc(100vh-8rem)] md:overflow-y-auto custom-scrollbar">
          <Tri
            categories={allCategories}
            selectedCategories={filters.categories}
            selectedSize={filters.size}
            selectedSort={filters.sort}
            currentMinPrice={filters.minPrice}
            currentMaxPrice={filters.maxPrice}
            onCategoryChange={handleCategoryChange}
            onSizeChange={handleSizeChange}
            onSortChange={handleSortChange}
            onPriceChange={handlePriceChange}
          />
        </aside>

        <main className="flex-1">
          <div className="mb-6 text-sm text-gray-600">
            Affichage de {filteredAndSortedProducts.length} produits
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {filteredAndSortedProducts.length > 0 ? (
              filteredAndSortedProducts.map((product) => (
                <div key={product.id} className="product-card group relative">
                  <div className="relative mb-2 aspect-[4/4] overflow-hidden bg-gray-100">
                    <img
                      src={`http://localhost:3000${product.path}`}
                      alt={product.text}
                      onClick={() => handleItemClick(product)}
                      className="w-full h-full object-cover cursor-pointer transition-transform duration-300 ease-in-out group-hover:scale-105"
                    />
                    <div className="absolute top-2 right-2 z-10">
                     <CustomHeart
                       isActive={isWishlisted(product.id)}
                       onClick={(e) => {
                         e.stopPropagation();
                         toggleWishlist(product); 
                       }}
                       className="text-white bg-black/30 hover:bg-black/50 rounded-full p-1.5 transition-colors"
                       size={20}
                     />
                    </div>
                  </div>
                  <div className="text-left">
                    <h3
                      onClick={() => handleItemClick(product)}
                      className="text-sm font-medium text-gray-800 hover:text-black mb-1 cursor-pointer truncate"
                      title={product.text}
                    >
                      {product.text}
                    </h3>
                    <p className="text-sm font-semibold text-black">{product.price} DH</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16 text-gray-500">
                <p>Aucun produit ne correspond à vos critères.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Shop;