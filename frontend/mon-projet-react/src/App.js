import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
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


function App() {
  return (
    <WishlistProvider> {/* Assure-toi que tout est enveloppé ici */}
      <Router>
        <Routes>
          <Route path="/" element={<><Header /><Middle /><Footer /></>} />
          <Route path="/products" element={<><Header /><Shop /><Footer /></>} />
          <Route path="/registration" element={<><Header /><SignUp /><Footer /></>} />
          <Route path="/produit/:id" element={<><Header /><Produit /><Footer /></>} />
          <Route path="/english" element={<><Header /><English /><Footer /></>} />
          <Route path="/spanish" element={<><Header /><Spanish /><Footer /></>} />
          <Route path="/france" element={<><Header /><France /><Footer /></>} />
          <Route path="/italie" element={<><Header /><Italie /><Footer /></>} />
          <Route path="/other" element={<><Header /><Other /><Footer /></>} />
          <Route path="/germain" element={<><Header /><Germain /><Footer /></>} />
          <Route path="/wishlist" element={<><Header /><Wishlist /><Footer /></>} />
        </Routes>
      </Router>
    </WishlistProvider>
  );
}

export default App;
