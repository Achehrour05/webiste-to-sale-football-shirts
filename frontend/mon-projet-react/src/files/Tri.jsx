import React, { useState, useEffect } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

function Tri({ 
  item, 
  onSortChange, 
  minPrice, 
  maxPrice, 
  setMinPrice, 
  setMaxPrice,
  checkedItems = [],       // Optional (for categories)
  setCheckedItems = () => {},  // Optional (for categories)
  categories = []         // Optional (if empty, hides category filter)
}) {
  const [value, setValue] = useState([minPrice, maxPrice]);
  const [selectedSize, setSelectedSize] = useState("Taille");
  const [selectedCat, setSelectedCat] = useState("recent au ancien");

  // Update slider when min/max price changes
  useEffect(() => {
    setValue([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  // Price range slider handler
  const handleSliderChange = (newValue) => {
    setValue(newValue);
    setMinPrice(newValue[0]);
    setMaxPrice(newValue[1]);
  };

  // Input field handlers for min/max price
  const handleMinPriceChange = (e) => {
    const newMinPrice = Math.max(0, Math.min(Number(e.target.value), maxPrice));
    setMinPrice(newMinPrice);
    setValue([newMinPrice, maxPrice]);
  };

  const handleMaxPriceChange = (e) => {
    const newMaxPrice = Math.max(minPrice, Math.min(Number(e.target.value), 3000));
    setMaxPrice(newMaxPrice);
    setValue([minPrice, newMaxPrice]);
  };

  // Size dropdown handler
  const handleSizeSelect = (event) => {
    setSelectedSize(event.target.value);
  };

  // Category checkbox handler (only if categories exist)
  const handleCheckboxChange = (category) => {
    setCheckedItems(prev => 
      prev.includes(category) 
        ? prev.filter(item => item !== category)
        : [...prev, category]
    );
  };

  // Sorting dropdown handler
  const handleCatSelect = (event) => {
    const cat = event.target.value;
    setSelectedCat(cat);

    let sortedProducts = [...item];
    if (cat === "croissante") {
      sortedProducts.sort((a, b) => 
        parseInt(a.price.replace(' DH', '')) - parseInt(b.price.replace(' DH', ''))
      );
    } else if (cat === "decroissante") {
      sortedProducts.sort((a, b) => 
        parseInt(b.price.replace(' DH', '')) - parseInt(a.price.replace(' DH', ''))
      );
    }

    onSortChange(sortedProducts);
  };

  return (
    <div>
      {/* Only show categories section if categories are provided */}
      {categories.length > 0 && (
        <div className="categories">
          <h6>Catégories de produits</h6>
          {categories.map((category) => (
            <FormControlLabel
              key={category}
              control={
                <Checkbox 
                  checked={checkedItems.includes(category)}
                  onChange={() => handleCheckboxChange(category)}
                />
              }
              label={category}
            />
          ))}
        </div>
      )}

      {/* Price filter (always shown) */}
      <div className="price-filter">
        <h6>Filtrer par prix</h6>
        <div className="input">
          <input
            id="minPrice"
            className="w-full py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            type="number"
            min="0"
            max={maxPrice}
            value={minPrice}
            onChange={handleMinPriceChange}
          />
          <input
            id="maxPrice"
            className="w-full py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            type="number"
            min={minPrice}
            max="3000"
            value={maxPrice}
            onChange={handleMaxPriceChange}
          />
        </div>
        <div className="slider-container">
          <Slider
            range
            min={0}
            max={3000}
            value={value}
            onChange={handleSliderChange}
          />
          <p className="text-default-500 font-medium text-small">
            Budget sélectionné: {minPrice} - {maxPrice} DH
          </p>
        </div>
      </div>

      {/* Size selector (always shown) */}
      <div className="size-selector">
        <FormControl fullWidth>
          <InputLabel id="size-select-label">Choisir la Taille</InputLabel>
          <Select
            labelId="size-select-label"
            id="size-select"
            value={selectedSize}
            label="Choisir la Taille"
            onChange={handleSizeSelect}
          >
            {["Taille", 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48].map((size) => (
              <MenuItem key={size} value={size}>{size}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>

      {/* Sorting dropdown (always shown) */}
      <div className="sort-selector">
        <FormControl fullWidth>
          <InputLabel id="cat-select-label">Trier par</InputLabel>
          <Select
            labelId="cat-select-label"
            id="cat-select"
            value={selectedCat}
            label="Trier par"
            onChange={handleCatSelect}
          >
            {["recent au ancien", "croissante", "decroissante"].map((cat) => (
              <MenuItem key={cat} value={cat}>{cat}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    </div>
  );
}

export default Tri;