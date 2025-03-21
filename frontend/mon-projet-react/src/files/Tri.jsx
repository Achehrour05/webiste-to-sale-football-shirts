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

function Tri({ item, onSortChange, minPrice, maxPrice, setMinPrice, setMaxPrice }) {
  const [checkedItems, setCheckedItems] = useState(["Chaussures de football", "Kits", "Balls"]);
  const [value, setValue] = useState([minPrice, maxPrice]); // Utilisez les props pour initialiser le slider
  const [selectedSize, setSelectedSize] = useState("Taille");
  const [selectedCat, setSelectedCat] = useState("recent au ancien");

  // Mettre à jour les états minPrice et maxPrice dans Shop lorsque le slider change
  const handleSliderChange = (newValue) => {
    setValue(newValue);
    setMinPrice(newValue[0]); // Mettre à jour minPrice dans Shop
    setMaxPrice(newValue[1]); // Mettre à jour maxPrice dans Shop
  };

  // Mettre à jour le slider lorsque minPrice ou maxPrice change
  useEffect(() => {
    setValue([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const handleMinPriceChange = (e) => {
    const newMinPrice = Number(e.target.value);
    setMinPrice(newMinPrice); // Mettre à jour minPrice dans Shop
    setValue([newMinPrice, maxPrice]);
  };

  const handleMaxPriceChange = (e) => {
    const newMaxPrice = Number(e.target.value);
    setMaxPrice(newMaxPrice); // Mettre à jour maxPrice dans Shop
    setValue([minPrice, newMaxPrice]);
  };

  const handleSizeSelect = (event) => {
    setSelectedSize(event.target.value);
  };

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

    // Appeler la fonction de rappel pour mettre à jour les produits dans Shop
    onSortChange(sortedProducts);
  };

  return (
    <div>
      <div className="categories">
        <h6>Product Categories</h6>
        {checkedItems.map((x) => (
          <FormControlLabel
            key={x}
            control={<Checkbox defaultChecked />}
            label={x}
          />
        ))}
      </div>

      {/* Filtre par prix */}
      <div className="price-filter">
        <h6>Filter by price</h6>
        <div className="input">
          <input
            className="text"
            type="number"
            min="0"
            max="3600"
            value={minPrice}
            onChange={handleMinPriceChange}
          />
          <input
            className="text"
            type="number"
            min="0"
            max="3600"
            value={maxPrice}
            onChange={handleMaxPriceChange}
          />
        </div>
        <div className="slider-container">
          <Slider
            range
            min={0}
            max={1000}
            value={value}
            onChange={handleSliderChange}
          />
          <p className="text-default-500 font-medium text-small">
            Selected budget: {minPrice} - {maxPrice}
          </p>
        </div>
      </div>

      {/* Sélecteur de taille */}
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

      {/* Sélecteur de tri */}
      <div className="sort-selector">
        <FormControl fullWidth>
          <InputLabel id="cat-select-label">Choisir un Tri</InputLabel>
          <Select
            labelId="cat-select-label"
            id="cat-select"
            value={selectedCat}
            label="Choisir un Tri"
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