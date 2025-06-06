import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useWishlist } from './WishlistContext'; 
import { useCart } from '../../context/CartContext'; 
import { useAuth } from '../../context/AuthProvider';

import { FaHeart } from 'react-icons/fa'; 
import { BsBagPlusFill, BsBag } from 'react-icons/bs'; 

const WishlistPage = () => {
  const { wishlist, toggleWishlist, loading: loadingWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleAddToCart = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1, product.availableSizes && product.availableSizes.length > 0 ? product.availableSizes[0] : "Taille unique");
    alert(`${product.text} ajouté au panier !`); 
  };

  const handleRemoveFromWishlist = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  if (loadingWishlist && wishlist.length === 0 && user) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-black uppercase mb-2">WISHLIST</h1>
        <p className="text-gray-600">Chargement de votre wishlist...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-black uppercase mb-2">WISHLIST</h1>
        <p className="text-gray-700 mb-6">
          Veuillez <Link to="/registration" className="font-medium text-black hover:text-gray-700 underline">vous connecter</Link> pour voir votre wishlist.
        </p>
      </div>
    );
  }

  if (!loadingWishlist && (!wishlist || wishlist.length === 0)) {
    return (
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold tracking-tight text-black uppercase mb-10">WISHLIST</h1>
        <p className="text-gray-700 mb-2">Your wishlist is empty.</p>
        <p className="text-gray-600 mb-6">Start adding your favorite items !</p>
        <div className="mt-12">
          <Link to="/products" className="text-xs text-black hover:text-gray-700 uppercase font-medium tracking-wider underline">
            Retour à mon compte
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
      <div className="md:text-left mb-8 md:mb-10">
        <p className=" text-[2rem] font-semibold uppercase text-[#333] no-underline">
          WISHLIST
        </p>
        <p className="mt-2 text-sm text-gray-600">
          {wishlist.length} {wishlist.length > 1 ? "Articles" : "Article"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-y-10">
        {wishlist.map((product) => (
          <div key={product.id || product.product_id} className="group relative flex flex-col">
            <Link to={`/produit/${product.id || product.product_id}`} state={product} className="block">
              <div className="aspect-w-1 aspect-h-1 w-[70%] overflow-hidden bg-gray-100 relative">
                <img
                  src={`http://localhost:3000${product.path || product.img || '/assets/default-product.jpg'}`}
                  alt={product.text}
                  className="w-full h-full object-cover object-center group-hover:opacity-80 transition-opacity"
                />
                <div className="absolute top-3 left-3">
                  <button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="p-1.5 w-7 flex justify-center items-center border-0 text-black rounded-full transition-all bg-transparent" // Ombre plus prononcée
                    aria-label="Ajouter au panier"
                    title="Ajouter au panier"
                  >
                    <BsBagPlusFill size={20} />
                  </button>
                </div>
                <div className="absolute top-3 right-3">
                  <button
                    onClick={(e) => handleRemoveFromWishlist(e, product)}
                    className="p-1.5 w-7 flex justify-center items-center border-0 text-black rounded-full transition-all bg-transparent"
                    aria-label="Retirer de la wishlist"
                    title="Retirer de la wishlist"
                  >
                    <FaHeart size={20} className="text-black" /> 
                  </button>
                </div>
              </div>
            </Link>
            <div className="mt-3 text-left">
              <h3 className="text-xs font-medium text-gray-900 truncate" title={product.text}>
                {product.text}
              </h3>
              <p className="mt-1 text-sm font-semibold text-gray-700">
                {product.price ? `${parseFloat(String(product.price).replace(/[^0-9.-]+/g, "")).toFixed(2)} DH` : "Prix indisponible"}
              </p>
            </div>
          </div>
        ))}
      </div>

    
    </div>
  );
};

export default WishlistPage;