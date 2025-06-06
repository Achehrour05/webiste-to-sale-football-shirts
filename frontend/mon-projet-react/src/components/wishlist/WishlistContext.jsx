import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthProvider'; 

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState(true); 
  const { user, loadingAuthState } = useAuth(); 

  const fetchWishlist = useCallback(async () => {
    if (loadingAuthState || !user || !user.id) {
      console.log("WishlistContext: fetchWishlist - Aborted. Auth state loading or no user.", { loadingAuthState, userId: user?.id });
      setWishlist([]); 
      setLoadingWishlist(false); 
      return;
    }

    console.log("WishlistContext: fetchWishlist - Attempting to fetch for user ID:", user.id);
    setLoadingWishlist(true);
    try {
      const response = await fetch('http://localhost:3000/api/wishlist', {
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id.toString(),
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch wishlist: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      setWishlist(data || []);
      console.log("WishlistContext: fetchWishlist - Successfully fetched:", data);
    } catch (error) {
      console.error("WishlistContext: fetchWishlist - Error:", error);
      setWishlist([]); 
    } finally {
      setLoadingWishlist(false);
    }
  }, [user, loadingAuthState]); 
  useEffect(() => {
    console.log("WishlistContext: useEffect [user, loadingAuthState] triggered. Calling fetchWishlist.");
    fetchWishlist();
  }, [fetchWishlist]); 

  const addToWishlist = async (product) => {
    if (!user || !user.id) {
      console.warn("WishlistContext: addToWishlist - User not logged in.");
      return;
    }
    console.log("WishlistContext: addToWishlist - Adding product:", product.id, "for user:", user.id);

    const productData = {
      text: product.text,
      price: product.price,
      path: product.path || product.img, 
    };

    try {
      const response = await fetch('http://localhost:3000/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id.toString(),
        },  
        body: JSON.stringify({ productId: product.id.toString(), productData }),
      });
      if (!response.ok) {
        if (response.status === 409) { 
          console.log("WishlistContext: addToWishlist - Item already in wishlist (server).", product.id);
          if (!wishlist.find(item => item.id.toString() === product.id.toString())) {
             setWishlist(prev => [...prev, { id: product.id.toString(), ...productData }]);
          }
          return;
        }
        throw new Error(`Failed to add item: ${response.status}`);
      }
      const addedItem = await response.json(); 
      setWishlist((prev) => [...prev, addedItem]); 
      console.log("WishlistContext: addToWishlist - Item added successfully:", addedItem);
    } catch (error) {
      console.error("WishlistContext: addToWishlist - Error:", error);
    }
  };

  const removeFromWishlist = async (productId) => {
    if (!user || !user.id) {
      console.warn("WishlistContext: removeFromWishlist - User not logged in.");
      return;
    }
    console.log("WishlistContext: removeFromWishlist - Removing product ID:", productId, "for user:", user.id);
    try {
      const response = await fetch(`http://localhost:3000/api/wishlist/${productId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id.toString(),
        },
      });
      if (!response.ok) {
        throw new Error(`Failed to remove item: ${response.status}`);
      }
      setWishlist((prev) => prev.filter((item) => item.id.toString() !== productId.toString()));
      console.log("WishlistContext: removeFromWishlist - Item removed successfully, ID:", productId);
    } catch (error) {
      console.error("WishlistContext: removeFromWishlist - Error:", error);
    }
  };

  const toggleWishlist = (product) => {
    if (!user) {
        alert("Please log in to manage your wishlist.");
        return;
    }
    const existingItem = wishlist.find((item) => item.id.toString() === product.id.toString());
    if (existingItem) {
      removeFromWishlist(product.id.toString());
    } else {
      if (product && product.id && product.text && product.price && (product.path || product.img)) {
        addToWishlist(product);
      } else {
        console.error("WishlistContext: toggleWishlist - Invalid product data for adding:", product);
      }
    }
  };

  const isWishlisted = (productId) => {
    return wishlist.some((item) => item.id.toString() === productId.toString());
  };

  console.log("WishlistContext [RENDER]: Rendering. loadingWishlist:", loadingWishlist, "Wishlist items:", wishlist.length);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isWishlisted, loadingWishlist, fetchWishlist  }}>
      {children}
    </WishlistContext.Provider>
  );
};