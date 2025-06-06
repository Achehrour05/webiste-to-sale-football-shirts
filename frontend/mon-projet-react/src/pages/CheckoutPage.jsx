
  import React, { useState, useEffect } from 'react';
  import { useNavigate } from 'react-router-dom';
  import { useCart } from '../context/CartContext'; 
  import { useAuth } from '../context/AuthProvider'; 

  export default function CheckoutPage() {
    const { cartItems, cartTotal, clearCart } = useCart();
    const { user } = useAuth(); 
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      postalCode: '',
      country: 'Maroc',
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
      if (user) {
        setFormData(prev => ({
          ...prev,
          firstName: user.name ? user.name.split(' ')[0] : '', 
          lastName: user.name ? user.name.split(' ').slice(1).join(' ') : '', 
          email: user.email || ''
        }));
      }
    }, [user]);

    useEffect(() => {
      if (!isSubmitting && cartItems.length === 0) {
        console.log("Panier vide, redirection depuis la page de caisse...");
        navigate('/cart');
      }
    }, [cartItems, navigate, isSubmitting]);


    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: null }));
      }
    };

    const validateForm = () => {
      const newErrors = {};
      if (!formData.firstName.trim()) newErrors.firstName = "Le prénom est requis.";
      if (!formData.lastName.trim()) newErrors.lastName = "Le nom de famille est requis.";
      if (!formData.email.trim()) newErrors.email = "L'email est requis.";
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "L'adresse email est invalide.";
      if (!formData.addressLine1.trim()) newErrors.addressLine1 = "L'adresse (ligne 1) est requise.";
      if (!formData.city.trim()) newErrors.city = "La ville est requise.";
      if (!formData.postalCode.trim()) newErrors.postalCode = "Le code postal est requis.";
      if (!formData.country.trim()) newErrors.country = "Le pays est requis.";
      if (formData.phone.trim() && !/^[0-9\s+()-]+$/.test(formData.phone)) newErrors.phone = "Le numéro de téléphone est invalide.";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0; 
    };


    const handleSubmitOrder = async (e) => {
      e.preventDefault();
      if (!validateForm()) {
        console.log("CheckoutPage: Validation du formulaire échouée", errors);
        return;
      }
      if (cartItems.length === 0) {
          alert("Votre panier est vide. Impossible de passer une commande.");
          navigate('/products'); 
          return;
      }

      setIsSubmitting(true);

      const orderData = {
        userId: user ? user.id : null, 
        customerDetails: formData,
        items: cartItems.map(item => ({ 
          productId: item.product_id, 
          productName: item.text,
          quantity: item.quantity,
          priceAtPurchase: parseFloat(String(item.price).replace(/[^0-9.-]+/g,"")),
          size: (item.size && item.size !== "Taille unique" && item.size !== "Sélectionner") ? item.size : null,
        })),
        orderTotal: cartTotal,
      };

      console.log("CheckoutPage: Tentative de soumission de la commande avec les données réelles:", orderData);

      try {
        const response = await fetch('http://localhost:3000/api/orders', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(user && user.id && { 'x-user-id': user.id.toString() })
          },
          body: JSON.stringify(orderData),
        });

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ 
              error: `Erreur du serveur: ${response.status} ${response.statusText}` 
          }));
          console.error("CheckoutPage: Erreur de l'API lors de la création de la commande:", errorData);
          throw new Error(errorData.error || `Échec de la création de la commande.`);
        }
        
        const createdOrder = await response.json();
        console.log("CheckoutPage: Commande réelle créée avec succès via API:", createdOrder);
        clearCart(); 

        alert(`Votre commande N°${createdOrder.orderId} a été passée avec succès !`);
        navigate('/');

      } catch (error) {
        console.error("CheckoutPage: Erreur globale lors de la soumission de la commande:", error);
        setErrors(prev => ({ ...prev, form: error.message || "Une erreur est survenue. Veuillez réessayer." }));
      } finally {
        setIsSubmitting(false);
      }
    };


    const renderInputField = (name, label, type = "text", required = true) => (
      <div className="mb-4">
        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <input
          type={type}
          id={name}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          className={`w-full px-3 py-2 border ${errors[name] ? 'border-red-500' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
        />
        {errors[name] && <p className="mt-1 text-xs text-red-600">{errors[name]}</p>}
      </div>
    );

    if (cartItems.length === 0 && !isSubmitting) {
      return (
          <div className="text-center py-10">
              <p>Votre panier est vide. Redirection...</p>
          </div>
      );
    }

    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="mb-8 font-bold text-[1.5rem] font-semibold uppercase tracking-[0.5px] mt-[2.5rem] mb-[1rem] px-[1.5rem] text-[#333]">Finaliser Votre Commande</h1>
        
        <form onSubmit={handleSubmitOrder} noValidate className="bg-white p-8 w-full rounded-lg  space-y-6 border-none">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">Informations de Livraison</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              {renderInputField("firstName", "Prénom")}
              {renderInputField("lastName", "Nom de Famille")}
            </div>
            {renderInputField("email", "Adresse Email", "email")}
            {renderInputField("phone", "Téléphone (Optionnel)", "tel", false)}
            {renderInputField("addressLine1", "Adresse (Ligne 1)")}
            {renderInputField("addressLine2", "Adresse (Ligne 2 - Optionnel)", "text", false)}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6">
              {renderInputField("city", "Ville")}
              {renderInputField("postalCode", "Code Postal")}
            </div>
            {renderInputField("country", "Pays")}
          </div>

          <div className="border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Récapitulatif</h2>
            {cartItems.map(item => (
              <div key={item.cartItemId} className="flex justify-between items-center text-sm py-1">
                <span>{item.text} (x{item.quantity}) {item.size && item.size !== "Taille unique" ? `- ${item.size}` : ''}</span>
                <span>{(parseFloat(String(item.price).replace(/[^0-9.-]+/g,"")) * item.quantity).toFixed(2)} DH</span>
              </div>
            ))}
            <div className="flex justify-between items-center text-lg font-bold mt-3 pt-3 border-t">
              <span>Total de la commande</span>
              <span>{cartTotal.toFixed(2)} DH</span>
            </div>
          </div>

          <div className="border-t pt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Paiement</h2>
              <p className="text-gray-600 text-sm">L'intégration du paiement sera ajoutée ici (ex: Stripe, PayPal). Pour l'instant, la commande sera créée comme "Paiement à la livraison" ou "En attente".</p>
          </div>


          {errors.form && <p className="mt-2 text-sm text-red-600 bg-red-50 p-3 rounded-md">{errors.form}</p>}
          <div className='w-full flex justify-end '>
          <button
            type="submit"
            disabled={isSubmitting || cartItems.length === 0}
            className="w-[45%] flex items-center justify-center bg-black text-white py-3 px-6 rounded-md font-semibold text-lg hover:bg-indigo-700 transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-3xl font-bold text-[1.1rem] font-semibold uppercase tracking-[0.5px] mt-[2.5rem] mb-[1rem] px-[1.5rem] text-[#333]"
          >
            {isSubmitting ? 'Traitement en cours...' : 'Passer la Commande'}
          </button>
          </div>
        </form>
      </div>
    );
  }