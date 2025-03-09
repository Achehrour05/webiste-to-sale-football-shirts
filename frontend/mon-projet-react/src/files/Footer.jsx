import React from "react";
import "./Footer.css";
import { FaFacebook, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

function Footer () {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          
          <div className="footer-column">
            <h5 className="footer-title">SportAchehrour PRO!</h5>
            <p className="footer-description">
              Votre destination numéro un pour tout l’équipement de football.
              Chaussures, gants de gardien, et bien plus.
            </p>

            <div className="contact-info">
              <p className="contact-number">📞 <strong>+212 679 165 767</strong></p>
              <p className="contact-text">Un conseiller est à votre disposition.</p>
              <p className="email">✉️ <a href="mailto:abdessamadachehrour@gmail.com">abdessamadachehrour@gmail.com</a></p>
            </div>

            <div className="social-icons">
              <a href="#"><FaFacebook /></a>
              <a href="#"><FaInstagram /></a>
              <a href="#"><FaLinkedin /></a>
              <a href="#"><FaGithub /></a>
            </div>
          </div>

          <div className="footer-column">
            <h5 className="footer-title">Liens importants</h5>
            <ul className="footer-links">
              <li><a href="#">Boutique en ligne</a></li>
              <li><a href="#">Nos Magazins</a></li>
              <li><a href="#">Notre Histoire</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="footer-column">
            <h5 className="footer-title">Nos Catégories</h5>
            <ul className="footer-links">
              <li><a href="#">Chaussures de football</a></li>
              <li><a href="#">Équipements de football</a></li>
              <li><a href="#">Gants gardiens</a></li>
              <li><a href="#">Espace Enfants</a></li>
              <li><a href="#">Fans</a></li>
            </ul>
          </div>

          {/* Terms & Conditions */}
          <div className="footer-column">
            <h5 className="footer-title">Terms et conditions</h5>
            <ul className="footer-links">
              <li><a href="#">Conditions Générales d’Utilisation et de Vente</a></li>
              <li><a href="#">Politique de Confidentialité et de Cookies</a></li>
              <li><a href="#">Politique de Retours et Remboursements</a></li>
            </ul>
          </div>
          
        </div>

        <div className="footer-bottom">
          <p>Copyright 2024 © Sport Achehrour PRO. All rights reserved.</p>
          <div className="payment-icons">
          <img src={require("../assets/cmi.jpg")} alt="CMI" />
          <img src={require("../assets/mastercard.jpg")} alt="MasterCard" />
          <img src={require("../assets/paypal.jpg")} alt="Paypal" />

          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
