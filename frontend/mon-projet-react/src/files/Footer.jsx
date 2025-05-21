import React from 'react';
import './Footer.css'; // We'll create this CSS file next
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="site-footer">
      <div className="footer-content">
        {/* Column 1: Produits */}
        <div className="footer-column">
          <h3 className="footer-heading">PRODUCTS</h3>
          <ul className="footer-links">
            <li><a href="#">Shoes</a></li>
            <li><a href="#">Jackets</a></li>
            <li><a href="#">Balls</a></li>
            <li><a href="#">Kits</a></li>
          </ul>
        </div>

        {/* Column 2: Sports */}
        <div className="footer-column">
          <h3 className="footer-heading">SPORTS</h3>
          <ul className="footer-links">
            <li><a href="#">Football</a></li>
          </ul>
        </div>

        {/* Column 3: Catégorie */}
        <div className="footer-column">
          <h3 className="footer-heading">CATEGORY</h3>
          <ul className="footer-links">
            <li><a href="#">Men</a></li>
            <li><a href="#">Womman</a></li>
            <li><a href="#">Children</a></li>
          </ul>
        </div>

        {/* Column 4: Information sur la société */}
        <div className="footer-column">
          <h3 className="footer-heading">COMPANY INFORMATION</h3>
          <ul className="footer-links">
            <li><a href="#">Who are we?</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Press</a></li>
            <li><a href="#">Blacora</a></li>
          </ul>
        </div>


        {/* Column 5: Assistance */}
        <div className="footer-column">
          <h3 className="footer-heading">ASSISTANCE</h3>
          <ul className="footer-links">
            <li><a href="#">Help</a></li>
            <li><a href="#">Delivery</a></li>
            <li><a href="#">Order Tracking</a></li>
            <li><a href="#">Blacora & Newsletter</a></li>
            <li><a href="#">Gift Cards</a></li>
            <li><a href="#">Contact Us</a></li>

          </ul>
        </div>

        {/* Column 6: Suivez-nous */}
        <div className="footer-column">
          <h3 className="footer-heading">FOLLOW-US</h3>
          <div className="social-icons">
            <a href="#" aria-label="Facebook"><FaFacebookF /></a>
            <a href="#" aria-label="Instagram"><FaInstagram /></a>
            <a href="#" aria-label="YouTube"><FaYoutube /></a>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <a href="#">Data Settings</a>
        <span className="footer-separator">|</span>
        <a href="#" className="country-link">
          <span role="img" aria-label="Morocco Flag">🇲🇦</span> Morocco
        </a>
        <span className="footer-separator">|</span>
        <a href="#">Cookie Settings</a>
        <span className="footer-separator">|</span>
        <a href="#">Privacy Policy</a>
        <span className="footer-separator">|</span>
        <a href="#">Terms and Conditions</a>
        <span className="footer-separator">|</span>
        <a href="#">Legal Notice</a>
    </div>
    </footer>
  );
};

export default Footer;