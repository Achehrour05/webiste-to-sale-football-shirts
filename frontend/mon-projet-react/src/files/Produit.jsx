import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { Carousel } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Produit.css";

function Produit() {
  const { id } = useParams();
  const location = useLocation();

  // Récupérer les données passées avec navigate
  const productImage = location.state?.img || "";
  const productText = location.state?.text || "Produit Inconnu";
  const productPrice = location.state?.price || "Prix non disponible";

  const [selectedSize, setSelectedSize] = useState("Choisir une taille");
  const [customizationOption, setCustomizationOption] = useState("without");
  const [nameNumber, setNameNumber] = useState("");
  const [quantity, setQuantity] = useState(1);

  // Fonction pour gérer le changement de fichier (pour l'input type="file")
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log(file); // Vous pouvez ajouter un traitement spécifique ici, comme l'affichage de l'image ou l'envoi au serveur
    }
  };

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
          <button className="btn btn1 dropdown-toggle" type="button">
            {selectedSize}
          </button>
          <ul className="dropdown-menu">
            {[38, 39, 40, 41, 42, 43, 44, 45].map((size) => (
              <li key={size}>
                <button className="dropdown-item" onClick={() => setSelectedSize(size)}>
                  {size}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <p className="maintaitle">Rendez-le Unique !</p>
        <p>Personnalisation disponible (Préparation sous 24 à 48 heures).</p>

        <div className="radio">
          <label>
            <input
              type="radio"
              value="without"
              checked={customizationOption === "without"}
              onChange={(e) => setCustomizationOption(e.target.value)}
            />
            Non, Merci!
          </label>
          <br />
          <label>
            <input
              type="radio"
              value="nomNumero"
              checked={customizationOption === "nomNumero"}
              onChange={(e) => setCustomizationOption(e.target.value)}
            />
            Nom + Numéro (+50,00 DH)
          </label>
          <br />
          <label>
            <input
              type="radio"
              value="nomNumeroDrapeau"
              checked={customizationOption === "nomNumeroDrapeau"}
              onChange={(e) => setCustomizationOption(e.target.value)}
            />
            Nom + Numéro + Drapeau (+100,00 DH)
          </label>
        </div>

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
              <>
                <p>Insérer le logo ou emoji</p>
                <input type="file" onChange={handleFileChange} />
              </>
            )}
            <p>Quantité</p>
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(parseInt(e.target.value))}
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
