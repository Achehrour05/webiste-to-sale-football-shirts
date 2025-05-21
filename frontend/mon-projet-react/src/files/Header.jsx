import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Search } from 'lucide-react';
import logo from '../assets/logo.PNG'; // Logo principal du site
import DropdownContentDesign from './DropdownDesign';
import { AuthContext } from '../context/AuthProvider';
import { fetchAndFormatProducts } from '../utils/fetchProducts';
import './Header.css';

const addMockDetailsIfNeeded = (item, defaultPrice, defaultSizes) => ({
  ...item, // Important: préserve toutes les propriétés existantes, y compris 'lien'
  price: item.price || defaultPrice || `${Math.floor(Math.random() * 500 + 500)} DH`,
  availableSizes: item.availableSizes || defaultSizes || ['Taille unique'],
});

export default function NikeNavbar() {
  const [logos, setLogos] = useState([]);
  const [jackets, setJackets] = useState([]);
  const [boots, setBoots] = useState([]);
  const [balls, setBalls] = useState([]);

  useEffect(() => {
    // Assurez-vous que fetchAndFormatProducts pour les logos
    // récupère les objets avec la propriété 'lien' si elle vient de la base de données.
    fetchAndFormatProducts("http://localhost:3000/api/logos/all").then(setLogos);
    fetchAndFormatProducts("http://localhost:3000/api/products/jackets?limit=5").then(setJackets);
    fetchAndFormatProducts("http://localhost:3000/api/products/boots?limit=5").then(setBoots);
    fetchAndFormatProducts("http://localhost:3000/api/products/balls?limit=5").then(setBalls);
  }, []);

  const mockLogos = (logos ?? []).map(item => addMockDetailsIfNeeded(item));
  const mockJackets = (jackets ?? []).map(item => addMockDetailsIfNeeded(item));
  const mockBoots = (boots ?? []).map(item => addMockDetailsIfNeeded(item));
  const mockBalls = (balls ?? []).map(item => addMockDetailsIfNeeded(item));

  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  const { user, logout } = useContext(AuthContext);
  const nav = useNavigate();

  const handleLogout = () => {
    logout();
    nav('/registration');
  };

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY <= 700);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const productDetailPath = '/produit/';

  const mapProductDataForDropdown = (item, type) => {
    let itemPath = `${productDetailPath}${item.id}`; // Chemin par défaut

    // --- MODIFICATION CLÉ ICI ---
    // Si l'item est de type 'kit' et qu'il a une propriété 'lien',
    // utilisez la valeur de 'item.lien' comme chemin de navigation.
    if (type === 'kit' && item.lien) {
      itemPath = item.lien;
    }
    // --- FIN DE LA MODIFICATION CLÉ ---

    return {
      id: item.id,
      name: item.text.substring(0, 25) + (item.text.length > 25 ? '...' : ''),
      logo: item.img, // 'logo' ici est l'image pour l'élément du dropdown
      path: itemPath, // Le chemin utilisé pour la navigation du Link
      stateData: {
        id: item.id,
        img: item.img,
        text: item.text,
        price: item.price,
        availableSizes: item.availableSizes,
        productType: type,
      }
    };
  };

  const kitsDropdownData = mockLogos.map(kit => mapProductDataForDropdown(kit, 'kit'));
  const jacketsDropdownData = mockJackets.map(j => mapProductDataForDropdown(j, 'jacket'));
  const bootsDropdownData = mockBoots.map(bk => mapProductDataForDropdown(bk, 'boot'));
  const ballsDropdownData = mockBalls.map(b => mapProductDataForDropdown(b, 'ball'));

  const jacketsShopAllData = { name: 'Shop all Jackets', icon: '🧥', path: '/Jackets' };
  const bootsShopAllData = { name: 'Shop all Boots', icon: '👟', path: '/Boots' };
  const ballsShopAllData = { name: 'Shop all Balls', icon: '⚽', path: '/Balls' };

  const navCategories = [
    { name: 'Home', path: '/', dropdown: null },
    { name: 'Kits', path: '/Kits', dropdown: { items: kitsDropdownData, cols: 3 } },
    { name: 'Jackets', path: '/Jackets', dropdown: { items: jacketsDropdownData, shopAll: jacketsShopAllData, cols: 3 } },
    { name: 'Boots', path: '/Boots', dropdown: { items: bootsDropdownData, shopAll: bootsShopAllData, cols: 3 } },
    { name: 'Balls', path: '/Balls', dropdown: { items: ballsDropdownData, shopAll: ballsShopAllData, cols: 3 } },
    { name: 'Tout les produits', path: '/products', dropdown: null },
  ];

  const handleMouseEnter = index => setActiveDropdown(index);
  const handleMouseLeave = () => setActiveDropdown(null);

  return (
    <div className={`w-full sticky top-0 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      {/* Top Bar */}
      <div className="flex justify-end items-center px-6 py-1.5 bg-gray-50 border-b border-gray-200 text-xs text-black-600">
        <div className="flex items-center space-x-3 text-black">
          <Link to="/contact" className="hover:text-black no-underline text-black">Join Us</Link>
          <span className="text-gray-300">|</span>
          {user ? (
            <>
              <span className="font-medium text-sm">Bonjour, {user.name}</span>
              <button onClick={handleLogout} className="ml-2 px-2 py-1 border border-gray-300 rounded hover:bg-gray-100">Logout</button>
            </>
          ) : (
            <Link to="/registration" className="hover:text-black no-underline text-black">Sign In</Link>
          )}
        </div>
      </div>

      {/* Main Nav */}
      <div className="flex justify-between items-center px-6 py-3 relative bg-white shadow-sm">
        <Link to="/" className="block w-14 h-auto flex-shrink-0">
          <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </Link>

        <nav className="hidden md:flex space-x-6 text-sm font-medium mx-auto" onMouseLeave={handleMouseLeave}>
          {navCategories.map((category, index) => (
            <div key={category.name} className="relative" onMouseEnter={() => handleMouseEnter(index)}>
              <Link to={category.path} className="text-black hover:text-gray-700 pb-3 pt-1 inline-block no-underline border-b-2 border-transparent hover:border-black transition-colors duration-200">
                {category.name}
              </Link>
              {category.dropdown && (
                <div className={`absolute left-1/2 transform -translate-x-1/2 top-full mt-0 bg-white shadow-xl rounded-b-md p-6 z-20 border-x border-b border-gray-100 transition-opacity duration-150 ease-out ${activeDropdown === index ? 'opacity-100 visible' : 'opacity-0 invisible'}`} style={{ minWidth: `${(category.dropdown.cols || 4) * 10}rem` }}>
                  <DropdownContentDesign items={category.dropdown.items} shopAll={category.dropdown.shopAll} columns={category.dropdown.cols} />
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex align-items: center justify-content: center space-x-3 flex-shrink-0">
          <div className="relative hidden sm:block flex align-items: center justify-content: center">
            <div className="absolute inset-y-2  pl-3 flex align-items: center justify-content: center pointer-events-none ">
              <Search size={18} className="text-gray-500" />
            </div>
            <input type="text" placeholder="Search" aria-label="Search products" className="block w-full pl-10 pr-3 py-1.5 border border-transparent rounded-full text-sm bg-gray-100 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition" />
          </div>
          <Link to="/" className="p-1.5 text-black hover:bg-gray-100 rounded-full" aria-label="Wishlist">
            <Heart size={20} />
          </Link>
          <Link to="/cart" className="p-1.5 text-black hover:bg-gray-100 rounded-full" aria-label="Shopping Bag">
            <ShoppingBag size={20} />
          </Link>
        </div>
      </div>
    </div>
  );
}