
import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuthState, setLoadingAuthState] = useState(true); 

  useEffect(() => {
    console.log("AuthProvider [MOUNT]: Reading localStorage.");
    try {
      const storedUserJSON = localStorage.getItem('currentUser');
      if (storedUserJSON && storedUserJSON !== "undefined" && storedUserJSON !== "null") {
        const parsedUser = JSON.parse(storedUserJSON);
        if (parsedUser && typeof parsedUser === 'object' && parsedUser.id) {
          setUser(parsedUser);
          console.log("AuthProvider [MOUNT]: User SET from localStorage:", parsedUser);
        } else {
          localStorage.removeItem('currentUser'); 
        }
      }
    } catch (error) {
      console.error("AuthProvider [MOUNT]: Error parsing localStorage. Clearing.", error);
      localStorage.removeItem('currentUser');
    }
    setLoadingAuthState(false); 
  }, []); 

  const login = (userDataFromApi) => {
    console.log("AuthProvider [LOGIN]: login called. Data from API:", userDataFromApi);

    const userObjectToStore = userDataFromApi; 

    if (userObjectToStore && userObjectToStore.id) {
      try {
        const userJSON = JSON.stringify(userObjectToStore);
        localStorage.setItem('currentUser', userJSON);
        const checkUser = localStorage.getItem('currentUser'); 
        if (checkUser === userJSON) {
          console.log("AuthProvider [LOGIN]: currentUser WRITTEN&VERIFIED:", checkUser);
          setUser(userObjectToStore); 
        } else {
          console.error("AuthProvider [LOGIN]: FAILED TO VERIFY currentUser in localStorage.");
        }
      } catch (error) {
        console.error("AuthProvider [LOGIN]: CRITICAL localStorage ERROR!", error);
      }
    } else {
      console.error("AuthProvider [LOGIN]: Invalid user object passed to login.", userObjectToStore);
    }
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('authToken'); 
      console.log("AuthProvider [LOGOUT]: localStorage cleared.");
    } catch (error) {
      console.error("AuthProvider [LOGOUT]: Error clearing localStorage.", error);
    }
  };

  useEffect(() => {
  }, [user, loadingAuthState]);

  if (loadingAuthState) {
    console.log("AuthProvider [RENDER]: loadingAuthState is true, returning null.");
    return null; 
  }

  console.log("AuthProvider [RENDER]: Rendering with user:", user);
  return (
    <AuthContext.Provider value={{ user, login, logout, loadingAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) {
    throw new Error('useAuth must be used within an AuthProvider and after initial loading.');
  }
  return context;
};