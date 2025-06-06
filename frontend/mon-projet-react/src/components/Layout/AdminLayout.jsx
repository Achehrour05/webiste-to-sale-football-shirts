
import React, { useState } from 'react';
import { Link, NavLink, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { 
    Package, LayoutDashboard, Users, Settings, LogOut, 
    ChevronLeft, ChevronRight, Menu, X, ShoppingBag, Palette, Activity, MessageSquare, HelpCircle,
    Zap, TrendingUp
} from 'lucide-react';
import { useAuth } from '../../context/AuthProvider';

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState(null);


  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSubmenu = (itemName) => {
    setOpenSubmenu(openSubmenu === itemName ? null : itemName);
  };

  const adminNavItems = [
    { 
      name: 'Dashboard', 
      path: '/admin/dashboard', 
      icon: LayoutDashboard,

    },
    { 
      name: 'Products', 
      icon: Package,
      subItems: [
        { name: 'All Products', path: '/admin/products/list'},
        { name: 'Parcourir par Catégorie', path: '/admin/products/category-view'},
        { name: 'Add Product', path: '/admin/add-product'},
      ]
    },
    
  ];

  const NavItem = ({ item, isSidebarOpen, isMobile = false }) => {
    const location = useLocation();
    const isActive = item.path && location.pathname === item.path;
    const isSubmenuParentActive = item.subItems && item.subItems.some(sub => location.pathname.startsWith(sub.path));
    
    const closeMobileIfNeeded = () => {
        if (isMobile && isMobileMenuOpen) {
            setIsMobileMenuOpen(false);
        }
    };

    if (item.subItems) {
      const isSubmenuCurrentlyOpen = openSubmenu === item.name;
      return (
        <div className="group">
          <button
            onClick={() => toggleSubmenu(item.name)}
            className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-out group-hover:scale-[1.02] relative overflow-hidden
                        ${isSidebarOpen ? 'justify-between' : 'justify-center'}
                        ${isSubmenuParentActive 
                          ? ' text-white shadow-lg  bg-black' 
                          : 'text-gray-300 hover:bg-gray-800/50 hover:text-white backdrop-blur-sm'}`}
          >
            <div className="flex items-center relative z-10">
              <item.icon className={`w-5 h-5 flex-shrink-0 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
              {isSidebarOpen && (
                <span className="truncate font-medium tracking-wide">{item.name}</span>
              )}
            </div>
            {isSidebarOpen && (
              <div className="flex items-center space-x-2">
                {item.badge && (
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    item.badge === 'NEW' ? 'bg-green-500 text-white' :
                    item.badge === 'HOT' ? 'bg-red-500 text-white' :
                    ' text-white'
                  }`}>
                    {item.badge}
                  </span>
                )}
                <ChevronRight className={`w-4 h-4 transform transition-transform duration-200 ${isSubmenuCurrentlyOpen ? 'rotate-90' : ''}`} />
              </div>
            )}
            <div className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
          </button>
          {isSidebarOpen && isSubmenuCurrentlyOpen && (
            <div className="mt-2 ml-4 space-y-1 animate-in slide-in-from-top-2 duration-200">
              {item.subItems.map((subItem, index) => (
                <NavLink
                  key={subItem.name}
                  to={subItem.path}
                  onClick={closeMobileIfNeeded}
                  className={({ isActive: isSubActive }) =>
                    `flex items-center px-4 py-2.5 text-sm rounded-lg transition-all duration-200 no-underline ease-out hover:scale-[1.02] relative overflow-hidden group ${
                      isSubActive 
                        ? ' text-white ' 
                        : 'text-gray-400 hover:bg-gray-800/30 hover:text-white'
                    }`
                  }
                  style={{ 
                    animationDelay: `${index * 50}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  <div className="w-2 h-2 rounded-full bg-current opacity-50 mr-3 flex-shrink-0"></div>
                  <span className="font-medium tracking-wide">{subItem.name}</span>
                  <div className="absolute inset-0  opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-lg"></div>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="group">
        <NavLink
          to={item.path}
          onClick={closeMobileIfNeeded}
          className={({ isActive: isLinkActive }) =>
            `flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-out group-hover:scale-[1.02] relative overflow-hidden
             ${isSidebarOpen ? 'justify-between' : 'justify-center'}
             ${isLinkActive 
               ? ' text-white shadow-lg ' 
               : 'text-gray-300 hover:bg-gray-800/50 hover:text-white backdrop-blur-sm'}`
          }
          title={isSidebarOpen ? '' : item.name}
        >
          <div className="flex items-center relative z-10">
            <item.icon className={`w-5 h-5 flex-shrink-0 ${isSidebarOpen ? 'mr-3' : 'mx-auto'}`} />
            {isSidebarOpen && <span className="font-medium tracking-wide">{item.name}</span>}
          </div>
          {isSidebarOpen && item.badge && (
            <span className={`px-2 py-1 text-xs font-bold rounded-full ${
              item.badge === 'NEW' ? 'bg-green-500 text-white' :
              item.badge === 'HOT' ? 'bg-red-500 text-white' :
              ' text-white'
            }`}>
              {item.badge}
            </span>
          )}
          <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
        </NavLink>
      </div>
    );
  };
  
  const SidebarContent = ({ isMobile = false }) => (
    <div className="flex flex-col h-full bg-black">
        <div className={`p-6  flex ${isSidebarOpen || isMobile ? 'justify-between' : 'justify-center'} items-center h-20`}>
            { (isSidebarOpen || isMobile) && (
                <Link 
                  to="/admin/dashboard" 
                  onClick={() => isMobile && setIsMobileMenuOpen(false)} 
                  className="flex items-center space-x-3 group"
                >
                    <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg  group-hover:shadow-blue-500/40 transition-all duration-200">
                        <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex flex-col">
                        <span className="text-[20px] text-white font-medium no-underline">ADMIN</span>
                        <span className="text-xs text-gray-400 font-medium no-underline">DASHBOARD</span>
                    </div>
                </Link>
            )}
            
            { !isSidebarOpen && !isMobile && (
                <div className="w-10 h-10  rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                    <Zap className="w-6 h-6 text-white" />
                </div>
            )}

            {isMobile && (
                 <button 
                   onClick={() => setIsMobileMenuOpen(false)} 
                   className="text-gray-300 hover:text-white p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200"
                 >
                    <X size={24} />
                 </button>
            )}
        </div>
        
        <nav className="mt-6 flex-grow space-y-2 px-4 overflow-y-auto scrollbar-thin  bg-black">
            {adminNavItems.map((item) => (
                <NavItem key={item.name} item={item} isSidebarOpen={isSidebarOpen || isMobile} isMobile={isMobile} />
            ))}
        </nav>
        
        <div className={`p-4 border-t border-gray-700/50 mt-auto ${isSidebarOpen || isMobile ? '' : 'flex justify-center'}`}>
            <button
                onClick={handleLogout}
                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ease-out hover:scale-[1.02] relative overflow-hidden group
                            ${isSidebarOpen || isMobile ? 'justify-between' : 'justify-center'}
                            text-black backdrop-blur-sm bg-white`}
                title={isSidebarOpen || isMobile ? '' : "Logout"}
            >
                <div className="flex items-center relative z-10  ">
                    <LogOut className={`w-5 h-5 flex-shrink-0 ${isSidebarOpen || isMobile ? 'mr-3' : 'mx-auto'}`} />
                    {(isSidebarOpen || isMobile) && <span className="font-medium tracking-wide">Logout</span>}
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-red-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-xl"></div>
            </button>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen flex  dark:bg-gray-900  duration-300">
      <aside 
        className={` text-white fixed inset-y-0 left-0 z-30 transform md:flex flex-col hidden  transition-all duration-300 ease-out
                   ${isSidebarOpen ? 'w-72' : 'w-20'}`}

      >
        <SidebarContent />
      </aside>

      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50" role="dialog" aria-modal="true">
            <div 
                className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300" 
                aria-hidden="true"
                onClick={() => setIsMobileMenuOpen(false)}
            ></div>
            <div 
              className="fixed inset-y-0 left-0 flex flex-col w-72 max-w-[85%] text-white shadow-2xl transform transition-transform ease-out duration-300 backdrop-blur-xl border-r border-gray-700/50"
            >
                <SidebarContent isMobile={true} />
            </div>
        </div>
      )}

      <div 
        className={`flex-1 flex flex-col transition-all duration-300 ease-out ${
          isSidebarOpen ? 'md:pl-72' : 'md:pl-20'
        }`}
      >
        <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl sticky top-0 z-20 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-4">
                <button 
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="md:hidden text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200"
                    aria-label="Open menu"
                >
                    <Menu size={24}/>
                </button>
                 <button 
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="hidden md:flex items-center justify-center w-10 h-10 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 focus:outline-none rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-all duration-200"
                    title={isSidebarOpen ? "Collapse" : "Expand"}
                >
                    {isSidebarOpen ? <ChevronLeft size={20} /> : <Menu size={20} />}
                </button>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="hidden sm:flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {(user?.name || 'Admin').charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    <span className="font-semibold">{user?.name || 'Admin'}</span>
                  </span>
                </div>
                <button
                    onClick={() => navigate('/')}
                    className="text-gray-500  p-2 rounded-xl  transition-all duration-200 bg-white"
                    title="Logout"
                >
                    <LogOut size={20}/>
                </button>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-grow p-4 sm:p-6 lg:p-8 overflow-y-auto">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;