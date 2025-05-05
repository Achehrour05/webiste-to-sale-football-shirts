import React from 'react';
import './Footer.css'; // We'll create this CSS file next
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        {/* Column 1: Produits */}
        <div className="footer-column">
          <h3 className="footer-heading">PRODUITS</h3>
          <ul className="footer-links">
            <li><a href="#">Chaussures</a></li>
            <li><a href="#">Vêtements</a></li>
            <li><a href="#">Accessories</a></li>
          </ul>
        </div>

        {/* Column 2: Sports */}
        <div className="footer-column">
          <h3 className="footer-heading">SPORTS</h3>
          <ul className="footer-links">
            <li><a href="#">Running</a></li>
            <li><a href="#">Basketball</a></li>
            <li><a href="#">Football</a></li>
            <li><a href="#">Yoga</a></li>
            <li><a href="#">Outdoor</a></li>
            <li><a href="#">Tennis</a></li>
            <li><a href="#">Training</a></li>
          </ul>
        </div>

        {/* Column 3: Catégorie */}
        <div className="footer-column">
          <h3 className="footer-heading">CATÉGORIE</h3>
          <ul className="footer-links">
            <li><a href="#">Hommes</a></li>
            <li><a href="#">Femmes</a></li>
            <li><a href="#">Enfants</a></li>
            <li><a href="#">Outlet</a></li>
          </ul>
        </div>

        {/* Column 4: Information sur la société */}
        <div className="footer-column">
          <h3 className="footer-heading">INFORMATION SUR LA SOCIETE</h3>
          <ul className="footer-links">
            <li><a href="#">Qui sommes nous ?</a></li>
            <li><a href="#">Emploi</a></li>
            <li><a href="#">Presse</a></li>
            <li><a href="#">adiClub</a></li>
          </ul>
        </div>

        {/* Column 5: Assistance */}
        <div className="footer-column">
          <h3 className="footer-heading">ASSISTANCE</h3>
          <ul className="footer-links">
            <li><a href="#">Aide</a></li>
            <li><a href="#">Livraison</a></li>
            <li><a href="#">Retours</a></li>
            <li><a href="#">Suivi de commande</a></li>
            <li><a href="#">adiClub & Newsletter</a></li>
            <li><a href="#">Cartes cadeau</a></li>
            <li><a href="#">Tableaux des tailles</a></li>
            <li><a href="#">Nous contacter</a></li>
            <li><a href="#">Trouver un magasin</a></li>
          </ul>
        </div>

        {/* Column 6: Suivez-nous */}
        <div className="footer-column">
          <h3 className="footer-heading">SUIVEZ-NOUS</h3>
          <div className="social-icons">
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <a href="#">Paramètres de données</a>
        <span className="footer-separator">|</span>
        <a href="#" className="country-link">
          <span role="img" aria-label="Morocco Flag">🇲🇦</span> Morocco
        </a>
        <span className="footer-separator">|</span>
        <a href="#">Paramètres des cookies</a>
        <span className="footer-separator">|</span>
        <a href="#">Politique de protection des données personnelles</a>
        <span className="footer-separator">|</span>
        <a href="#">Conditions générales</a>
        <span className="footer-separator">|</span>
        <a href="#">Mentions légales</a>
      </div>
    </footer>
  );
};

export default Footer;