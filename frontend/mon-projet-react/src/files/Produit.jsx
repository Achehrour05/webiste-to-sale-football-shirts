import React, { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate, Link, useParams } from "react-router-dom";
import "./Produit.css"; // Assuming you have styles here

// Importez les données de produits
import { logos } from './AllLogos';
import { jak } from './AllJackets';
import { boots } from './AllBoots';
import { ba } from './AllBalls';

// Fonction pour normaliser les données de produit
const addMockDetailsIfNeeded = (item, defaultPrice, defaultSizes) => ({
    ...item,
    price: item.price || defaultPrice || `${Math.floor(Math.random() * 500 + 500)} DH`,
    availableSizes: item.availableSizes || defaultSizes || ['Taille unique'],
});

// Préparez les données de produits
const mockLogos = (logos.lg ?? []).map(item => addMockDetailsIfNeeded(item, '750 DH', ['S', 'M', 'L', 'XL']));
const mockJackets = (jak.jacket ?? []).map(item => addMockDetailsIfNeeded(item, '900 DH', ['M', 'L', 'XL', 'XXL']));
const mockBoots = (boots.BOOTS ?? []).map(item => addMockDetailsIfNeeded(item, '1200 DH', [39, 40, 41, 42, 43, 44, 45]));
const mockBalls = (ba.balls ?? []).map(item => addMockDetailsIfNeeded(item, '250 DH', ['5']));

// Rassemblez toutes les données de produits
const allProducts = [
    ...mockLogos.map(item => ({ ...item, productType: 'kit' })),
    ...mockJackets.map(item => ({ ...item, productType: 'jacket' })),
    ...mockBoots.map(item => ({ ...item, productType: 'boot' })),
    ...mockBalls.map(item => ({ ...item, productType: 'ball' }))
];

// --- Reusable UI Sub-components (Defined within Produit.jsx as requested) ---

// Size Selector
const SizeSelector = ({ sizes = [], selectedSize, onSizeChange, disabled = false }) => {
    if (!sizes || sizes.length === 0) return <p className="text-sm text-gray-500 mb-6">Taille non applicable.</p>;

    return (
        <div className="mb-6">
            <label className="block text-sm font-medium text-gray-800 mb-2">
                Taille : {selectedSize && selectedSize !== "Sélectionner" ? `EU ${selectedSize}` : ''}
            </label>
            <div className="flex flex-wrap gap-2">
                {sizes.map((size) => (
                    <label key={size} className="relative cursor-pointer">
                        <input
                            type="radio" name="size-option" value={size}
                            checked={selectedSize === size}
                            onChange={(e) => onSizeChange(e.target.value)}
                            className="sr-only peer" disabled={disabled}
                        />
                        <div className={`flex items-center justify-center w-12 h-10 rounded border text-sm font-medium transition-colors duration-150 ${selectedSize === size ? 'bg-black text-white border-black' : 'bg-white text-black border-gray-300 peer-hover:border-black peer-focus:ring-2 peer-focus:ring-offset-1 peer-focus:ring-black'} ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-100' : ''}`}>
                            {size}
                        </div>
                    </label>
                ))}
                {selectedSize === "Sélectionner" && (
                    <p className="text-xs text-red-600 mt-1 w-full">Veuillez sélectionner une taille.</p>
                )}
            </div>
        </div>
    );
};

// Customization Options
const CustomizationOptions = ({ customizationOption, onCustomizationChange }) => {
    const options = [
        { value: 'without', label: 'Non, Merci !' },
        { value: 'nomNumero', label: 'Nom + Numéro (+50,00 DH)' },
        { value: 'nomNumeroDrapeau', label: 'Nom + Numéro + Drapeau (+100,00 DH)' },
    ];

    return (
        <div className="mb-6">
            <p className="text-sm font-medium text-gray-800 mb-3">
                Personnalisation <span className="text-gray-500 font-normal">(Optionnel)</span>
            </p>
            <div className="space-y-3">
                {options.map((opt) => (
                    <label key={opt.value} className="flex items-center space-x-3 p-3 border rounded cursor-pointer hover:border-black transition-colors has-[:checked]:border-black has-[:checked]:ring-1 has-[:checked]:ring-black">
                        <input
                            type="radio" name="customization-option" value={opt.value}
                            checked={customizationOption === opt.value}
                            onChange={(e) => onCustomizationChange(e.target.value)}
                            className="h-4 w-4 border-gray-400 text-black focus:ring-black transition" // Simple radio look
                        />
                        <span className="text-sm text-gray-700">{opt.label}</span>
                    </label>
                ))}
            </div>
        </div>
    );
};

