import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthProvider';

export const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loadingCart, setLoadingCart] = useState(true);
  const { user, loadingAuthState } = useAuth(); 


 const fetchCart = useCallback(async () => {
 
  if (loadingAuthState || !user || !user.id) {
    console.log("CartContext [fetchCart]: Aborted. Auth loading or no user.", { loadingAuthState, userId: user?.id });
    setCartItems([]);
    setLoadingCart(false);
    return;
  }

  console.log(`CartContext [fetchCart]: Attempting to fetch cart for user ID: ${user.id}`);
  setLoadingCart(true);
  try {
    const response = await fetch('http://localhost:3000/api/cart', { 
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user.id.toString(),
      },
    });

    console.log("CartContext [fetchCart]: API Response Status:", response.status);
    const responseData = await response.json(); 
    console.log("CartContext [fetchCart]: Raw API Response Data:", responseData);

    if (!response.ok) {
      const errorMessage = responseData.error || `Failed to fetch cart: Server responded with ${response.status}`;
      throw new Error(errorMessage);
    }

    if (Array.isArray(responseData)) {
        const validatedItems = responseData.map(item => ({
            cart_item_table_id: item.cart_item_table_id,
            product_id: item.product_id,
            text: item.text || "Produit inconnu",
            price: item.price ? item.price.toString() : "0.00", 
            path: item.path || '/assets/default-product.jpg',
            quantity: parseInt(item.quantity, 10) || 1,
            size: item.size || "Taille unique",
            cartItemId: item.cartItemId || (item.product_id + (item.size ? `-${item.size}` : '-tailleunique')) // Pour la clé React
        }));
        setCartItems(validatedItems);
        console.log("CartContext [fetchCart]: Cart items SET in context:", validatedItems);
    } else {
        console.warn("CartContext [fetchCart]: API response data is not an array. Setting cart to empty.", responseData);
        setCartItems([]);
    }

  } catch (error) {
    console.error("CartContext [fetchCart]: CRITICAL ERROR during API call or processing:", error);
    setCartItems([]); 
    alert(`Erreur lors du chargement du panier : ${error.message}`);
  } finally {
    setLoadingCart(false);
    console.log("CartContext [fetchCart]: fetchCart finished. loadingCart set to false.");
  }
}, [user, loadingAuthState]); 
useEffect(() => {
  console.log("CartContext [useEffect on fetchCart]: User or loadingAuthState changed. Triggering fetchCart.");
  fetchCart();
}, [fetchCart]);

  const addToCart = async (product, quantity, selectedSize) => {
  if (!user || !user.id) {
    alert("Veuillez vous connecter pour ajouter des articles au panier.");
    console.warn("CartContext [ADD_TO_CART]: User not logged in. Aborting.");
    return;
  }
  console.groupCollapsed(`CartContext [ADD_TO_CART]: Attempting to add product ID: ${product.id}`);
  console.log("Product Data:", product);
  console.log("Quantity:", quantity);
  console.log("Selected Size:", selectedSize);
  console.log("User ID for API call:", user.id);

  const actualSize = (selectedSize && selectedSize !== "Sélectionner" && selectedSize !== "Taille unique") ? selectedSize : null;
  const numericPrice = parseFloat(String(product.price).replace(/[^0-9.-]+/g,""));
  if (isNaN(numericPrice)) {
      console.error("CartContext [ADD_TO_CART]: Invalid numericPrice after parsing:", product.price);
      console.groupEnd();
      return;
  }


  const payload = {
    productId: product.id,
    productName: product.text,
    productPrice: numericPrice,
    productImagePath: product.path,
    quantity,
    size: actualSize,
  };
  console.log("Payload to be sent to API:", payload);

  try {
    const response = await fetch('http://localhost:3000/api/cart', { 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user.id.toString(), 
      },
      body: JSON.stringify(payload),
    });

    console.log("API Response Status:", response.status);
    const responseData = await response.json(); 
    console.log("API Response Data:", responseData);

    if (!response.ok) {
      const errorMessage = responseData.error || `Failed to add to cart: Server responded with ${response.status}`;
      throw new Error(errorMessage);
    }

    console.log("CartContext [ADD_TO_CART]: API call successful. Refetching cart...");
    await fetchCart(); 
    console.log("CartContext [ADD_TO_CART]: Cart refetched after successful add.");

  } catch (error) {
    console.error("CartContext [ADD_TO_CART]: CRITICAL ERROR during API call or processing:", error);

    alert(`Erreur lors de l'ajout au panier : ${error.message}`);
  }
  console.groupEnd();
};

 const updateQuantity = async (cartItem, newQuantity) => { 
  console.log("CartContext [UPDATE_QUANTITY]: Function called.", { cartItem, newQuantity });
  if (!user || !user.id || !cartItem || cartItem.cart_item_table_id === undefined) {
    console.error("CartContext [UPDATE_QUANTITY]: Aborting - Missing user or cart_item_table_id.", {user, cartItem});
    return;
  }
  if (newQuantity < 0) {
    console.warn("CartContext [UPDATE_QUANTITY]: Aborting - newQuantity is less than 0.", newQuantity);
    return;
  }

  console.log("CartContext [UPDATE_QUANTITY]: Attempting to update DB ID:", cartItem.cart_item_table_id, "to qty:", newQuantity);

  try {
    const response = await fetch(`http://localhost:3000/api/cart/${cartItem.cart_item_table_id}`, { 
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'x-user-id': user.id.toString(),
        },
        body: JSON.stringify({ quantity: newQuantity }), 
    });
    console.log("CartContext [UPDATE_QUANTITY]: API Response Status:", response.status);
    const responseData = await response.json();
    console.log("CartContext [UPDATE_QUANTITY]: API Response Data:", responseData);

    if (!response.ok) throw new Error(responseData.error || `Failed to update quantity: ${response.status}`);
    
    console.log("CartContext [UPDATE_QUANTITY]: API call successful. Refetching cart...");
    await fetchCart(); 
    console.log("CartContext [UPDATE_QUANTITY]: Cart refetched after update for DB ID:", cartItem.cart_item_table_id);
  } catch (error) {
      console.error("CartContext [UPDATE_QUANTITY]: CRITICAL ERROR for DB ID:", cartItem.cart_item_table_id, error);
      alert(`Erreur lors de la mise à jour de la quantité : ${error.message}`);
  }
};

