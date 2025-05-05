// src/components/Tri.jsx

import React, { useState, useEffect, useMemo } from "react";
import Slider from 'rc-slider';
import debounce from 'lodash.debounce';
import 'rc-slider/assets/index.css';
import './Tri.css'; // Styles specific to Tri (slider, checkbox overrides)

// Define SORT OPTIONS constants for clarity and maintainability
export const SORT_OPTIONS = {
    RECENT: 'recent',      // Consider if you have a 'dateAdded' property for this
    PRICE_ASC: 'price_asc',
    PRICE_DESC: 'price_desc',
};

// Define Default/Placeholder Size Options
const DEFAULT_SIZE_OPTIONS = ["Taille", "S", "M", "L", "XL", 38, 39, 40, 41, 42, 43, 44, 45];


function Tri({
  // Filter Options (data to display choices)
  categories = [],
  availableSizes = DEFAULT_SIZE_OPTIONS, // Allow overriding default sizes
  minPriceLimit = 0,
  maxPriceLimit = 3000,

  // Current Selections (controlled by parent)
  selectedCategories = [],
  selectedSize = "Taille",
  selectedSort = SORT_OPTIONS.RECENT,
  currentMinPrice = minPriceLimit,
  currentMaxPrice = maxPriceLimit,

  // Callback Functions (notify parent of changes)
  onCategoryChange = () => {},
  onSizeChange = () => {},
  onSortChange = () => {},
  onPriceChange = () => {},
}) {

  // --- Internal State for delayed updates (avoids rapid callbacks) ---
  const [internalMinPrice, setInternalMinPrice] = useState(currentMinPrice);
  const [internalMaxPrice, setInternalMaxPrice] = useState(currentMaxPrice);

  // Keep internal state synced with props if parent updates them externally
  useEffect(() => { setInternalMinPrice(currentMinPrice); }, [currentMinPrice]);
  useEffect(() => { setInternalMaxPrice(currentMaxPrice); }, [currentMaxPrice]);

  // --- Debounced Handler for Price Changes ---
  const debouncedPriceHandler = useMemo(
    () => debounce((min, max) => {
      onPriceChange({ min, max }); // Call parent only after debounce time
    }, 500), // 500ms delay
    [onPriceChange] // Only recreate if the callback prop itself changes
  );

  // --- Event Handlers ---
  const handleCategoryToggle = (category) => {
    const newSelection = selectedCategories.includes(category)
      ? selectedCategories.filter(item => item !== category)
      : [...selectedCategories, category];
    onCategoryChange(newSelection);
  };

  const handlePriceSliderChange = (newValue) => {
    const [newMin, newMax] = newValue;
    // Update internal state immediately for responsiveness
    setInternalMinPrice(newMin);
    setInternalMaxPrice(newMax);
    // Call the debounced handler to notify parent
    debouncedPriceHandler(newMin, newMax);
  };

  const handleMinPriceInputChange = (e) => {
    const value = Math.max(minPriceLimit, Math.min(Number(e.target.value), internalMaxPrice));
    setInternalMinPrice(value);
    debouncedPriceHandler(value, internalMaxPrice);
  };

  const handleMaxPriceInputChange = (e) => {
     const value = Math.min(maxPriceLimit, Math.max(Number(e.target.value), internalMinPrice));
    setInternalMaxPrice(value);
    debouncedPriceHandler(internalMinPrice, value);
  };

  // Handlers for Size and Sort simply call the callback with the new value
  const handleSizeSelect = (e) => onSizeChange(e.target.value);
  const handleSortSelect = (e) => onSortChange(e.target.value);


  // --- Component Rendering ---
  return (
    // Apply modern sidebar styling using Tailwind
    <div className="w-full bg-white space-y-6 p-4 md:p-6 border-r border-gray-200 h-full">

      {/* Categories Filter */}
      {categories.length > 0 && (
        <div className="filter-section border-b border-gray-100 pb-5">
          <h6 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Catégories</h6>
          <div className="space-y-2">
            {categories.map((category) => (
              <label key={category} className="flex items-center text-sm text-gray-700 hover:text-black transition-colors cursor-pointer group">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => handleCategoryToggle(category)}
                  className="custom-checkbox h-4 w-4 rounded border-gray-300 text-black focus:ring-black mr-3 transition duration-150 ease-in-out"
                />
                {category}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Price Filter */}
      <div className="filter-section border-b border-gray-100 pb-5">
        <h6 className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wider">Prix</h6>
        <div className="mb-4 px-1"> {/* Padding allows slider handles not to be clipped */}
           <Slider
              range
              min={minPriceLimit}
              max={maxPriceLimit}
              value={[internalMinPrice, internalMaxPrice]}
              onChange={handlePriceSliderChange}
              // Class names connect to Tri.css for handle/track styles
              className="nike-adidas-slider" // Add a specific class
           />
        </div>
        <div className="flex items-center justify-between space-x-2 text-sm">
          <div className="relative">
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Min</span>
             <input
              type="number"
              value={internalMinPrice}
              min={minPriceLimit}
              max={internalMaxPrice}
              onChange={handleMinPriceInputChange}
              className="w-full pl-8 pr-2 py-1 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-xs appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              aria-label="Minimum Price"
            />
          </div>
          <span className="text-gray-400 text-xs">–</span>
          <div className="relative">
             <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">Max</span>
            <input
              type="number"
              value={internalMaxPrice}
              min={internalMinPrice}
              max={maxPriceLimit}
              onChange={handleMaxPriceInputChange}
              className="w-full pl-8 pr-2 py-1 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-xs appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              aria-label="Maximum Price"
            />
          </div>
           <span className="text-gray-600 text-xs">DH</span>
        </div>
      </div>

      {/* Size Filter */}
       {availableSizes.length > 1 && (
        <div className="filter-section border-b border-gray-100 pb-5">
          <h6 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Taille</h6>
          <div className="relative">
             <select
                id="size-select"
                value={selectedSize}
                onChange={handleSizeSelect}
                className="custom-select block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition text-sm"
             >
               {availableSizes.map((size) => (
                <option key={size} value={size} disabled={size === "Taille"}>
                    {size === "Taille" ? "Sélectionner..." : (typeof size === 'number' ? `EU ${size}` : size)}
                </option>
               ))}
             </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.516 7.548c.436-.446 1.045-.481 1.576 0L10 10.405l2.908-2.857c.531-.481 1.141-.446 1.576 0 .436.445.408 1.197 0 1.642l-3.417 3.357c-.27.273-.624.388-.984.388s-.714-.115-.984-.388l-3.417-3.357c-.408-.445-.436-1.197 0-1.642z"/></svg>
             </div>
          </div>
        </div>
       )}

      {/* Sort By Filter */}
      <div className="filter-section">
         <h6 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wider">Trier Par</h6>
         <div className="relative">
           <select
              id="sort-select"
              value={selectedSort}
              onChange={handleSortSelect}
              className="custom-select block w-full appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 focus:ring-1 focus:ring-gray-500 transition text-sm"
           >
             <option value={SORT_OPTIONS.RECENT}>Le plus récent</option>
             <option value={SORT_OPTIONS.PRICE_ASC}>Prix : Croissant</option>
             <option value={SORT_OPTIONS.PRICE_DESC}>Prix : Décroissant</option>
           </select>
           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M5.516 7.548c.436-.446 1.045-.481 1.576 0L10 10.405l2.908-2.857c.531-.481 1.141-.446 1.576 0 .436.445.408 1.197 0 1.642l-3.417 3.357c-.27.273-.624.388-.984.388s-.714-.115-.984-.388l-3.417-3.357c-.408-.445-.436-1.197 0-1.642z"/></svg>
           </div>
        </div>
      </div>
    </div>
  );
}

export default Tri;