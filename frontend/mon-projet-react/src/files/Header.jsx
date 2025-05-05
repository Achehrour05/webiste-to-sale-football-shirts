import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Search } from 'lucide-react';
import { logos } from './AllLogos';
import { jak } from './AllJackets';
import { boots } from './AllBoots';
import { ba } from './AllBalls';

import logo from '../assets/logo.PNG';
import DropdownContentDesign from './DropdownDesign';

// --- (Keep your addMockDetailsIfNeeded and mock data setup as is) ---
const addMockDetailsIfNeeded = (item, defaultPrice, defaultSizes) => ({
    ...item,
    price: item.price || defaultPrice || `${Math.floor(Math.random() * 500 + 500)} DH`,
    availableSizes: item.availableSizes || defaultSizes || ['Taille unique'],
});

const mockLogos = (logos.lg ?? []).map(item => addMockDetailsIfNeeded(item, '750 DH', ['S', 'M', 'L', 'XL']));
const mockJackets = (jak.jacket?? []).map(item => addMockDetailsIfNeeded(item, '900 DH', ['M', 'L', 'XL', 'XXL']));
const mockBoots = (boots.BOOTS ?? []).map(item => addMockDetailsIfNeeded(item, '1200 DH', [39, 40, 41, 42, 43, 44, 45]));
const mockBalls = (ba.balls ?? []).map(item => addMockDetailsIfNeeded(item, '250 DH', ['5']));
// --- (End of mock data setup) ---