// File Upload Input
const FileUpload = ({ onFileChange }) => (
    <div className="mb-4">
        <label className="block text-xs font-medium text-gray-600 mb-1" htmlFor="logo-upload">
            Insérer logo/emoji (si option sélectionnée)
        </label>
        <input
            id="logo-upload" type="file" onChange={onFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gray-100 file:text-gray-700 hover:file:bg-gray-200 cursor-pointer"
        />
    </div>
);

// Quantity Input
const QuantityInput = ({ quantity, onQuantityChange }) => {
    const handleDecrement = () => onQuantityChange(Math.max(1, quantity - 1));
    const handleIncrement = () => onQuantityChange(quantity + 1);
    const handleChange = (e) => {
        const value = e.target.value === '' ? '' : parseInt(e.target.value, 10);
        if (value === '' || (!isNaN(value) && value >= 1)) {
            onQuantityChange(value);
        }
    };
    const handleBlur = (e) => {
        if (e.target.value === '') {
            onQuantityChange(1); // Reset to 1 if left empty
        }
    };

    return (
        <div className="mb-6">
            <label htmlFor="quantity-input" className="block text-sm font-medium text-gray-800 mb-2">
                Quantité
            </label>
            <div className="flex items-center border border-gray-300 rounded w-fit">
                <button type="button" onClick={handleDecrement} disabled={quantity <= 1} className="px-3 py-2 text-lg text-gray-500 hover:bg-gray-100 rounded-l disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Decrease quantity">–</button>
                <input
                    type="number" id="quantity-input" value={quantity}
                    onChange={handleChange} onBlur={handleBlur} min="1"
                    className="w-12 h-10 text-center border-y-0 border-x text-sm font-medium text-gray-700 focus:outline-none focus:ring-0 appearance-none [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    aria-label="Product quantity"
                />
                <button type="button" onClick={handleIncrement} className="px-3 py-2 text-lg text-gray-500 hover:bg-gray-100 rounded-r" aria-label="Increase quantity">+</button>
            </div>
        </div>
    );
};

// --- Main Product Component ---
function Produit() {
    useEffect(() => {
        window.scrollTo(0, 0); // Scroll to top when component mounts
    }, []);

    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams(); // NOUVEAU: Récupère l'ID depuis l'URL

    // --- Get Product Data from Navigation State or by ID ---
    const [productData, setProductData] = useState(null);

    useEffect(() => {
        // Essayez d'utiliser les données de navigation d'abord
        if (location.state) {
            setProductData(location.state);
            setIsLoading(false);
            return;
        }
        
        // Sinon, recherchez par ID
        if (id) {
            const foundProduct = allProducts.find(item => item.id.toString() === id.toString());
            if (foundProduct) {
                setProductData(foundProduct);
                setIsLoading(false);
                return;
            }
        }
        
        // Si aucune donnée n'est trouvée
        setError("Impossible de charger les détails du produit. Veuillez réessayer depuis la navigation.");
        setIsLoading(false);
    }, [id, location.state]);

    // --- Component State ---
    const [selectedSize, setSelectedSize] = useState("Sélectionner");
    const [customizationOption, setCustomizationOption] = useState("without");
    const [customNameNumber, setCustomNameNumber] = useState("");
    const [customFile, setCustomFile] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [error, setError] = useState(""); // For user feedback (e.g., size selection)
    const [isLoading, setIsLoading] = useState(true); // Manage loading/error state

    // --- Handlers ---
    const handleFileChange = useCallback((e) => {
        setCustomFile(e.target.files[0] || null);
    }, []);

    const handleQuantityChange = useCallback((value) => {
        setQuantity(value === '' ? '' : Number(value)); // Store empty string temporarily or number
    }, []);

    const handleAddToCart = () => {
        if (!productData) {
            setError("Erreur: Données produit manquantes.");
            return;
        }

        // Validate size selection if sizes are available/required
        const requiresSize = productData.availableSizes && productData.availableSizes.length > 0;
        if (requiresSize && selectedSize === "Sélectionner") {
            setError("Veuillez sélectionner une taille avant d'ajouter au panier.");
            document.getElementById('size-selector-component')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            return;
        }
        setError(""); // Clear error

        // --- Prepare item for cart ---
        let calculatedPrice = parseInt(String(productData.price).replace(/[^0-9]/g, ''), 10) || 0;
        let customizationCost = 0;
        let customizationDetails = null;

        if (customizationOption === "nomNumero") {
            customizationCost = 50;
            customizationDetails = `Nom/Num: ${customNameNumber || 'Non spécifié'}`;
        } else if (customizationOption === "nomNumeroDrapeau") {
            customizationCost = 100;
            customizationDetails = `Nom/Num: ${customNameNumber || 'Non spécifié'}, Fichier: ${customFile ? customFile.name : 'Non fourni'}`;
        }

        const finalPricePerItem = calculatedPrice + customizationCost;
        const currentQuantity = quantity === '' ? 1 : quantity; // Ensure quantity is a number
        const totalPrice = finalPricePerItem * currentQuantity;

        const cartItem = {
            id: productData.id,
            uniqueId: `${productData.id}-${selectedSize}-${customizationOption}-${customNameNumber}-${customFile?.name || 'noFile'}`,
            img: productData.img,
            text: productData.text,
            price: productData.price, // Base price string
            size: requiresSize ? selectedSize : 'N/A', // Store selected size or N/A
            quantity: currentQuantity,
            customization: customizationDetails,
            customizationType: customizationOption,
            customNameNumber: customNameNumber,
            customFile: customFile?.name,
            calculatedPrice: finalPricePerItem, // Price per item with options
        };

        console.log("Adding to Cart:", cartItem);
        // **TODO:** Implement actual cart logic (e.g., using Context API or Redux)
        // E.g., addToCart(cartItem);
        alert(`${currentQuantity} x ${productData.text} (Taille: ${cartItem.size}) ajouté au panier! Total: ${totalPrice} DH`);

        // Optional: Reset form fields after adding to cart
        // setSelectedSize("Sélectionner");
        // setQuantity(1);
        // setCustomizationOption('without');
        // setCustomNameNumber('');
        // setCustomFile(null);
    };

    // --- Render loading state ---
    if (isLoading) {
        return <div className="max-w-6xl mx-auto px-4 py-20 text-center">Chargement...</div>;
    }

    // --- Render error state if productData is missing ---
    if (!productData) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-12 text-center">
                <h1 className="text-xl text-red-600 font-semibold mb-4">{error}</h1>
                <Link to="/" className="text-blue-600 hover:underline mt-4 inline-block">
                    ← Retour à l'accueil
                </Link>
            </div>
        );
    }

    // --- Render Product Details ---
     const showCustomization = ['kit', 'jacket'].includes(productData.productType); // Example condition
     const requiresSizeSelection = productData.availableSizes && productData.availableSizes.length > 0;

    return (
        <div className="product-page-container max-w-6xl mx-auto px-4 py-12 md:py-16 lg:py-20">
            <div className="md:flex md:gap-8 lg:gap-12">
                {/* Left Column: Image */}
                <div className="product-image-column w-full md:w-1/2 lg:w-[55%] mb-8 md:mb-0">
                    <img
                        className="w-full h-auto object-cover rounded-lg shadow-sm"
                        src={productData.img}
                        alt={productData.text}
                    />
                    {/* Add more images or carousel here if needed */}
                </div>

                {/* Right Column: Details & Options */}
                <div className="product-details-column w-full md:w-1/2 lg:w-[45%]">
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{productData.text}</h1>
                    {productData.productType && (
                       <p className="text-sm text-gray-500 mb-4 capitalize">{productData.productType}</p>
                    )}
                    <p className="text-xl lg:text-2xl font-semibold text-gray-800 mb-6 pb-6 border-b border-gray-200">{productData.price}</p>

                    {/* Size Selector */}
                    <div id="size-selector-component">
                        <SizeSelector
                            sizes={productData.availableSizes}
                            selectedSize={selectedSize}
                            onSizeChange={setSelectedSize}
                        />
                    </div>
                    {/* Display size selection error */}
                    {error && error.includes("taille") && <p className="text-xs text-red-600 -mt-4 mb-4">{error}</p>}

                    {/* Customization Section (conditionally rendered) */}
                    {showCustomization && (
                        <div className="pt-6 border-t border-gray-200">
                            <p className="text-base font-semibold text-gray-900 mb-2">Rendez-le Unique !</p>
                            <p className="text-xs text-gray-600 mb-4">Personnalisation disponible (Préparation 24-48h).</p>
                            <CustomizationOptions
                                customizationOption={customizationOption}
                                onCustomizationChange={setCustomizationOption}
                            />
                            {/* Conditional Inputs for Customization */}
                            {customizationOption !== "without" && (
                                <div className="bg-gray-50 p-4 rounded-md mb-6 border border-gray-200 space-y-3">
                                    <div><label htmlFor="custom-name-number" className="block text-xs font-medium text-gray-600 mb-1">Nom + Numéro (Ex: RONALDO 7)</label>
                                        <input
                                            type="text" id="custom-name-number"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-black focus:border-black text-sm"
                                            placeholder="Entrez nom et numéro"
                                            value={customNameNumber}
                                            onChange={(e) => setCustomNameNumber(e.target.value)}
                                        />
                                    </div>
                                    {customizationOption === "nomNumeroDrapeau" && (
                                        <FileUpload onFileChange={handleFileChange} />
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Quantity Input */}
                    <QuantityInput quantity={quantity} onQuantityChange={handleQuantityChange} />

                    {/* Add to Cart Button */}
                    <button
                        onClick={handleAddToCart}
                        className="add-to-cart-button w-full bg-black text-white py-3 px-6 rounded-full text-sm font-semibold uppercase tracking-wider hover:bg-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 flex justify-center items-center"
                        disabled={isLoading || (requiresSizeSelection && selectedSize === "Sélectionner")}
                    >
                        Ajouter au panier
                    </button>

                    {/* Optional: Add to Wishlist, Product Description etc. */}
                    {/* <div className="mt-8 pt-6 border-t border-gray-200"> ... Description ... </div> */}
                </div>
            </div>
            {/* Optional: Related Products Section */}
            {/* <div className="mt-16 lg:mt-24"> ... Related products ... </div> */}
        </div>
    );
}

export default Produit;