
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';

const ProtectedAdminRoute = () => {
  const { user, loadingAuthState } = useAuth(); 
  const location = useLocation();

  console.log("ProtectedAdminRoute: State Check - loadingAuthState:", loadingAuthState, "| User Object:", user);

  if (loadingAuthState) {
    console.log("ProtectedAdminRoute: Auth state still loading. Displaying loader.");
    return <div className="flex justify-center items-center h-screen"><p>Vérification de l'authentification...</p></div>;
  }

  if (!user) {

    console.log("ProtectedAdminRoute: User NOT logged in. Redirecting to /login. Current location:", location.pathname);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("ProtectedAdminRoute: User IS logged in. Checking admin status...");
  console.log("ProtectedAdminRoute: User object details:", JSON.stringify(user, null, 2)); 
  console.log("ProtectedAdminRoute: Value of user.isAdmin:", user.isAdmin);
  console.log("ProtectedAdminRoute: Type of user.isAdmin:", typeof user.isAdmin);


  if (!user.isAdmin) { 
    console.log("ProtectedAdminRoute: User IS NOT an admin. Redirecting to home page (/). User isAdmin flag:", user.isAdmin);
    return <Navigate to="/" replace />; 
  }

  console.log("ProtectedAdminRoute: User IS an admin. Allowing access to admin route. User:", user.name, "isAdmin:", user.isAdmin);
  return <Outlet />; 
};

export default ProtectedAdminRoute;