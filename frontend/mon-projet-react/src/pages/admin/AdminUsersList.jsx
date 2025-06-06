
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users as UsersIcon, Search, Edit2, Trash, Shield, UserPlus,Eye } from 'lucide-react';

const AdminUsersList = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const fetchUsers = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await fetch('http://localhost:3000/api/admin/users/all');
      if (!response.ok) {
        let ed = `HTTP error ${response.status}`;
        try{ const d = await response.json(); ed = d.error || d.message || ed; } catch(e){}
        throw new Error(ed);
      }
      const data = await response.json();
      setUsers(data || []);
      console.log("AdminUsersList: Utilisateurs chargés", data);
    } catch (err) {
      console.error("Erreur chargement utilisateurs:", err);
      setError(err.message || "Impossible de charger les utilisateurs.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Supprimer l'utilisateur "${userName}" (ID: ${userId}) ? Cette action est irréversible et peut affecter les commandes associées.`)) {
      alert(`Logique de suppression pour l'utilisateur ${userId} à implémenter.`);
    }
  };
  
  const filteredUsers = users.filter(user => {
    const lowerSearchTerm = searchTerm.toLowerCase();
    const name = String(user.name || '').toLowerCase();
    const email = String(user.email || '').toLowerCase();
    const id = String(user.id || '');
    return name.includes(lowerSearchTerm) || email.includes(lowerSearchTerm) || id.includes(lowerSearchTerm);
  });


  return (
    <div className="space-y-6">
      <div className="mb-6 flex flex-col sm:flex-row justify-between items-center gap-4 p-1">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white">Gestion des Utilisateurs</h1>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
                 <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </span>
                <input 
                    type="text"
                    placeholder="Rechercher (nom, email, ID)..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg ..."
                />
            </div>
        </div>
      </div>

      {(!isLoading && !error && filteredUsers.length === 0) ? (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
            <UsersIcon size={56} className="mx-auto text-gray-300 dark:text-gray-600 mb-5" />
            <p className="text-xl text-gray-600 dark:text-gray-300 font-semibold">
                {searchTerm ? "Aucun utilisateur ne correspond à votre recherche." : "Aucun utilisateur enregistré."}
            </p>
        </div>
      ) : !isLoading && !error && (
        <div className="overflow-x-auto bg-white dark:bg-gray-800 rounded-xl shadow-xl">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Inscrit le</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Rôle</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map((usr) => (
                <tr key={usr.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{usr.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{usr.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{usr.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{usr.formatted_created_at || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {usr.email === process.env.REACT_APP_ADMIN_EMAIL ? 
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800 dark:bg-red-800/30 dark:text-red-400"><Shield size={12} className="inline mr-1"/>Admin</span> :
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-400">Utilisateur</span>
                    }
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-1">
                    <button onClick={() => navigate(`/admin/user-details/${usr.id}`)} title="Voir détails" className="text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 p-1.5 hover:bg-blue-100 dark:hover:bg-blue-800/30 rounded-full"><Eye size={18} /></button>
                    <button onClick={() => alert(`Modifier rôle pour user ${usr.id} - à implémenter`)} title="Modifier rôle" className="text-indigo-500 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 p-1.5 hover:bg-indigo-100 dark:hover:bg-indigo-800/30 rounded-full"><Edit2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminUsersList;