
import React, { createContext, useState, useContext, useEffect } from 'react';

export const AuthContext = createContext(null); 

const ADMIN_EMAIL_FROM_ENV = process.env.REACT_APP_ADMIN_EMAIL; 
const ADMIN_EMAIL = ADMIN_EMAIL_FROM_ENV ? ADMIN_EMAIL_FROM_ENV.trim() : 'valeur_par_defaut_si_besoin@example.com'; // Fournir un fallback ou vérifier

console.log("AuthProvider: ADMIN_EMAIL chargé depuis .env:", ADMIN_EMAIL); 

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loadingAuthState, setLoadingAuthState] = useState(true);


  useEffect(() => {
    console.log("AuthProvider [MOUNT]: Attempting to load user from localStorage.");
    try {
      const storedUserJSON = localStorage.getItem('currentUser');
      console.log("AuthProvider [MOUNT]: Raw 'currentUser' from localStorage:", storedUserJSON);

      if (storedUserJSON && storedUserJSON !== "undefined" && storedUserJSON !== "null") {
        const storedUser = JSON.parse(storedUserJSON);
        console.log("AuthProvider [MOUNT]: Parsed user from localStorage:", storedUser);

        if (storedUser && typeof storedUser === 'object' && storedUser.id && storedUser.email) {

          const isCurrentUserAdmin = storedUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
          
          console.log("AuthProvider [MOUNT DEBUG]: Checking admin status for stored user:");
          console.log("   Stored User Email (lower):", `"${storedUser.email.toLowerCase()}"`);
          console.log("   ADMIN_EMAIL (lower):      ", `"${ADMIN_EMAIL.toLowerCase()}"`);
          console.log("   Calculated isAdmin now:   ", isCurrentUserAdmin);

          const finalUserObject = {
            ...storedUser,
            isAdmin: isCurrentUserAdmin, 
          };

          if (storedUser.isAdmin !== isCurrentUserAdmin) {
            console.warn("AuthProvider [MOUNT]: Stored 'isAdmin' flag differs from current calculation. Updating localStorage.");
            try {
                localStorage.setItem('currentUser', JSON.stringify(finalUserObject));
            } catch (e) {
                console.error("AuthProvider [MOUNT]: Could not update 'isAdmin' in localStorage during mount.", e);
            }
          }

          setUser(finalUserObject);
          console.log("AuthProvider [MOUNT]: User state SET from localStorage with corrected isAdmin flag:", finalUserObject);

        } else {
          console.warn("AuthProvider [MOUNT]: Stored user is invalid or lacks id/email. Clearing localStorage.");
          localStorage.removeItem('currentUser');
        }
      } else {
        console.log("AuthProvider [MOUNT]: No valid 'currentUser' found in localStorage.");
      }
    } catch (error) {
      console.error("AuthProvider [MOUNT]: Error parsing user from localStorage. Clearing localStorage.", error);
      localStorage.removeItem('currentUser');
    }
    setLoadingAuthState(false);
    console.log("AuthProvider [MOUNT]: Finished loading auth state. loadingAuthState is now false.");
  }, []);


  const login = (userDataFromLoginApi) => { 
    console.log("AuthProvider [LOGIN]: login function called. Received user data from API:", userDataFromLoginApi);

    if (userDataFromLoginApi && userDataFromLoginApi.id && userDataFromLoginApi.email) {
      const userEmailLower = userDataFromLoginApi.email.toLowerCase();
      const adminEmailLower = ADMIN_EMAIL.toLowerCase();
      const isAdminUser = userEmailLower === adminEmailLower;

      console.log("AuthProvider [LOGIN DEBUG]: Email comparison for admin status:");
      console.log("   User Email (lower):", `"${userEmailLower}"`);
      console.log("   ADMIN_EMAIL (lower):", `"${adminEmailLower}"`);
      console.log("   Is Admin Result:  ", isAdminUser);

      const userToStoreAndSet = {
        ...userDataFromLoginApi,
        isAdmin: isAdminUser,
      };

      setUser(userToStoreAndSet);
      console.log("AuthProvider [LOGIN]: User state SET with isAdmin flag:", userToStoreAndSet);
      try {
        localStorage.setItem('currentUser', JSON.stringify(userToStoreAndSet));
        console.log("AuthProvider [LOGIN]: User (with isAdmin flag) saved to localStorage:", userToStoreAndSet);
      } catch (error) {
        console.error("AuthProvider [LOGIN]: CRITICAL ERROR trying to save user to localStorage!", error);
      }
    } else {
      console.error("AuthProvider [LOGIN]: Invalid user object passed to login (missing id or email). Received:", userDataFromLoginApi);
    }
  };

  const logout = () => {
    console.log("AuthProvider [LOGOUT]: logout function called.");
    setUser(null);
    try {
      localStorage.removeItem('currentUser');
      console.log("AuthProvider [LOGOUT]: 'currentUser' (and 'authToken' if used) REMOVED from localStorage.");
    } catch (error) {
      console.error("AuthProvider [LOGOUT]: Error removing user data from localStorage!", error);
    }
  };


  useEffect(() => {
    console.log("AuthProvider [STATE_UPDATE]: User state has been updated to:", user);
    console.log("AuthProvider [STATE_UPDATE]: loadingAuthState has been updated to:", loadingAuthState);
  }, [user, loadingAuthState]);


  if (loadingAuthState) {
    console.log("AuthProvider [RENDER]: loadingAuthState is true. Returning null to prevent premature rendering of children.");
    return null;
  }

  console.log("AuthProvider [RENDER]: Rendering Provider. User:", user, "LoadingAuthState:", loadingAuthState);
  return (
    <AuthContext.Provider value={{ user, login, logout, loadingAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined || context === null) { 
    console.error("useAuth Error: AuthContext is not yet available. This usually means AuthProvider is still in its loading state or useAuth is called outside of an AuthProvider's tree.");

    throw new Error('useAuth must be used within an AuthProvider and after its initial loading phase has completed.');
  }
  return context;
};