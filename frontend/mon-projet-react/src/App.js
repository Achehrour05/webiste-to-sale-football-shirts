// src/App.js
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import './App.css';

import Header from './components/Layout/Header';
import Middle from './components/Layout/Middle';
import Footer from './components/Layout/Footer';
import Shop from './components/product/Shop';
import SignUp from './pages/SignUp';
import Produit from './pages/Produit';
import English from './components/product/English';
import Spanish from './components/product/Spanish';
import Italie from './components/product/Italie';
import Other from './components/product/Other';
import France from './components/product/France';
import Germain from './components/product/Germain';
import { WishlistProvider } from "./components/wishlist/WishlistContext";
import Jackets from './components/product/Jackets';
import Balls from './components/product/Balls';
import Boots from './components/product/Boots';
import Kits from './components/product/Kits';
import ContactUs from './pages/ContactUs';
import { AuthProvider } from './context/AuthProvider';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import WishlistPage from './components/wishlist/Wishlist'; 
import { CartProvider } from './context/CartContext';
import CartPage from './pages/CartPage'; 
import CheckoutPage from './pages/CheckoutPage'
import LoginPage from './pages/LoginPage'
import AdminAddProductPage from './pages/admin/AdminAddProductPage';
import AdminLayout from './components/Layout/AdminLayout';
import ProtectedAdminRoute from './components/Layout/ProtectedAdminRoute';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProductsList from './pages/admin/AdminProductsList';
import AdminViewProductsByCategory from './pages/admin/AdminViewProductsByCategory';
import OrdersManagementPage from './pages/OrdersManagementPag'
import AdminUsersList from './pages/admin/AdminUsersList'
import AdminEditProductPage from './pages/admin/AdminEditProductPage';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const MainLayout = ({ children }) => (
  <>
    <Header />
    <ScrollToTop />
    <main>{children}</main>
    <Footer />
  </>
);

const AuthLayout = ({ children }) => (
  <>
    <Header />
    <ScrollToTop />
    <main>{children}</main>
  </>
);

const SimpleLayout = ({ children }) => (
  <>
    <ScrollToTop />
    <main>{children}</main>
  </>
);

function App() {
  return (
    <AuthProvider>
      <WishlistProvider>
        <CartProvider>
          <Router>
            <Routes>

              <Route path="/" element={<MainLayout><Middle /></MainLayout>} />
              <Route path="/products" element={<MainLayout><Shop /></MainLayout>} />
              <Route path="/produit/:id" element={<MainLayout><Produit /></MainLayout>} />
              <Route path="/english" element={<MainLayout><English /></MainLayout>} />
              <Route path="/spanish" element={<MainLayout><Spanish /></MainLayout>} />
              <Route path="/france" element={<MainLayout><France /></MainLayout>} />
              <Route path="/italie" element={<MainLayout><Italie /></MainLayout>} />
              <Route path="/other" element={<MainLayout><Other /></MainLayout>} />
              <Route path="/Jackets" element={<MainLayout><Jackets /></MainLayout>} />
              <Route path="/Balls" element={<MainLayout><Balls /></MainLayout>} />
              <Route path="/Boots" element={<MainLayout><Boots /></MainLayout>} />
              <Route path="/Kits" element={<MainLayout><Kits /></MainLayout>} />
              <Route path="/germain" element={<MainLayout><Germain /></MainLayout>} />
              <Route path="/forget-pass" element={<MainLayout><ForgotPassword /></MainLayout>} />
              <Route path="/reset-password" element={<MainLayout><ResetPassword /></MainLayout>} />
              <Route path="/wishlist" element={<MainLayout><WishlistPage /></MainLayout>} />
              <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
              <Route path="/checkout" element={<MainLayout><CheckoutPage /></MainLayout>} />
              <Route path="/orders" element={<MainLayout><OrdersManagementPage /></MainLayout>} />

              <Route path="/registration" element={<AuthLayout><SignUp /></AuthLayout>} />
              <Route path="/register" element={<AuthLayout><SignUp /></AuthLayout>} />
              <Route path="/login" element={<AuthLayout><LoginPage /></AuthLayout>} />
              <Route path="/contact" element={<AuthLayout><ContactUs /></AuthLayout>} />

              <Route element={<ProtectedAdminRoute />}>
                <Route path="/admin" element={<AdminLayout />}>
                  <Route index element={<AdminDashboard />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="products/list" element={<AdminProductsList />} />
                  <Route path="add-product" element={<AdminAddProductPage />} />
                  <Route path="products/category-view" element={<AdminViewProductsByCategory />}/>
                  <Route path="edit-product/:productId" element={<AdminEditProductPage />} />
                  <Route path="users" element={<AdminUsersList />}/>
                  <Route path="*" element={<div>Page Admin Non Trouvée</div>} />
                </Route>
              </Route>
              <Route path="*" element={<SimpleLayout><div>Page Non Trouvée</div></SimpleLayout>} />
            </Routes>
          </Router>
        </CartProvider>
      </WishlistProvider>
    </AuthProvider>
  );
}

export default App;
