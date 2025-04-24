import React from "react";
import "./Footer.css";
import { FaFacebook, FaInstagram, FaLinkedin, FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer-section">
      <div className="footer-container">
        <div className="footer-content">
          
          {/* About Section */}
          <div className="footer-about">
            <h5 className="footer-heading">SportAchehrour PRO!</h5>
            <p className="footer-text">
              Votre destination numéro un pour tout l’équipement de football.
              Chaussures, gants de gardien, et bien plus.
            </p>

            <div className="footer-contact">
              <p className="contact-info">📞 <strong>+212 679 165 767</strong></p>
              <p className="contact-text">Un conseiller est à votre disposition.</p>
              <p className="contact-email">✉️ <a href="mailto:abdessamadachehrour@gmail.com">abdessamadachehrour@gmail.com</a></p>
            </div>

            <div className="footer-social">
              <a href="#" aria-label="Facebook"><FaFacebook /></a>
              <a href="#" aria-label="Instagram"><FaInstagram /></a>
              <a href="#" aria-label="LinkedIn"><FaLinkedin /></a>
              <a href="#" aria-label="GitHub"><FaGithub /></a>
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="footer-links">
            <h5 className="footer-heading">Liens importants</h5>
            <ul className="footer-nav">
              <li><a href="#">Boutique en ligne</a></li>
              <li><a href="#">Nos Magazins</a></li>
              <li><a href="#">Notre Histoire</a></li>
              <li><a href="#">Blog</a></li>
            </ul>
          </div>

          {/* Categories Section */}
          <div className="footer-links">
            <h5 className="footer-heading">Nos Catégories</h5>
            <ul className="footer-nav">
              <li><a href="#">Chaussures de football</a></li>
              <li><a href="#">Équipements de football</a></li>
              <li><a href="#">Gants gardiens</a></li>
              <li><a href="#">Espace Enfants</a></li>
              <li><a href="#">Fans</a></li>
            </ul>
          </div>

          {/* Legal Section */}
          <div className="footer-links">
            <h5 className="footer-heading">Termes et conditions</h5>
            <ul className="footer-nav">
              <li><a href="#">Conditions Générales d’Utilisation et de Vente</a></li>
              <li><a href="#">Politique de Confidentialité et de Cookies</a></li>
              <li><a href="#">Politique de Retours et Remboursements</a></li>
            </ul>
          </div>
          
        </div>

        {/* Footer Bottom Section */}
        <div className="footer-bottom">
          <p className="footer-copyright">Copyright 2024 © Sport Achehrour PRO. Tous droits réservés.</p>
          <div className="footer-payment">
            <img src={require("../assets/cmi.jpg")} alt="CMI" />
            <img src={require("../assets/mastercard.jpg")} alt="MasterCard" />
            <img src={require("../assets/paypal.jpg")} alt="Paypal" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;