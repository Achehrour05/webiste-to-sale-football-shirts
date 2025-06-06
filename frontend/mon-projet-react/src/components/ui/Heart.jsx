import React from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "../../assets/css/Heart.css";

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
