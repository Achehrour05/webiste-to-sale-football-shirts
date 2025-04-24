import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa"; // Import des icônes de cœur rempli et vide
import "./Heart.css"; // Import du fichier CSS pour les styles

const CustomHeart = ({ isActive, onClick }) => {
  return (
    <div
      className={`heart-icon ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      {isActive ? <FaHeart /> : <FaRegHeart />}
    </div>
  );
};

export default CustomHeart;