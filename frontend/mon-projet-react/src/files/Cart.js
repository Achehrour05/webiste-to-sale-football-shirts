import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthProvider';

function Cart() {
  const { user } = useContext(AuthProvider);
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/registration');
      return;
    }

    const fetchCartItems = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/cart/${user.id}`);
        const data = await response.json();
        if (response.ok) {
          setCartItems(data);
        } else {
          setError(data.error || 'Erreur lors du chargement du panier');
        }
      } catch (err) {
        setError('Erreur de connexion au serveur');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCartItems();
  }, [user, navigate]);

  const handleRemoveItem = async (itemId) => {
    try {
      const response = await fetch(`http://localhost:3000/api/cart/${itemId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setCartItems(cartItems.filter(item => item.id !== itemId));
      } else {
        const data = await response.json();
        setError(data.error || 'Erreur lors de la suppression');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    }
  };

  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;

    try {
      const response = await fetch(`http://localhost:3000/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (response.ok) {
        setCartItems(cartItems.map(item => 
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        ));
      } else {
        const data = await response.json();
        setError(data.error || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      setError('Erreur de connexion au serveur');
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (parseFloat(item.price) * item.quantity);
    }, 0).toFixed(2);
  };

  if (isLoading) {
    return <div className="text-center py-8">Chargement du panier...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Votre Panier</h1>
      
      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-600 mb-4">Votre panier est vide</p>
          <button
            onClick={() => navigate('/shop')}
            className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            Continuer vos achats
          </button>
        </div>
      ) : (
        <div className="md:flex md:gap-8">
          <div className="md:w-2/3">
            {cartItems.map(item => (
              <div key={item.id} className="flex border-b border-gray-200 py-6">
                <div className="w-24 h-24 flex-shrink-0">
                  <img
                    src={`http://localhost:3000${item.product_image}`}
                    alt={item.product_name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                
                <div className="ml-4 flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-lg font-medium">{item.product_name}</h3>
                    <p className="font-semibold">{item.price} DH</p>
                  </div>
                  
                  {item.size && <p className="text-sm text-gray-500">Taille: {item.size}</p>}
                  
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      className="px-2 py-1 border border-gray-300 rounded-l"
                    >
                      -
                    </button>
                    <span className="px-4 py-1 border-t border-b border-gray-300">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      className="px-2 py-1 border border-gray-300 rounded-r"
                    >
                      +
                    </button>
                    
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="ml-4 text-sm text-red-500 hover:text-red-700"
                    >
                      Supprimer
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="md:w-1/3 mt-8 md:mt-0">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h2 className="text-lg font-medium mb-4">Récapitulatif</h2>
              
              <div className="flex justify-between border-b border-gray-200 pb-4 mb-4">
                <span>Total</span>
                <span className="font-semibold">{calculateTotal()} DH</span>
              </div>
              
              <button
                onClick={() => navigate('/checkout')}
                className="w-full bg-black text-white py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors"
              >
                Passer la commande
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;