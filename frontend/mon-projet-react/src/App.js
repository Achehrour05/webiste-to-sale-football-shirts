import React from 'react';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import './App.css';
import Header from './files/Header';
import Middle from './files/Middle';
import Footer from './files/Footer';
import Shop from './files/Shop';
import SignUp from './files/SignUp';
import Produit from './files/Produit';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<><Header /><Middle /><Footer /></>} />
        <Route path="/products" element={<><Header /><Shop /><Footer /></>} />
        <Route path="/registration" element={<><Header /><SignUp /><Footer /></>} />
        <Route path="/produit/:id" element={<><Header /><Produit /><Footer /></>} />
      </Routes>
    </Router>
  );
}

export default App;