const removeFromCart = async (cartItem) => { 
  console.log("CartContext [REMOVE_FROM_CART]: Function called.", { cartItem });
  if (!user || !user.id || !cartItem || cartItem.cart_item_table_id === undefined) {
    console.error("CartContext [REMOVE_FROM_CART]: Aborting - Missing user or cart_item_table_id.", {user, cartItem});
    return;
  }
  console.log("CartContext [REMOVE_FROM_CART]: Attempting to remove DB ID:", cartItem.cart_item_table_id);
  try {
    const response = await fetch(`http://localhost:3000/api/cart/${cartItem.cart_item_table_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user.id.toString(),
      },
    });
    console.log("CartContext [REMOVE_FROM_CART]: API Response Status:", response.status);
    const responseData = await response.json();
    console.log("CartContext [REMOVE_FROM_CART]: API Response Data:", responseData);

    if (!response.ok) throw new Error(responseData.error || `Failed to remove from cart: ${response.status}`);
    
    console.log("CartContext [REMOVE_FROM_CART]: API call successful. Refetching cart...");
    await fetchCart(); 
    console.log("CartContext [REMOVE_FROM_CART]: Cart refetched after removal of DB ID:", cartItem.cart_item_table_id);
  } catch (error) {
    console.error("CartContext [REMOVE_FROM_CART]: CRITICAL ERROR for DB ID:", cartItem.cart_item_table_id, error);
    alert(`Erreur lors de la suppression de l'article : ${error.message}`);
  }
};

const clearCart = async () => {
  console.log("CartContext [CLEAR_CART]: Function called.");
  if (!user || !user.id) {
    console.warn("CartContext [CLEAR_CART]: Aborting - No user.");
    return;
  }
  console.log("CartContext [CLEAR_CART]: Attempting to clear cart for user ID:", user.id);
  try {
    const response = await fetch('http://localhost:3000/api/cart', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'x-user-id': user.id.toString(),
      },
    });
    console.log("CartContext [CLEAR_CART]: API Response Status:", response.status);
    const responseData = await response.json();
    console.log("CartContext [CLEAR_CART]: API Response Data:", responseData);

    if (!response.ok) throw new Error(responseData.error || `Failed to clear cart: ${response.status}`);
    
    setCartItems([]); 
    console.log("CartContext [CLEAR_CART]: Cart cleared locally and API call successful for user ID:", user.id);
  } catch (error) {
    console.error("CartContext [CLEAR_CART]: CRITICAL ERROR for user ID:", user.id, error);
    alert(`Erreur lors du vidage du panier : ${error.message}`);
  }
};
  const cartTotal = cartItems.reduce((total, item) => {
    const priceNumeric = parseFloat(String(item.price).replace(/[^0-9.-]+/g,""));
    return total + (priceNumeric * item.quantity);
  }, 0);
  const itemCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  useEffect(() => { 
      console.log("CartContext [STATE_UPDATE]: cartItems count:", cartItems.length, "loadingCart:", loadingCart);
  }, [cartItems, loadingCart]);

  if (loadingAuthState) { 
      console.log("CartContext [RENDER]: Auth state is loading. Returning null.");
      return null;
  }



  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, itemCount, loadingCart }}>
      {children}
    </CartContext.Provider>
  );
};