import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext'; 
import { Trash2, Plus, Minus, Heart, ChevronDown, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    cartTotal, 
    itemCount,
    loadingCart
  } = useCart();
  const navigate = useNavigate();
  const [showPromoInput, setShowPromoInput] = useState(false);
  const [promoCode, setPromoCode] = useState(""); 
  const [promoError, setPromoError] = useState("");
  const [promoApplied, setPromoApplied] = useState(null); 


  if (loadingCart && cartItems.length === 0) { 
    return (
      <div className="flex flex-col justify-center items-center min-h-[calc(100vh-200px)] text-gray-700">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900 mb-4"></div>
        <p className="text-lg">Chargement de votre panier...</p>
      </div>
    );
  }

  if (!loadingCart && itemCount === 0) {
    return (
      <div className="max-w-3xl mx-auto sm:px-6 lg:px-8 py-16 flex justify-center items-center flex-col"> 
        <ShoppingBag size={64} className="mx-auto text-gray-300 mb-6" /> 
        <p className="text-[1.1rem] text-center font-semibold uppercase tracking-[0.5px] text-[#333] sm:text-2xl mb-4">
          Votre Panier est Vide
        </p>
        <p className="text-gray-500 mb-8 w-full text-center">
          Ajoutez des articles que vous aimez à votre panier et revenez ici pour finaliser votre commande.
        </p>
        <Link
          to="/products"
          className="inline-block bg-white text-black shadow-sm text-base font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors"
        >
          Découvrir les Produits
        </Link>
      </div>
    );
  }

  const subtotal = cartTotal;
  const shippingCost = 0; 
  const estimatedTax = 0; 
  
  let discountAmount = 0;
  if (promoApplied && promoApplied.type === 'percentage') {
    discountAmount = (subtotal * promoApplied.value) / 100;
  } else if (promoApplied && promoApplied.type === 'fixed') {
    discountAmount = promoApplied.value;
  }
  const totalAfterDiscount = subtotal - discountAmount;
  const finalTotal = totalAfterDiscount + shippingCost + estimatedTax;


  const handleApplyPromoCode = () => {
    setPromoError("");
    setPromoApplied(null);
    if (promoCode.toUpperCase() === "NIKE10") {
        setPromoApplied({ code: "NIKE10", type: "percentage", value: 10, description: "10% de réduction" });
    } else if (promoCode.toUpperCase() === "FREESHIP") {
        setPromoApplied({ code: "FREESHIP", type: "fixed", value: 20, description: "20 DH de réduction" });
    } else {
        setPromoError("Code promo invalide ou expiré.");
    }
  };


  return (
   <div className="w-full px-4 py-8 bg-white mt-0 overflow-x-hidden"> 
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 xl:gap-x-16 items-start">
         <section aria-labelledby="cart-heading" className="lg:col-span-7">
            <p id="cart-heading" className="text-[1.1rem] font-semibold uppercase tracking-[0.5px] text-[#333] no-underline hover:text-gray-600 sm:text-3xl mb-6">
              Bag
            </p>
            <ul role="list" className="divide-y divide-gray-200"> 
              {cartItems.map((item) => (
                <li key={item.cartItemId || item.cart_item_table_id} className="flex py-6 sm:py-8">
                  <div className="flex-shrink-0 w-24 h-auto sm:w-32">
                    <img
                      src={`http://localhost:3000${item.path || '/assets/default-product.jpg'}`}
                      alt={item.text}
                      className="w-full h-full rounded-md object-cover object-center" 
                    />
                  </div>

                  <div className="ml-4 flex-1 flex flex-col justify-between sm:ml-6">
                    <div> 
                      <div className="flex justify-between items-start">
                        <p> 
                          <Link
                            to={`/produit/${item.product_id}`} 
                            className="text-[1.1rem] font-semibold uppercase tracking-[0.5px] text-[#333] no-underline hover:text-gray-600"
                          >
                            {item.text}
                          </Link>
                        </p>
                      </div>
                      <p className="mt-1 text-sm text-gray-500">
                        {item.price ? `${parseFloat(String(item.price).replace(/[^0-9.-]+/g, "")).toFixed(2)} DH` : "Prix non disponible"}
                      </p>
                      {item.size && item.size !== "Taille unique" && (
                        <p className="mt-1 text-sm text-gray-500">Size: {item.size}</p>
                      )}
                    </div>

                    <div className="mt-4 flex items-center justify-between text-sm"> 
                        <div className="flex items-center border border-gray-300 rounded-[20px] h-9 overflow-hidden"> 
                            <button
                                type="button"
                                onClick={() => {
                                if (item.quantity === 1) {
                                    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${item.text}" (Taille: ${item.size || 'Taille unique'}) de votre panier ?`)) {
                                    removeFromCart(item);
                                    }
                                } else {
                                    updateQuantity(item, item.quantity - 1);
                                }
                                }}
                                className="px-2 h-full w-10 flex items-center bg-white justify-center text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors"
                                title={item.quantity === 1 ? "Supprimer l'article" : "Diminuer la quantité"}
                                aria-label={item.quantity === 1 ? "Supprimer l'article" : "Diminuer la quantité"}
                            >
                                {item.quantity === 1 ? <Trash2 size={16} strokeWidth={1.5} /> : <Minus size={16} strokeWidth={1.5} />}
                            </button>

                            <span className="px-3 h-full w-10 flex items-center justify-center text-center border-x border-gray-300 text-gray-800 font-medium">
                                {item.quantity}
                            </span>

                            <button
                                type="button"
                                onClick={() => updateQuantity(item, item.quantity + 1)} 
                                className="px-2 h-full w-10 flex bg-white items-center justify-center text-gray-600 hover:bg-gray-100 focus:outline-none transition-colors"
                                title="Augmenter la quantité"
                                aria-label="Augmenter la quantité"
                            >
                                <Plus size={16} strokeWidth={1.5} />
                            </button>
                        </div>

                        <div className="flex items-center"> 
                             <button
                                type="button"
                                onClick={() => {  alert(`Ajouter ${item.text} aux favoris`);}}
                                className="ml-3 h-9 w-9 flex items-center bg-white justify-center text-gray-400 hover:text-red-500 p-0 rounded-full hover:bg-gray-100 transition-colors"
                                title="Ajouter aux favoris"
                            >
                                <Heart size={18} strokeWidth={1.5} />
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    if (window.confirm(`Êtes-vous sûr de vouloir supprimer "${item.text}" (Taille: ${item.size || 'Taille unique'}) de votre panier ?`)) {
                                      removeFromCart(item);
                                    }
                                }}
                                className="ml-2 h-9 w-9 sm:hidden flex items-center justify-center text-gray-400 hover:text-red-600 p-0 rounded-full hover:bg-red-50 transition-colors" 
                                title="Supprimer l'article"
                            >
                                <Trash2 size={18} strokeWidth={1.5} />
                            </button>
                        </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-8 pt-8 border-t border-gray-200"> 
              <h2 className="text-lg font-medium text-gray-900">Livraison</h2>
              <p className="mt-1 text-sm text-gray-600">
                Arrive vers le Vendredi, 30 Mai 
                <button onClick={() => alert("La fonctionnalité 'Modifier le lieu' sera implémentée.")} className="ml-2 font-medium bg-white text-sm cursor-pointer text-black hover:text-gray-700 underline focus:outline-none">
                  Modifier le lieu
                </button>
              </p>
            </div>
          </section>


          <section
            aria-labelledby="summary-heading"
            className="mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8" 
          >
            <p id="summary-heading" className="text-[1.1rem] font-semibold uppercase tracking-[0.5px] text-[#333] no-underline hover:text-gray-600">
              Récapitulatif
            </p>

            <dl className="mt-6 space-y-3"> 
              <div className="flex items-center justify-between">
                <dt className="text-sm text-gray-600">Sous-total</dt>
                <dd className="text-sm font-medium text-gray-900">{subtotal.toFixed(2)} DH</dd>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <dt className="flex items-center text-sm text-gray-600">
                  <span>Frais de port estimés</span>
                </dt>
                <dd className="text-sm font-medium text-gray-900">{shippingCost === 0 ? "Gratuit" : `${shippingCost.toFixed(2)} DH`}</dd>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <dt className="flex text-sm text-gray-600">
                  <span>Taxes estimées</span>
                </dt>
                <dd className="text-sm font-medium text-gray-900">{estimatedTax === 0 ? "—" : `${estimatedTax.toFixed(2)} DH`}</dd>
              </div>

            {promoApplied && (
                <div className="flex items-center justify-between pt-3 border-t border-green-300 bg-green-50 p-2 rounded">
                    <dt className="text-sm text-green-700">Promotion appliquée ({promoApplied.code})</dt>
                    <dd className="text-sm font-medium text-green-700">- {discountAmount.toFixed(2)} DH</dd>
                </div>
            )}

              <div className="pt-3 border-t border-gray-200">
                <div className="text-sm font-medium text-gray-900 flex justify-between items-center cursor-pointer w-full py-2" onClick={() => setShowPromoInput(!showPromoInput)}>
                  <span>Avez-vous un code promo ?</span>
                  <ChevronDown className={`w-5 h-5 text-gray-400 transform transition-transform ${showPromoInput ? 'rotate-180' : ''}`} />
                </div>
                {showPromoInput && (
                  <dd className="mt-3">
                    <div className="flex space-x-2">
                        <input 
                            type="text" 
                            placeholder="Code Promo" 
                            value={promoCode}
                            onChange={(e) => {setPromoCode(e.target.value); setPromoError("");}}
                            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black sm:text-sm p-2 flex-grow h-10" 
                        />
                        <button 
                            type="button" 
                            onClick={handleApplyPromoCode}
                            className="rounded-md bg-gray-200 px-4 text-sm font-medium text-gray-700 hover:bg-gray-300 h-10 whitespace-nowrap" 
                        >
                            Appliquer
                        </button>
                    </div>
                    {promoError && <p className="text-xs text-red-500 mt-1">{promoError}</p>}
                  </dd>
                )}
              </div>

              <div className="border-t-2 border-gray-300 pt-4 flex items-center justify-between mt-3"> 
                <dt className="text-[1.1rem] font-semibold uppercase tracking-[0.5px] text-[#333]">Total</dt>
                <dd className="text-[1.1rem] font-semibold uppercase tracking-[0.5px] text-[#333]">{finalTotal.toFixed(2)} DH</dd>
              </div>
            </dl>
            <div className="mt-10">
              <button
                type="button"
                onClick={() => {
                  navigate('/checkout');
                }}
                className="w-full h-[30%] flex items-center justify-center bg-black text-white py-3 px-4 border border-transparent rounded-full shadow-sm text-base font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black transition-colors" 
              >
                Finaliser la commande
              </button>
            </div>
             <div className="mt-6 text-center">
                <p className="text-xs text-gray-500 ">
                    Ou continuez avec <a onClick={()=> alert("PayPal non implémenté")} className="font-medium bg-white text-indigo-600 hover:text-indigo-500 cursor-pointer">PayPal</a>
                </p>
             </div>
          </section>
        </div>
      </div>
    </div>
  );
}