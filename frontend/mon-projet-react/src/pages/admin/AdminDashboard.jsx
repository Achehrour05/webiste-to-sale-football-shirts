
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthProvider';
import { Link } from 'react-router-dom';
import { BiCategory } from "react-icons/bi";
import {
  Users,
  Package,
  DollarSign,
  ShoppingCart,
  BarChart3,
  Settings,
  PlusCircle,
  ListFilter, 
  ShieldCheck,
  Zap,
  Activity, 
} from 'lucide-react';

const initialStats = {
  totalRevenue: 0,
  totalOrders: 0,
  newCustomers: 0,
  totalProducts: 0,
};

const recentActivities = [
  { id: 1, type: 'Nouvelle commande', description: 'Commande #1024 par client@example.com', time: 'Il y a 2 min', icon: ShoppingCart, iconColor: 'text-green-500' },
  { id: 2, type: 'Nouveau produit ajouté', description: 'Maillot R.Madrid 24/25', time: 'Il y a 15 min', icon: PlusCircle, iconColor: 'text-blue-500' },
  { id: 3, type: 'Utilisateur inscrit', description: 'nouvel_utilisateur@example.com', time: 'Il y a 1h', icon: Users, iconColor: 'text-indigo-500' },
  { id: 4, type: 'Stock bas', description: 'Produit "Ballon Pro" - 3 restants', time: 'Il y a 3h', icon: Package, iconColor: 'text-red-500' },
];


const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(initialStats);
  const [isLoadingStats, setIsLoadingStats] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoadingStats(true);
      await new Promise(resolve => setTimeout(resolve, 1200)); 
      setStats({
        totalRevenue: 28540.50,
        totalOrders: 78,
        newCustomers: 12,
        totalProducts: 82,
      });
      setIsLoadingStats(false);
    };
    fetchDashboardData();
  }, []);

  const StatCard = ({ title, value, icon: Icon, trend, unit = '', iconBgColor = 'bg-gray-100', iconTextColor = 'text-gray-600' }) => (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 ease-in-out transform hover:-translate-y-1">
      <div className="flex items-start justify-between">
        <div className={`p-3 rounded-lg ${iconBgColor}`}>
          <Icon size={28} className={iconTextColor} />
        </div>
        {trend && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            trend.startsWith('+') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {trend}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 uppercase tracking-wider">{title}</p>
        {isLoadingStats ? (
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 animate-pulse mt-1"></div>
        ) : (
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
            {unit === 'DH' ? `${parseFloat(value).toFixed(2)} ${unit}` : value}
          </p>
        )}
      </div>
    </div>
  );

  const QuickAction = ({ title, to, icon: Icon, bgColor = "bg-indigo-500", hoverBgColor = "hover:bg-indigo-600" }) => (
    <Link
      to={to}
      className={`flex flex-col items-center justify-center p-6 ${bgColor} text-white rounded-xl shadow-lg hover:shadow-xl ${hoverBgColor} transition-all duration-300 ease-in-out transform hover:scale-105`}
    >
      <Icon size={32} className="mb-3" />
      <span className="text-sm font-semibold text-center">{title}</span>
    </Link>
  );

  return (
    <div className="min-h-full bg-gray-50 dark:bg-gray-900 p-4 sm:p-6 lg:p-8 transition-colors duration-300 overflow-x-hidden">

      <header className="mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
          Tableau de Bord
        </h1>
        <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
          Bienvenue, <span className="font-semibold text-indigo-600 dark:text-indigo-400">{user?.name || 'Admin'}</span>.
          Gérez votre boutique efficacement.
        </p>
      </header>

      <section className="mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <StatCard title="Revenu Total (Mois)" value={stats.totalRevenue} icon={DollarSign} trend="+5.2%" unit="DH" iconBgColor="bg-green-100 dark:bg-green-800/30" iconTextColor="text-green-600 dark:text-green-400" />
          <StatCard title="Commandes (Mois)" value={stats.totalOrders} icon={ShoppingCart} trend="+12" iconBgColor="bg-blue-100 dark:bg-blue-800/30" iconTextColor="text-blue-600 dark:text-blue-400"/>
          <StatCard title="Nouveaux Clients (Mois)" value={stats.newCustomers} icon={Users} trend="+8" iconBgColor="bg-yellow-100 dark:bg-yellow-800/30" iconTextColor="text-yellow-600 dark:text-yellow-400"/>
          <StatCard title="Total Produits Actifs" value={stats.totalProducts} icon={Package} iconBgColor="bg-purple-100 dark:bg-purple-800/30" iconTextColor="text-purple-600 dark:text-purple-400"/>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Actions Rapides</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          <QuickAction title="Ajouter Produit" to="/admin/add-product" icon={PlusCircle} bgColor="bg-green-500 dark:bg-green-600" hoverBgColor="hover:bg-green-600 dark:hover:bg-green-700" />
          <QuickAction title="Liste Produits" to="/admin/products/list" icon={ListFilter} bgColor="bg-blue-500 dark:bg-blue-600" hoverBgColor="hover:bg-blue-600 dark:hover:bg-blue-700"/>
          <QuickAction title="Liste Produits Par Category" to="/admin/products/category-view" icon={BiCategory} bgColor="bg-purple-500 dark:bg-purple-600" hoverBgColor="hover:bg-purple-600 dark:hover:bg-purple-700"/>
        </div>
      </section>
      
      <section>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6">Activité Récente</h2>
        <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl overflow-hidden">
          <ul className="divide-y divide-gray-200 dark:divide-gray-700">
            {recentActivities.map((activity) => (
              <li key={activity.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-2 rounded-full ${activity.iconColor.replace('text-', 'bg-').replace('500', '100')} dark:${activity.iconColor.replace('text-', 'bg-').replace('500','800/30')}`}>
                     <activity.icon size={20} className={activity.iconColor} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{activity.type}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{activity.description}</p>
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                    {activity.time}
                  </div>
                </div>
              </li>
            ))}
          </ul>
           <div className="p-4 text-center border-t border-gray-200 dark:border-gray-700">
                <Link to="/admin/activity-log" className="text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                    Voir tout l'historique
                </Link>
            </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;