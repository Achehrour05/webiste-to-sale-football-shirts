// src/pages/Shop.jsx (example path)

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from 'react-router-dom';
import { useWishlist } from "./WishlistContext"; // Adjust path if needed
import CustomHeart from "./Heart"; // Adjust path if needed
import Tri, { SORT_OPTIONS } from "./Tri"; // Import Tri and SORT_OPTIONS
import { tab } from "./AllKits"; // Adjust path if needed
import './Shop.css'; // Consolidated Shop CSS

// --- Data Preparation ---
// Flatten all products from different categories/types
const allProducts = Object.values(tab.italie).flat();
// Get unique category names
const allCategories = [...new Set(allProducts.map(product => product.category || "Uncategorized"))].filter(Boolean);
// (Add logic to get available sizes if needed, otherwise default will be used in Tri)

// --- Main Shop Component ---
function Shop() {
  const navigate = useNavigate();
  const { wishlist, toggleWishlist } = useWishlist();

  // --- Centralized Filter State ---
  const [filters, setFilters] = useState({
    categories: allCategories, // Start with all categories selected
    size: "Taille",           // Default size selection
    sort: SORT_OPTIONS.RECENT,// Default sort
    minPrice: 0,             // Default min price
    maxPrice: 3000,           // Default max price
  });

  // --- Filter & Sort Logic using useMemo ---
  const filteredAndSortedProducts = useMemo(() => {
    let itemsToDisplay = [...allProducts]; // Start with all products

    // 1. Filter by Category
    if (filters.categories.length < allCategories.length) { // Filter only if not all are selected
       itemsToDisplay = itemsToDisplay.filter(product =>
        filters.categories.includes(product.category || "Uncategorized")
      );
    }

    // 2. Filter by Price
    itemsToDisplay = itemsToDisplay.filter(product => {
      // Handle potential price parsing errors gracefully
      const price = parseInt(String(product.price).replace(/[^0-9]/g, ''), 10); // More robust parsing
      if (isNaN(price)) return false; // Exclude items with unparsable prices
      return price >= filters.minPrice && price <= filters.maxPrice;
    });

    // 3. Filter by Size (Basic Example - Adjust if sizes are arrays, etc.)
    if (filters.size !== "Taille") {
        itemsToDisplay = itemsToDisplay.filter(product => {
            // This assumes product has a 'size' property or 'sizes' array
            // Adjust this logic based on your actual product data structure!
            if (Array.isArray(product.sizes)) {
                return product.sizes.map(s => String(s)).includes(String(filters.size));
            } else if (product.size) {
                 return String(product.size) === String(filters.size);
            }
            return false; // Or true if size doesn't apply to this product type
        });
    }

    // 4. Sort
    switch (filters.sort) {
      case SORT_OPTIONS.PRICE_ASC:
        itemsToDisplay.sort((a, b) => {
          const priceA = parseInt(String(a.price).replace(/[^0-9]/g, ''), 10) || 0;
          const priceB = parseInt(String(b.price).replace(/[^0-9]/g, ''), 10) || 0;
          return priceA - priceB;
        });
        break;
      case SORT_OPTIONS.PRICE_DESC:
        itemsToDisplay.sort((a, b) => {
          const priceA = parseInt(String(a.price).replace(/[^0-9]/g, ''), 10) || 0;
          const priceB = parseInt(String(b.price).replace(/[^0-9]/g, ''), 10) || 0;
          return priceB - priceA;
        });
        break;
      case SORT_OPTIONS.RECENT:
      default:
        // Keep original order or sort by a 'dateAdded' property if you have one
        // itemsToDisplay.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
        break;
    }

    return itemsToDisplay;
  }, [allProducts, filters]); // Re-run only when allProducts or filters change


  // --- Handlers to Update Filter State ---
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

  // --- Navigation Handler ---
  const handleItemClick = (product) => {
    navigate(`/produit/${product.id}`, {
      state: { // Pass relevant product data
        id: product.id,
        img: product.img,
        text: product.text,
        price: product.price,
        // Pass other details needed on the product page
      }
    });
  };

  // --- Component Rendering ---
  return (
    // Use Tailwind for main layout - Sidebar pushes content on medium+ screens
    <div className="container mx-auto px-4 pt-28 md:pt-32 pb-16"> {/* Adjust top padding */}
      <div className="md:flex md:gap-8 lg:gap-12">

        {/* Left Sidebar (Filters) - Sticky on large screens */}
        <aside className="w-full md:w-64 lg:w-72 flex-shrink-0 mb-8 md:mb-0 md:sticky md:top-24 h-full md:max-h-[calc(100vh-8rem)] md:overflow-y-auto custom-scrollbar"> {/* Adjust top offset */}
           <Tri
                categories={allCategories}
                // availableSizes={/* Pass dynamic sizes if needed */}
                selectedCategories={filters.categories}
                selectedSize={filters.size}
                selectedSort={filters.sort}
                currentMinPrice={filters.minPrice}
                currentMaxPrice={filters.maxPrice}
                onCategoryChange={handleCategoryChange}
                onSizeChange={handleSizeChange}
                onSortChange={handleSortChange}
                onPriceChange={handlePriceChange}
                // Pass price limits if different from defaults
                // minPriceLimit={0}
                // maxPriceLimit={5000}
           />
        </aside>

        {/* Right Content Area (Products) */}
        <main className="flex-1">
          {/* Optional: Header for product count or sorting display */}
           <div className="mb-6 text-sm text-gray-600">
            Affichage de {filteredAndSortedProducts.length} produits
          </div>

          {/* Product Grid */}
           <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8">
            {filteredAndSortedProducts.length > 0 ? (
              filteredAndSortedProducts.map((product) => (
                // Product Card Component (Example Structure)
                 <div key={product.id} className="product-card group relative">
                   <div className="relative mb-2 aspect-[4/4] overflow-hidden bg-gray-100"> {/* Aspect ratio helper */}
                     <img
                       src={product.img}
                       alt={product.text}
                       onClick={() => handleItemClick(product)}
                       className="w-70 h-100 object-cover cursor-pointer transition-transform duration-300 ease-in-out group-hover:scale-105"
                     />
                      {/* Wishlist Button Overlay */}
                     <div className="absolute top-2 right-2 z-10">
                        <CustomHeart
                          isActive={wishlist.some((p) => p.id === product.id)}
                          onClick={(e) => {
                              e.stopPropagation(); // Prevent triggering card click
                              toggleWishlist(product);
                          }}
                          className="text-white bg-black/30 hover:bg-black/50 rounded-full p-1.5 transition-colors" // Base style, adjust as needed in Heart.jsx
                          size={20}
                       />
                     </div>
                    </div>
                    {/* Product Info */}
                    <div className="text-left">
                       <h3
                        onClick={() => handleItemClick(product)}
                        className="text-sm font-medium text-gray-800 hover:text-black mb-1 cursor-pointer truncate"
                        title={product.text} // Tooltip for long names
                      >
                         {product.text}
                       </h3>
                       {/* Add category if needed */}
                       {/* <p className="text-xs text-gray-500 mb-1.5">{product.category}</p> */}
                       <p className="text-sm font-semibold text-black">{product.price}</p>
                       {/* Optional "Quick Add" / Options button can go here */}
                        {/* Example button styling */}
                        {/* <button className="mt-2 w-full bg-black text-white py-1.5 text-xs font-medium rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
                            Quick Add
                         </button> */}
                    </div>
                 </div>
              ))
            ) : (
              // No Products Message
              <div className="col-span-full text-center py-16 text-gray-500">
                <p>Aucun produit ne correspond à vos critères.</p>
                {/* Optional: Add a button to reset filters */}
              </div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
}

export default Shop;