export default function NikeNavbar() {
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const handleScroll = () => {
            setIsVisible(window.scrollY <= 700);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const productDetailPath = '/produit/'; // Chemin standard

    // ****** MODIFICATION ICI ******
    const mapProductDataForDropdown = (item, type) => {
        let itemPath; // Variable pour stocker le chemin final

        // Vérifier si c'est un item de type 'kit' ET s'il a un chemin spécifique défini
        if (type === 'kit') {
            itemPath = item.path; // Utiliser le chemin spécifique des données
        } else {
            // Pour tous les autres types (jacket, boot, ball)
            // OU pour les kits qui n'ont PAS de 'specificPath' défini dans les données
            itemPath = `${productDetailPath}${item.id}`; // Utiliser le chemin standard

            // Optionnel : Avertir si un kit n'a pas de chemin spécifique
            if (type === 'kit' && !item.specificPath) {
                console.warn(`Kit item ID ${item.id} ('${item.text}') is missing 'specificPath' in AllLogos.js. Using default path: ${itemPath}`);
            }
        }

        return {
            id: item.id,
            // Limiter la longueur du nom pour l'affichage dans le dropdown
            name: item.text.substring(0, 25) + (item.text.length > 25 ? '...' : ''),
            logo: item.img, // Utiliser 'logo' pour la cohérence avec DropdownContentDesign ? ou garder img ?
            path: itemPath, // <<< Utilise le chemin déterminé (spécifique ou standard)
            stateData: { // Les données passées à la page de destination via state
                id: item.id,
                img: item.img,
                text: item.text,
                price: item.price,
                availableSizes: item.availableSizes,
                productType: type
                // Vous pourriez vouloir passer aussi le 'specificPath' ici si la page de destination en a besoin
                // specificPath: item.specificPath
            }
        };
    };
    // ****** FIN DE LA MODIFICATION ******

    // Générer les données pour les dropdowns en utilisant la fonction modifiée
    const kitsDropdownData = mockLogos.map(kit => mapProductDataForDropdown(kit, 'kit')); // Applique la logique spécifique/standard
    const jacketsDropdownData = mockJackets.map(jacket => mapProductDataForDropdown(jacket, 'jacket')); // Utilise toujours le chemin standard
    const bootsDropdownData = mockBoots.map(boot => mapProductDataForDropdown(boot, 'boot'));       // Utilise toujours le chemin standard
    const ballsDropdownData = mockBalls.map(ball => mapProductDataForDropdown(ball, 'ball'));         // Utilise toujours le chemin standard


    // Liens "Shop All" pour les autres catégories
    const jacketsShopAllData = { name: 'Shop all Jackets', icon: '🧥', path: '/Jackets' };
    const bootsShopAllData = { name: 'Shop all Boots', icon: '👟', path: '/Boots' };
    const ballsShopAllData = { name: 'Shop all Balls', icon: '⚽', path: '/Balls' };

    // Définir le chemin du lien principal "Kits"
    const specificKitsUrl = "/maillots"; // Ou l'URL que vous voulez pour le clic sur "Kits"

    // Configuration des catégories de navigation
    const navCategories = [
        { name: "Home", path: "/", dropdown: null },
        {
            name: "Kits",
            path: "/Kits", // Lien principal pour la catégorie Kits
            dropdown: { items: kitsDropdownData, cols: 3 } // Le dropdown contient les items avec leurs chemins (spécifiques ou standard)
        },
        { name: "Jackets", path: "/Jackets", dropdown: { items: jacketsDropdownData, shopAll: jacketsShopAllData, cols: 3 } }, // Chemins standards pour les items ici
        { name: "Boots", path: "/Boots", dropdown: { items: bootsDropdownData, shopAll: bootsShopAllData, cols: 3 } },       // Chemins standards pour les items ici
        { name: "Balls", path: "/Balls", dropdown: { items: ballsDropdownData, shopAll: ballsShopAllData, cols: 3 } },         // Chemins standards pour les items ici
        { name: "Tout les produits", path: "/products", dropdown: null },
    ];

    const handleMouseEnter = (index) => setActiveDropdown(index);
    const handleMouseLeave = () => setActiveDropdown(null);

    return (
        // --- Le reste du JSX de votre composant NikeNavbar reste identique ---
        <div className={`w-full sticky top-0 z-50 transition-opacity duration-300 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Top Bar */}
            <div className="flex justify-end items-center px-6 py-1.5 bg-gray-50 border-b border-gray-200 text-xs text-gray-600">
                 <div className="flex items-center space-x-3">
                    <Link to="#" className="hover:text-black no-underline">Find a Store</Link>
                    <span className="text-gray-300">|</span>
                    <Link to="#" className="hover:text-black no-underline">Help</Link>
                    <span className="text-gray-300">|</span>
                    <Link to="#" className="hover:text-black no-underline">Join Us</Link>
                    <span className="text-gray-300">|</span>
                    <Link to="#" className="hover:text-black no-underline">Sign In</Link>
                </div>
            </div>
            {/* Main Nav */}
            <div className="flex justify-between items-center px-6 py-3 relative bg-white shadow-sm">
                 {/* Logo */}
                <Link to="/" className="block w-14 h-auto flex-shrink-0">
                    <img src={logo} alt="Logo" className="w-full h-full object-contain" />
                </Link>
                 {/* Nav Links */}
                <nav className="hidden md:flex space-x-6 text-sm font-medium mx-auto" onMouseLeave={handleMouseLeave}>
                    {navCategories.map((category, index) => (
                        <div
                            key={category.name}
                            className="relative"
                            onMouseEnter={() => handleMouseEnter(index)}
                        >
                            <Link
                                to={category.path}
                                className="text-black hover:text-gray-700 pb-3 pt-1 inline-block no-underline border-b-2 border-transparent hover:border-black transition-colors duration-200"
                                aria-haspopup={!!category.dropdown}
                            >
                                {category.name}
                            </Link>
                            {/* Dropdown */}
                            {category.dropdown && (
                                <div
                                    className={`
                                        absolute left-1/2 transform -translate-x-1/2 top-full mt-0 bg-white shadow-xl rounded-b-md
                                        p-6 z-20 border-x border-b border-gray-100
                                        transition-opacity duration-150 ease-out
                                        ${activeDropdown === index ? 'opacity-100 visible' : 'opacity-0 invisible'}
                                    `}
                                    onMouseEnter={() => handleMouseEnter(index)}
                                    onMouseLeave={handleMouseLeave}
                                    style={{ minWidth: `${(category.dropdown.cols || 4) * 10}rem` }}
                                >
                                    <DropdownContentDesign
                                        items={category.dropdown.items} // Passe les items (avec leurs chemins corrects)
                                        shopAll={category.dropdown.shopAll}
                                        columns={category.dropdown.cols}
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </nav>
                {/* Icons */}
                 <div className="flex items-center space-x-3 flex-shrink-0">
                   <div className="relative hidden sm:block">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                           <Search size={18} className="text-gray-500" />
                        </div>
                        <input
                          type="text" placeholder="Search" aria-label="Search products"
                          className="block w-full pl-10 pr-3 py-1.5 border border-transparent rounded-full text-sm bg-gray-100 placeholder-gray-500 focus:outline-none focus:bg-white focus:border-gray-300 focus:ring-1 focus:ring-gray-300 transition"
                        />
                    </div>
                    <Link to="/wishlist" className="p-1.5 text-black hover:bg-gray-100 rounded-full" aria-label="Wishlist">
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