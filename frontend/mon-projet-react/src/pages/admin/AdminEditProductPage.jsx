// src/files/AdminEditProductPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { Save, ChevronDown, RefreshCw, Image as ImageIcon, ChevronLeft, UploadCloud, XCircle } from 'lucide-react';

const AVAILABLE_CATEGORIES = [
  { value: "Kits", label: "Kits (Maillots)" },
  { value: "Boots", label: "Boots (Chaussures)" },
  { value: "Balls", label: "Balls (Ballons)" },
  { value: "Jackets", label: "Jackets (Vestes)" },
  { value: "Accessories", label: "Accessories (Accessoires)" },
  { value: "Other", label: "Other (Autre)" },
];

const AdminEditProductPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const initialFormState = {
    name: '',
    price: '',
    category: AVAILABLE_CATEGORIES[0]?.value || '',
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [currentImagePath, setCurrentImagePath] = useState('');
  const [newImageFile, setNewImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isLoadingProduct, setIsLoadingProduct] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [fetchError, setFetchError] = useState('');

  const fetchProductData = useCallback(async () => {
    console.log(`Fetching product data for ID: ${productId}`);
    setIsLoadingProduct(true);
    setFetchError('');
    setMessage('');
    try {
      const response = await fetch(`http://localhost:3000/api/products/${productId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Produit non trouvé ou erreur serveur (status ${response.status}).`);
      }
      const data = await response.json();

      setFormData({
        name: data.text || '',
        price: data.price ? `${parseFloat(data.price).toFixed(2)} DH` : '',
        category: data.category || AVAILABLE_CATEGORIES[0]?.value || '',
      });
      setCurrentImagePath(data.path || '');
      setImagePreview(data.path ? `http://localhost:3000${data.path}` : '/assets/default-product.jpg');
      
    } catch (err) {
      console.error("Error loading product data:", err);
      setFetchError(err.message);
    } finally {
      setIsLoadingProduct(false);
    }
  }, [productId]);

  useEffect(() => {
    if (productId) {
      fetchProductData();
    } else {
      setFetchError("Aucun ID de produit fourni pour l'édition.");
      setIsLoadingProduct(false);
    }
  }, [productId, fetchProductData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setMessage('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
      if (!allowedTypes.includes(file.type)) {
        setMessage("Type de fichier non supporté. Veuillez choisir JPEG, PNG, WEBP, ou GIF.");
        setMessageType('error'); e.target.value = null; return;
      }
      if (file.size > 5 * 1024 * 1024) {
         setMessage("L'image est trop volumineuse (max 5MB).");
         setMessageType('error'); e.target.value = null; return;
      }
      setNewImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setNewImageFile(null);
      setImagePreview(currentImagePath ? `http://localhost:3000${currentImagePath}` : '/assets/default-product.jpg');
    }
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('');
    setMessageType('');

    if (!formData.name || !formData.price || !formData.category) {
      setMessage("Les champs Nom du produit, Prix, et Catégorie sont obligatoires.");
      setMessageType('error');
      setIsSubmitting(false);
      return;
    }

    const dataToSubmit = new FormData();
    dataToSubmit.append('name', formData.name);
    dataToSubmit.append('price', formData.price);
    dataToSubmit.append('category', formData.category);
    dataToSubmit.append('currentImagePath', currentImagePath || '');

    if (newImageFile) {
      dataToSubmit.append('productImage', newImageFile);
    }

    try {
      const headers = {};
      if (user && user.id) {
        headers['x-user-id'] = user.id.toString();
      }

      const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
        method: 'PUT',
        headers: headers,
        body: dataToSubmit,
      });

      const responseData = await response.json(); 

      if (response.ok) {
        setMessage(responseData.message || `Produit "${responseData.text || formData.name}" mis à jour avec succès !`);
        setMessageType('success');
        if (responseData.imagePath) {
            setCurrentImagePath(responseData.imagePath);
            setImagePreview(`http://localhost:3000${responseData.imagePath}`);
        }
        setNewImageFile(null);
      } else {
        setMessage(responseData.error || 'Erreur lors de la mise à jour du produit.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Erreur de connexion ou problème inattendu lors de la mise à jour.');
      setMessageType('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoadingProduct) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="max-w-xl mx-auto py-12 px-4 text-center">
        <XCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-3">Erreur de Chargement</h2>
        <p className="text-gray-600 mb-6">{fetchError}</p>
        <Link 
            to="/admin/products/list" 
            className="px-5 py-3 bg-black text-white text-sm font-bold rounded-md hover:bg-gray-800 transition-colors"
        >
          Retour à la liste
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link to="/admin/products/list" className="flex items-center text-sm text-black font-medium hover:underline mb-1">
            <ChevronLeft size={20} className="mr-1" /> Retour à la liste
          </Link>
          <h1 className="mt-2 text-3xl font-extrabold text-gray-900">
            ÉDITION : <span className="text-black">{formData.name || `Produit ID ${productId}`}</span>
          </h1>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-6">
            {message && (
              <div className={`p-4 rounded-md ${messageType === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {message}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Nom du Produit <span className="text-red-500">*</span>
                </label>
                <input 
                  id="name" 
                  name="name" 
                  type="text" 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder-gray-400"
                  value={formData.name} 
                  onChange={handleChange} 
                  placeholder="Nom du produit"
                />
              </div>
              
              <div>
                <label htmlFor="price" className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Prix <span className="text-red-500">*</span>
                </label>
                <input 
                  id="price" 
                  name="price" 
                  type="text" 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent placeholder-gray-400"
                  placeholder="ex: 750 DH" 
                  value={formData.price} 
                  onChange={handleChange} 
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Catégorie <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <select 
                  id="category" 
                  name="category" 
                  required 
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent bg-white"
                  value={formData.category} 
                  onChange={handleChange}
                >
                  {AVAILABLE_CATEGORIES.map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Image du Produit
              </label>
              <div className="flex flex-col sm:flex-row items-start gap-6">
                <div className="w-48 h-48 bg-gray-100 rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Aperçu" className="w-full h-full object-cover"/>
                  ) : (
                    <div className="text-gray-400">
                      <ImageIcon size={32} />
                    </div>
                  )}
                </div>
                
                <div className="flex-1">
                  <label 
                    htmlFor="productImageFile" 
                    className="inline-flex items-center px-6 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 cursor-pointer"
                  >
                    <UploadCloud size={18} className="mr-2" />
                    {newImageFile ? newImageFile.name : "Changer l'image"}
                  </label>
                  <input 
                    id="productImageFile" 
                    name="productImage" 
                    type="file" 
                    className="sr-only" 
                    onChange={handleImageChange} 
                    accept="image/*"
                  />
                  {currentImagePath && !newImageFile && (
                    <p className="text-xs text-gray-500 mt-2">
                      Image actuelle: <span className="font-mono">{currentImagePath.split('/').pop()}</span>
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 flex justify-end gap-4">
              <button 
                type="button" 
                onClick={() => navigate('/admin/products/list')}
                className="px-6 py-3 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-colors"
              >
                Annuler
              </button>
              <button 
                type="submit" 
                disabled={isSubmitting || isLoadingProduct}
                className="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:opacity-70 flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw size={18} className="animate-spin mr-2"/>
                    Enregistrement...
                  </>
                ) : (
                  <>
                    <Save size={18} className="mr-2"/>
                    Enregistrer
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminEditProductPage;