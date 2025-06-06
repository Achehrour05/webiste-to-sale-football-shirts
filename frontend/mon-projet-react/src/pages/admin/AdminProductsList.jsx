import React, { useState, useEffect } from 'react';
import { Edit3, Trash2, PlusCircle, Search, Eye, PackagePlus, Filter, Grid, List, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const AdminProductsList = () => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('grid'); 
 const navigate = useNavigate();
  const fetchProducts = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3000/api/products/all');
      if (!response.ok) {
        let errorDetails = `Erreur HTTP ${response.status} lors de la récupération des produits.`;
        try {
            const errData = await response.json();
            errorDetails = errData.error || errData.message || errorDetails;
        } catch (e) {  }
        throw new Error(errorDetails);
      }
      const data = await response.json();
      setProducts(data || []); 
    } catch (err) {
      console.error("Erreur lors de la récupération des produits:", err);
      setError(err.message || "Impossible de charger les produits. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (productId, productName) => {
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer le produit "${productName}" (ID: ${productId}) ? Cette action est irréversible.`)) {
      setIsLoading(true);
      try {
        const response = await fetch(`http://localhost:3000/api/products/${productId}`, {
          method: 'DELETE',
          
        });
        if (!response.ok) {
          const errData = await response.json().catch(() => ({error: "Erreur inconnue lors de la suppression"}));
          throw new Error(errData.error || `Erreur lors de la suppression du produit: ${response.status}`);
        }
        setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
        alert(`Produit "${productName}" supprimé avec succès.`);
      } catch (err) {
        console.error("Erreur lors de la suppression du produit:", err);
        alert(`Erreur: ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const filteredProducts = products.filter(product => {
    const productName = product && typeof product.name === 'string' ? product.name.toLowerCase() : '';
    const productCategory = product && typeof product.category === 'string' ? product.category.toLowerCase() : '';
    const productIdString = product && product.id !== undefined && product.id !== null ? String(product.id) : '';
    const lowerSearchTerm = searchTerm.toLowerCase();

    return ( 
      productName.includes(lowerSearchTerm) ||
      productCategory.includes(lowerSearchTerm) ||
      productIdString.includes(lowerSearchTerm)
    );
  });

  const getStockStatus = (stock) => {
    if (stock <= 10) return 'low';
    if (stock <= 30) return 'medium';
    return 'high';
  };

  const getStockColor = (stock) => {
    if (stock <= 10) return 'text-red-600 bg-red-50';
    if (stock <= 30) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  if (isLoading && products.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
        <div className="flex justify-center items-center h-96">
          <div className="text-center">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-gray-300 rounded-full animate-spin mx-auto" style={{animationDelay: '0.3s'}}></div>
            </div>
            <p className="text-xl font-semibold text-gray-800">Chargement des produits...</p>
            <p className="text-gray-500 mt-2">Veuillez patienter</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-4">
        <div className="max-w-md mx-auto mt-20 bg-white rounded-2xl shadow-xl border border-red-100 overflow-hidden">
          <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 text-white text-center">
            <h2 className="text-2xl font-bold">Erreur</h2>
          </div>
          <div className="p-6">
            <p className="text-gray-700 mb-4">{error}</p>
            <button 
              onClick={fetchProducts} 
              className="w-full bg-black text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-800 transition-all duration-200 transform hover:scale-105"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
              <div>
                <h1 className="text-4xl font-black text-gray-900 tracking-tight">
                  Gestion Produits
                </h1>
                <p className="text-gray-600 mt-2 text-lg">
                  Administrez votre catalogue de produits
                </p>
              </div>
              

            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <div className="flex bg- rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-sm text-black' 
                      : 'text-white-500 bg-black '
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('table')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'table' 
                      ? 'bg-white shadow-sm text-black' 
                      : 'text-white-500 bg-black '
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            <button
              onClick={() => window.open('/admin/add-product', '_blank')}
              className="bg-black text-white px-6 py-3 rounded-xl text-[10px] hover:bg-gray-800 transition-all duration-200 transform hover:scale-105 flex items-center gap-2 shadow-lg"
            >
              <PlusCircle className="w-5 h-5" />
              Nouveau Produit
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        {(!isLoading && filteredProducts.length === 0) ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <PackagePlus className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {searchTerm ? "Aucun résultat" : "Aucun produit"}
              </h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? "Aucun produit ne correspond à votre recherche." 
                  : "Commencez par ajouter votre premier produit !"}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => window.open('/admin/add-product', '_blank')}
                  className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all duration-200"
                >
                  <PlusCircle className="w-5 h-5" />
                  Ajouter un produit
                </button>
              )}
            </div>
          </div>
        ) : (
          <>
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                    <div className="aspect-square bg-gray-100 relative overflow-hidden">
                      <img 
                        src={`http://localhost:3000${product.path || '/assets/default-product.jpg'}`}
                        alt={product.name || 'Image produit'} 
                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" 
                        onError={(e) => {e.target.src = 'http://localhost:3000/assets/default-product.jpg'}}
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStockColor(product.stock)}`}>
                          {product.stock} en stock
                        </span>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <div className="mb-3">
                        <p className="text-sm font-medium text-gray-500 mb-1">{product.category}</p>
                        <h3 className="text-[15px] font-bold text-gray-900 line-clamp-2">{product.text}</h3>
                      </div>
                      
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-2xl font-black text-gray-900">
                          {typeof product.price === 'number' ? `${product.price.toFixed(2)} DH` : (product.price || 'N/A')}
                        </span>
                        <span className="text-sm text-gray-500">ID: {product.id}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <button
                          onClick={() => window.open(`/produit/${product.id}`, '_blank')}
                          className="flex-1 bg-black text-white py-2 px-3 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-1"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/admin/edit-product/${product.id}`)}
  title="Modifier le produit"
                          className="flex-1 bg-black text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-1"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id, product.text)}
                          className="bg-black text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors duration-200 flex items-center justify-center"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Produit</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Catégorie</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Prix</th>
                        <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredProducts.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-50 transition-colors duration-200 ">
                          <td className="px-6 py-4 ">
                            <div className="flex items-center gap-4 w-[100px]">
                              <img 
                                src={`http://localhost:3000${product.path || '/assets/default-product.jpg'}`}
                                alt={product.name || 'Image produit'} 
                                className="w-12 h-12 rounded-lg object-cover " 
                                onError={(e) => {e.target.src = 'http://localhost:3000/assets/default-product.jpg'}}
                              />
                              <div>
                                <p className="font-semibold text-gray-900">{product.name}</p>
                                <p className="text-sm text-gray-500">ID: {product.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-700 font-medium">{product.category}</td>
                          <td className="px-6 py-4 text-sm font-bold text-gray-900">
                            {typeof product.price === 'number' ? `${product.price.toFixed(2)} DH` : (product.price || 'N/A')}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2 w-[30px]">
                              <button
                                onClick={() => window.open(`/produit/${product.id}`, '_blank')}
                                className="p-2 text-blue-600 bg-black hover:bg-blue-50 rounded-lg transition-colors duration-200"
                                title="Voir le produit"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => window.open(`/admin/edit-product/${product.id}`, '_blank')}
                                className="p-2 text-gray-600 bg-black hover:bg-gray-50 rounded-lg transition-colors duration-200"
                                title="Modifier le produit"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteProduct(product.id, product.name)}
                                className="p-2 text-red-600 bg-black hover:bg-red-50 rounded-lg transition-colors duration-200"
                                title="Supprimer le produit"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default AdminProductsList;