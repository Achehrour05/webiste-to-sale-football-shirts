import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/css/Produit.css";
import { useCart } from '../context/CartContext';
import Ad from '../components/ads/Ad';
import { Trash2, Plus, Minus, Heart, ChevronDown, HelpCircle } from 'lucide-react';
import { Truck, Clock, HandCoins, ShieldCheck, Undo2 } from 'lucide-react';


export default function Produit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("Sélectionner");
  const [quantity, setQuantity] = useState(1);
  const [addedToCartMessage, setAddedToCartMessage] = useState("");

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      setError("");
      setAddedToCartMessage("");

      try {
        const response = await axios.get(`http://localhost:3000/api/products/${id}`);

        if (!response.data) {
          throw new Error("Produit non trouvé dans la réponse de l'API");
        }

        const transformedData = {
          id: response.data.id || response.data.produit_id,
          text: response.data.text || response.data.name || "Nom de produit inconnu",
          price: response.data.price || "Prix non disponible",
          path: response.data.path || response.data.image || "/assets/default-product.jpg",
          availableSizes: response.data.availableSizes || [],
        };

        setProductData(transformedData);

        if (transformedData.availableSizes.length === 0) {
          setSelectedSize("Taille unique");
        } else {
          setSelectedSize("Sélectionner"); 
        }
      } catch (err) {
        console.error("Erreur lors du chargement des détails du produit:", err);
        if (err.response) {
          switch (err.response.status) {
            case 404:
              setError("Désolé, ce produit n'a pas été trouvé.");
              break;
            case 500:
              setError("Une erreur s'est produite sur le serveur. Veuillez réessayer plus tard.");
              break;
            default:
              setError("Une erreur inattendue s'est produite lors du chargement du produit.");
          }
        } else if (err.request) {
          setError("Impossible de contacter le serveur. Veuillez vérifier votre connexion internet.");
        } else {
          setError(err.message || "Une erreur inconnue s'est produite.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchProductDetails();
    } else {
      setError("Aucun ID de produit fourni.");
      setIsLoading(false);
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!productData) {
      setError("Les informations du produit ne sont pas disponibles pour l'ajout au panier.");
      return;
    }

    if (productData.availableSizes.length > 0 && selectedSize === "Sélectionner") {
      setError("Veuillez choisir une taille avant d'ajouter au panier.");
      setAddedToCartMessage("");
      return;
    }

    setError("");
    addToCart(productData, quantity, selectedSize);

    const sizeDisplay = (selectedSize && selectedSize !== "Sélectionner") ? selectedSize : "Taille unique";
    setAddedToCartMessage(`${quantity} × "${productData.text}" (Taille: ${sizeDisplay}) a été ajouté à votre panier !`);

    setTimeout(() => setAddedToCartMessage(""), 4000);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-gray-900"></div>
        <p className="ml-4 text-lg text-gray-700">Chargement du produit...</p>
      </div>
    );
  }

  if (error && !productData) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-semibold text-red-700 mb-4">Erreur</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <button
          onClick={() => navigate("/products")}
          className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors text-lg font-medium"
        >
          Retourner à la boutique
        </button>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-600 text-lg">Information produit non disponible.</p>
      </div>
    );
  }


  const imageUrl = productData.path.startsWith("/")
    ? `http://localhost:3000${productData.path}`
    : `http://localhost:3000/${productData.path}`;

  return (
    <divdd className="max-w-6xl mx-auto mb-[50px] px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-white">
      <div className="md:grid md:grid-cols-2 md:gap-x-8 lg:gap-x-12 " >
        <div className="mb-8 md:mb-0 flex justify-center">
          <img
            src={imageUrl}
            alt={productData.text}
            className="w-[450px] h-auto object-cover rounded-lg  aspect-[1/1]"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "http://localhost:3000/assets/default-product.jpg";
            }}
          />
        </div>

        <div>
          <p className="text-[1.1rem] font-semibold uppercase tracking-[0.5px] text-[#333] no-underline hover:text-gray-600 sm:text-3xl mb-6">{productData.text}</p>
          <p className="text-[20px] font-semibold uppercase  text-[#333] no-underline hover:text-gray-600  mb-6">{productData.price} DH</p>

          {productData.availableSizes.length > 0 ? (
            <div className="mb-6">
              <label htmlFor="size-options" className="block text-sm font-medium text-gray-700 mb-2">
                Taille : <span className="font-semibold">{selectedSize !== "Sélectionner" ? selectedSize : ""}</span>
              </label>
              <div id="size-options" className="flex flex-wrap gap-2">
                {productData.availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => { setSelectedSize(size); setError(""); setAddedToCartMessage(""); }}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800
                      ${selectedSize === size
                        ? "bg-gray-900 text-white border-gray-900 shadow-md"
                        : "bg-white text-gray-700 border-gray-300 hover:border-gray-500 hover:bg-gray-50"
                      }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-6">Taille : {selectedSize}</p>
          )}

          <div className="mt-4 flex items-center border border-gray-300 rounded-[20px] h-9 overflow-hidden w-max">
            <button
              type="button"
              onClick={() => setQuantity(q => (q > 1 ? q - 1 : 1))}
              className="px-3 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors bg-white w-[50%]"
              title="Diminuer la quantité"
              aria-label="Diminuer la quantité"
            >
              <Minus size={16} strokeWidth={1.5} />
            </button>

            <span className="px-4 h-full flex items-center justify-center text-gray-800 font-medium select-none">
              {quantity}
            </span>

            <button
              type="button"
              onClick={() => setQuantity(q => q + 1)}
              className="px-3 h-full flex items-center justify-center text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors bg-white w-[50%]"
              title="Augmenter la quantité"
              aria-label="Augmenter la quantité"
            >
              <Plus size={16} strokeWidth={1.5} />
            </button>
          </div>

 <div className="flex items-center gap-2 mt-4">
  <button
    onClick={handleAddToCart}
    className="w-[80%] mt-[40px] flex items-center justify-center bg-black text-white py-3 px-6 rounded-md font-bold uppercase hover:bg-gray-800 transition-colors text-sm tracking-wide"
  >
    Ajouter au panier
    <span className="ml-2">{'→'}</span>
  </button>
</div>

{addedToCartMessage && (
  <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-500 rounded-md text-green-700 text-sm shadow">
    {addedToCartMessage}
  </div>
)}

{error && !addedToCartMessage && (
  <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-md text-red-700 text-sm shadow">
    <p>{error}</p>
  </div>
)}


<ul className="mt-6 space-y-2 text-sm text-gray-800">
<li className="flex items-start gap-2">
  <Clock className="w-4 h-4 mt-1" />
  <span>1 à 3 jours ouvrables.</span>
</li>
<li className="flex items-start gap-2">
  <HandCoins className="w-4 h-4 mt-1" />
  <span>Paiement à la livraison disponible</span>
</li>
<li className="flex items-start gap-2">
  <ShieldCheck className="w-4 h-4 mt-1" />
  <span>Transactions sécurisées</span>
</li>
<li className="flex items-start gap-2">
  <Undo2 className="w-4 h-4 mt-1" />
  <span>Retour sans tracas sous 30 jours.</span>
</li>

</ul>


          {error && !addedToCartMessage && (
            <div className="mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-md text-red-700 text-sm shadow">
              <p>{error}</p>
            </div>
          )}
        </div>
      </div>
      <Ad className="m-0"/>
    </divdd>
  );
}
