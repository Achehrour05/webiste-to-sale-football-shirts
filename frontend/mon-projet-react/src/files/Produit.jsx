import React, { useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Produit.css";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";

// Composant réutilisable pour le sélecteur de taille
const SizeSelector = ({ sizes, selectedSize, onSizeChange }) => {
  return (
    <FormControl fullWidth>
      <InputLabel id="size-select-label">Taille</InputLabel>
      <Select
        labelId="size-select-label"
        id="size-select"
        value={selectedSize}
        label="Taille"
        onChange={(e) => onSizeChange(e.target.value)}
      >
        {sizes.map((size) => (
          <MenuItem key={size} value={size}>
            {size}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

// Composant réutilisable pour les options de personnalisation
const CustomizationOptions = ({ customizationOption, onCustomizationChange }) => {
  return (
    <FormControl>
      <FormLabel id="customization-radio-buttons-group-label">
        Options de personnalisation
      </FormLabel>
      <RadioGroup
        aria-labelledby="customization-radio-buttons-group-label"
        value={customizationOption}
        name="customization-radio-buttons-group"
        onChange={(e) => onCustomizationChange(e.target.value)}
      >
        <FormControlLabel value="without" control={<Radio />} label="Non, Merci !" />
        <FormControlLabel
          value="nomNumero"
          control={<Radio />}
          label="Nom + Numéro (+50,00 DH)"
        />
        <FormControlLabel
          value="nomNumeroDrapeau"
          control={<Radio />}
          label="Nom + Numéro + Drapeau (+100,00 DH)"
        />
      </RadioGroup>
    </FormControl>
  );
};

// Composant réutilisable pour l'upload de fichier
const FileUpload = ({ onFileChange }) => {
  return (
    <div>
      <p>Insérer le logo ou emoji</p>
      <input type="file" onChange={onFileChange} />
    </div>
  );
};

// Composant principal
function Produit() {
  const location = useLocation();

  const productImage = location.state?.img || "";
  const productText = location.state?.text || "Produit Inconnu";
  const productPrice = location.state?.price || "Prix non disponible";

  const [selectedSize, setSelectedSize] = useState("");
  const [customizationOption, setCustomizationOption] = useState("without");
  const [nameNumber, setNameNumber] = useState("");
  const [quantity, setQuantity] = useState(1);

  const sizes = [38, 39, 40, 41, 42, 43, 44, 45];

  const handleFileChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(file);
    }
  }, []);

  const handleQuantityChange = useCallback((e) => {
    const value = parseInt(e.target.value);
    if (value >= 1) {
      setQuantity(value);
    }
  }, []);

  return (
    <div className="produitContainer">
      <div className="lefts">
        <Carousel interval={3000}>
          <Carousel.Item>
            <img className="d-block w-100" src={productImage} alt="Main Product" />
          </Carousel.Item>
        </Carousel>
      </div>

      <div className="rights">
        <p className="maintaitle">{productText}</p>
        <p className="prix">{productPrice}</p>

        <div className="dropdown marg">
          <SizeSelector
            sizes={sizes}
            selectedSize={selectedSize}
            onSizeChange={setSelectedSize}
          />
        </div>

        <p className="maintaitle">Rendez-le Unique !</p>
        <p>Personnalisation disponible (Préparation sous 24 à 48 heures).</p>

        <CustomizationOptions
          customizationOption={customizationOption}
          onCustomizationChange={setCustomizationOption}
        />

        {customizationOption !== "without" && (
          <>
            <p>Entrer le nom + le numéro</p>
            <input
              type="text"
              className="inputbarre"
              placeholder="Ex: Cristiano 7"
              value={nameNumber}
              onChange={(e) => setNameNumber(e.target.value)}
            />
            {customizationOption !== "nomNumero" && (
              <FileUpload onFileChange={handleFileChange} />
            )}
            <p>Quantité</p>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min="1"
            />
            <button className="ajout">Ajouter au panier</button>
          </>
        )}
      </div>
    </div>
  );
}

export default Produit;