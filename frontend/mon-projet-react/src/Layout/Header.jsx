
import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, Search, Menu, X, UserCog,ChevronDown } from 'lucide-react'; 
import DropdownContentDesign from '../ui/DropdownDesign';
import { AuthContext } from '../../context/AuthProvider'; 
import { fetchAndFormatProducts } from '../../utils/fetchProducts'; 
import './Header.css';

const addMockDetailsIfNeeded = (item, defaultPrice, defaultSizes) => ({
  ...item,
  price: item.price || defaultPrice || `${Math.floor(Math.random() * 500 + 500)} DH`,
  availableSizes: item.availableSizes || defaultSizes || ['Taille unique'],
});

export default function NikeNavbar() {

  const [logos, setLogos] = useState([]);
  const [jackets, setJackets] = useState([]);
  const [boots, setBoots] = useState([]);
  const [balls, setBalls] = useState([]);


  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState(null);
  const [activeDropdown, setActiveDropdown] = useState(null); 
  const [isVisible, setIsVisible] = useState(true); 


  const auth = useContext(AuthContext);
  const user = auth ? auth.user : null;
  const logout = auth ? auth.logout : () => console.warn("AuthProvider context not fully loaded for logout");

  const navigate = useNavigate(); 
  useEffect(() => {
    fetchAndFormatProducts("http://localhost:3000/api/logos/all").then(data => setLogos(data || []));
    fetchAndFormatProducts("http://localhost:3000/api/products/jackets?limit=5").then(data => setJackets(data || []));
    fetchAndFormatProducts("http://localhost:3000/api/products/boots?limit=5").then(data => setBoots(data || []));
    fetchAndFormatProducts("http://localhost:3000/api/products/balls?limit=5").then(data => setBalls(data || []));
  }, []);


  const mockLogos = (logos ?? []).map(item => addMockDetailsIfNeeded(item));
  const mockJackets = (jackets ?? []).map(item => addMockDetailsIfNeeded(item));
  const mockBoots = (boots ?? []).map(item => addMockDetailsIfNeeded(item));
  const mockBalls = (balls ?? []).map(item => addMockDetailsIfNeeded(item));

  const productDetailPath = '/produit/';
  const mapProductDataForDropdown = (item, type) => {
    let itemPath = `${productDetailPath}${item.id || 'default'}`; 
    if (type === 'kit' && item.lien) itemPath = item.lien;
    return {
      id: item.id || Date.now() + Math.random(), 
      name: item.text ? (item.text.substring(0, 25) + (item.text.length > 25 ? '...' : '')) : "Produit",
      logo: item.img || '/assets/default-product.jpg', 
      path: itemPath,
      stateData: { id: item.id, img: item.img, text: item.text, price: item.price, availableSizes: item.availableSizes, productType: type }
    };
  };

  const kitsDropdownData = mockLogos.map(kit => mapProductDataForDropdown(kit, 'kit'));
  const jacketsDropdownData = mockJackets.map(j => mapProductDataForDropdown(j, 'jacket'));
  const bootsDropdownData = mockBoots.map(bk => mapProductDataForDropdown(bk, 'boot'));
  const ballsDropdownData = mockBalls.map(b => mapProductDataForDropdown(b, 'ball'));

  const jacketsShopAllData = { name: 'Tout voir Vestes', icon: '🧥', path: '/Jackets' };
  const bootsShopAllData = { name: 'Tout voir Chaussures', icon: '👟', path: '/Boots' };
  const ballsShopAllData = { name: 'Tout voir Ballons', icon: '⚽', path: '/Balls' };

  const navCategories = [
    { name: 'Accueil', path: '/', dropdown: null },
    { name: 'Kits', path: '/Kits', dropdown: { items: kitsDropdownData, cols: 3 } },
    { name: 'Vestes', path: '/Jackets', dropdown: { items: jacketsDropdownData, shopAll: jacketsShopAllData, cols: 3 } },
    { name: 'Chaussures', path: '/Boots', dropdown: { items: bootsDropdownData, shopAll: bootsShopAllData, cols: 3 } },
    { name: 'Ballons', path: '/Balls', dropdown: { items: ballsDropdownData, shopAll: ballsShopAllData, cols: 3 } },
    { name: 'Tous les produits', path: '/products', dropdown: null },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login'); 
  };

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY <= 150); 
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  const handleMouseEnter = index => setActiveDropdown(index);
  const handleMouseLeave = () => setActiveDropdown(null);

  const toggleMobileDropdown = (index) => {
    setActiveMobileDropdown(activeMobileDropdown === index ? null : index);
  };

  const toggleMobileMenu = () => {
    const newMenuState = !mobileMenuOpen;
    setMobileMenuOpen(newMenuState);
    document.body.style.overflow = newMenuState ? 'hidden' : 'auto';
  };

  const closeMobileMenuAndDropdowns = () => {
    setMobileMenuOpen(false);
    setActiveMobileDropdown(null);
    document.body.style.overflow = 'auto';
  };
  
  useEffect(() => {
    console.log("Header: User from context:", user);
  }, [user]);


  return (
    <div className={`w-full sticky top-0 z-50 bg-white shadow-md transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-90 backdrop-blur-sm'}`}>
      <div className="flex justify-end items-center px-4 sm:px-6 py-2 bg-gray-100 border-b border-gray-200 text-xs">
        <div className="flex items-center space-x-2 sm:space-x-3 text-gray-700">
          {user && user.isAdmin && (
            <>
              <Link to="/admin/dashboard" className="flex items-center font-medium text-black hover:text-indigo-800 no-underline">
                <UserCog size={14} className="mr-1 stroke-current" />
                Admin
              </Link>
              <span className="text-gray-300">|</span>
            </>
          )}
          <Link to="/contact" className="text-black no-underline">Contact Us</Link>
          <span className="text-gray-300">|</span>
          {user ? (
            <>
              <Link to="/profile" className="text-black no-underline font-medium">
                Bonjour, {user.name || 'Utilisateur'}
              </Link>
              <span className="text-gray-300">|</span>
              <Link 
                onClick={handleLogout} 
                className="hover:text-black no-underline cursor-pointer text-black border-none p-0 text-xs font-medium"
              >
                Déconnexion
              </Link>
            </>
          ) : (
            <Link to="/login" className="text-black no-underline font-medium">Se Connecter</Link>
          )}
        </div>
      </div>


      <div className="flex justify-between items-center px-4 sm:px-6 py-3 relative">
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-black bg-white  focus:outline-none p-2 -ml-2"
            aria-label="Ouvrir le menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <Link to="/" className="block w-12 h-auto sm:w-14 flex-shrink-0 md:absolute md:left-6 md:top-1/2 md:-translate-y-1/2">
          <img src={`http://localhost:3000/assets/logov2.png`} alt="Logo" className="w-full h-full object-contain" />
        </Link>

        <nav className="hidden md:flex space-x-3 lg:space-x-5 text-sm font-semibold mx-auto" onMouseLeave={handleMouseLeave}>
          {navCategories.map((category, index) => (
            <div key={category.name} className="relative" onMouseEnter={() => handleMouseEnter(index)}>
              <Link 
                to={category.path} 
                className="text-gray-700 hover:text-black py-2 px-2 lg:px-3 rounded-md transition-colors duration-200 no-underline"
               
              >
                {category.name}
              </Link>
              {category.dropdown && (
                <div 
                  onMouseLeave={handleMouseLeave}
                  className={`absolute left-1/2 transform -translate-x-1/2 top-full mt-0 bg-white shadow-xl rounded-b-md p-6 z-20 border-x border-b border-gray-100 transition-opacity duration-150 ease-out ${activeDropdown === index ? 'opacity-100 visible' : 'opacity-0 invisible'}`} style={{ minWidth: `${(category.dropdown.cols || 4) * 10}rem` }}
                >
                  <DropdownContentDesign 
                    items={category.dropdown.items} 
                    shopAll={category.dropdown.shopAll} 
                    columns={category.dropdown.cols || 1}
                  />
                </div>
              )}
            </div>
          ))}
        </nav>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <Link to="/wishlist" className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-colors" aria-label="Wishlist">
            <Heart size={22} />
          </Link>
          <Link to="/cart" className="p-2 text-gray-600 hover:text-black hover:bg-gray-100 rounded-full transition-colors relative" aria-label="Shopping Bag">
            <ShoppingBag size={22} />
            </Link>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 flex">
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={closeMobileMenuAndDropdowns} aria-hidden="true"></div>
            
            <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white dark:bg-gray-800 shadow-xl pt-5 pb-4 overflow-y-auto">
                <div className="absolute top-3 right-3">
                    <button
                        type="button"
                        className="h-[25px] w-[25px] bg-white rounded-md inline-flex items-center justify-center text-black "
                        onClick={closeMobileMenuAndDropdowns}
                    >
                        <span className="sr-only">Close menu</span>
                        <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                </div>

                <div className="mt-8 px-4">
                    
              
                    <nav className="flex flex-col space-y-1">
                        {navCategories.map((category, index) => (
                        <div key={`${category.name}-mobile`} className="border-b border-gray-100 last:border-b-0">
                            <div 
                                className="flex justify-between items-center py-3 text-gray-700 hover:text-black hover:bg-gray-50 rounded-md px-2"
                                onClick={() => category.dropdown && toggleMobileDropdown(index)}
                            >
                            <Link 
                                to={category.path} 
                                className="font-medium no-underline flex-grow text-current"
                                onClick={!category.dropdown ? closeMobileMenuAndDropdowns : (e) => {
                                    if (activeMobileDropdown === index && category.dropdown) {} 
                                    else if (!category.dropdown) { closeMobileMenuAndDropdowns(); }
                                }}
                            >
                                {category.name}
                            </Link>
                            {category.dropdown && (
                                <ChevronDown className={`w-5 h-5 text-gray-400 bg-white transform transition-transform duration-200 ${activeMobileDropdown === index ? 'rotate-180' : ''}`} />
                            )}
                            </div>
                            
                            {category.dropdown && activeMobileDropdown === index && (
                            <div className="pl-5 py-2 bg-gray-50 rounded-b-md"> 
                                <DropdownContentDesign 
                                    items={category.dropdown.items} 
                                    shopAll={category.dropdown.shopAll} 
                                    columns={1} 
                                    isMobile
                                    onItemClick={closeMobileMenuAndDropdowns} 
                                />
                            </div>
                            )}
                        </div>
                        ))}
                    </nav>
              
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="flex flex-col space-y-4">
                            <Link to="/wishlist" onClick={closeMobileMenuAndDropdowns} className="flex items-center p-2 -m-2 text-gray-700 hover:bg-gray-50 hover:text-black rounded-md"><Heart className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />Wishlist</Link>
                            <Link to="/cart" onClick={closeMobileMenuAndDropdowns} className="flex items-center p-2 -m-2 text-gray-700 hover:bg-gray-50 hover:text-black rounded-md"><ShoppingBag className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />Panier</Link>
                            {user && user.isAdmin && (
                                <Link to="/admin/dashboard" onClick={closeMobileMenuAndDropdowns} className="flex items-center p-2 -m-2 text-gray-700 hover:bg-gray-50 hover:text-black rounded-md"><UserCog className="mr-3 h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-gray-500" />Admin</Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}