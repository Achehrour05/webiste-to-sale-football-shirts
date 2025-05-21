import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Produit.css";

export default function Produit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [productData, setProductData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedSize, setSelectedSize] = useState("Sélectionner");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setIsLoading(true);
      setError("");
      
      try {
        const response = await axios.get(`http://localhost:3000/api/products/${id}`);
        
        if (!response.data) {
          throw new Error("Produit non trouvé");
        }

        // Transforme les données pour s'assurer qu'elles correspondent au format attendu
        const transformedData = {
          id: response.data.id || response.data.produit_id,
          text: response.data.text || response.data.name || "Nom inconnu",
          price: response.data.price || "0.00 €",
          path: response.data.path || response.data.image || "/default-product.jpg",
          availableSizes: response.data.availableSizes || [],
          // Ajoutez d'autres champs nécessaires ici
        };

        setProductData(transformedData);
        
        // Initialise la taille si disponible
        if (transformedData.availableSizes.length > 0) {
          setSelectedSize(transformedData.availableSizes[0]);
        }
      } catch (err) {
        console.error("Erreur API:", err);
        
        if (err.response) {
          // Erreur avec réponse du serveur
          switch (err.response.status) {
            case 404:
              setError("Ce produit n'existe pas");
              break;
            case 500:
              setError("Erreur serveur - Veuillez réessayer plus tard");
              break;
            default:
              setError("Une erreur est survenue");
          }
        } else {
          // Erreur sans réponse (problème réseau, etc.)
          setError("Impossible de se connecter au serveur");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!productData) {
      setError("Produit non chargé");
      return;
    }

    // Vérifie si une taille doit être sélectionnée
    if (productData.availableSizes.length > 0 && selectedSize === "Sélectionner") {
      setError("Veuillez sélectionner une taille");
      return;
    }

    setError("");
    alert(`${quantity} × ${productData.text} (${selectedSize}) ajouté au panier !`);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Erreur</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <button
          onClick={() => navigate("/shop")}
          className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          Retour à la boutique
        </button>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12 text-center">
        <p className="text-gray-700">Produit non disponible</p>
        <button
          onClick={() => navigate("/shop")}
          className="mt-4 bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
        >
          Retour à la boutique
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="md:flex md:gap-10">
        {/* Colonne image */}
        <div className="md:w-1/2 mb-8 md:mb-0">
          <img
            src={`http://localhost:3000${productData.path}`}
            alt={productData.text}
            className="w-full h-auto object-cover rounded-lg shadow-md aspect-square"
            onError={(e) => {
              e.target.src = "http://localhost:3000/default-product.jpg";
            }}
          />
        </div>

        {/* Colonne informations */}
        <div className="md:w-1/2">
          <h1 className="text-3xl font-bold mb-3 text-gray-900">{productData.text}</h1>
          <p className="text-2xl font-semibold mb-6 text-gray-800">{productData.price}</p>

          {/* Sélection de taille */}
          {productData.availableSizes.length > 0 ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Taille</label>
              <div className="flex flex-wrap gap-2">
                {productData.availableSizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-md text-sm font-medium transition-colors ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-800 border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-sm text-gray-500 mb-6">Taille unique</p>
          )}

          {/* Sélection de quantité */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantité</label>
            <div className="flex items-center border border-gray-300 rounded-md w-fit">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                className="px-3 py-1 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="px-4 py-1 border-x border-gray-300">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-1 text-lg"
              >
                +
              </button>
            </div>
          </div>

          {/* Bouton d'action */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-black text-white py-3 px-6 rounded-full font-semibold hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
          >
            Ajouter au panier
          </button>

          {/* Affichage des erreurs */}
          {error && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-600 text-sm">
              {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}