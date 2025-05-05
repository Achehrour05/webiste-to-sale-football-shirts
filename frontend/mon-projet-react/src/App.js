import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from "react-router-dom";
import './App.css';

import Header from './files/Header';
import Middle from './files/Middle';
import Footer from './files/Footer';
import Shop from './files/Shop';
import SignUp from './files/SignUp';
import Produit from './files/Produit';
import English from './files/English';
import Spanish from './files/Spanish';
import Italie from './files/Italie';
import Other from './files/Other';
import France from './files/France';
import Germain from './files/Germain';
import Wishlist from './files/Wishlist';
import { WishlistProvider } from "./files/WishlistContext";
import Jackets from './files/Jackets';
import Balls from './files/Balls';
import Boots from './files/Boots';
import Kits from './files/Kits';

// Composant pour scroller en haut à chaque changement de route
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Layout avec Header et Footer autour des composants de page
const Layout = ({ children }) => (
  <>
    <Header />
    <ScrollToTop />
    {children}
    <Footer />
  </>
);

function App() {
  return (
    <WishlistProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Layout><Middle /></Layout>} />
          <Route path="/products" element={<Layout><Shop /></Layout>} />
          <Route path="/registration" element={<Layout><SignUp /></Layout>} />
          <Route path="/produit/:id" element={<Layout><Produit /></Layout>} />
          <Route path="/english" element={<Layout><English /></Layout>} />
          <Route path="/spanish" element={<Layout><Spanish /></Layout>} />
          <Route path="/france" element={<Layout><France /></Layout>} />
          <Route path="/italie" element={<Layout><Italie /></Layout>} />
          <Route path="/other" element={<Layout><Other /></Layout>} />
          <Route path="/Jackets" element={<Layout><Jackets /></Layout>} />
          <Route path="/Balls" element={<Layout><Balls/></Layout>} />
          <Route path="/Boots" element={<Layout><Boots/></Layout>} />
          <Route path="/Kits" element={<Layout><Kits/></Layout>} />
          <Route path="/germain" element={<Layout><Germain /></Layout>} />
          <Route path="/wishlist" element={<Layout><Wishlist /></Layout>} />
          <Route path="/register" element={<Layout><SignUp /></Layout>} />
        </Routes>
      </Router>
    </WishlistProvider>
  );
}

export default App;