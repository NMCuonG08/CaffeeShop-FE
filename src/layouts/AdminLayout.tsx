import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { Package, BarChart3, LogOut, Menu, Coffee, X } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  const menuItems = [
    {
      path: '/admin/products',
      icon: Package,
      label: 'Products'
    },
    {
      path: '/admin/analytics',
      icon: BarChart3,
      label: 'Analytics'
    }
  ];

  return (
    <div className="min-h-screen bg-amber-50 flex">
      {/* Sidebar */}
      <div className={`bg-gradient-to-b from-amber-900 to-amber-800 shadow-2xl transition-all duration-300 relative ${sidebarOpen ? 'w-64' : 'w-16'}`}>
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-amber-700/30">
          {/* Logo - only show when expanded */}
          {sidebarOpen && (
            <div className="flex items-center transition-opacity duration-300">
              <Coffee className="text-amber-200 mr-2" size={24} />
              <h1 className="font-bold text-xl text-amber-100">
                CafeShop Admin
              </h1>
            </div>
          )}
          
          {/* Toggle Button - always visible */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className={`p-2 rounded-lg hover:bg-amber-700/50 transition-colors text-amber-200 hover:text-amber-100 ${
              sidebarOpen ? '' : 'mx-auto'
            }`}
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-8 px-3 flex-1">
          <ul className="space-y-3">
            {menuItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <li key={item.path}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) =>
                      `flex items-center px-4 py-3 rounded-xl transition-all duration-200 group relative ${
                        isActive
                          ? 'bg-amber-600 text-white shadow-lg transform scale-105'
                          : 'text-amber-200 hover:bg-amber-700/50 hover:text-amber-100'
                      } ${!sidebarOpen ? 'justify-center' : ''}`
                    }
                    title={!sidebarOpen ? item.label : ''}
                  >
                    {({ isActive }) => (
                      <>
                        {isActive && sidebarOpen && (
                          <div className="absolute -left-3 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-amber-300 rounded-r-full"></div>
                        )}
                        
                        {/* Icon - always visible */}
                        <IconComponent 
                          size={20} 
                          className={`transition-all duration-200 ${
                            sidebarOpen ? 'mr-3' : 'mr-0'
                          } ${isActive ? 'text-white' : ''}`}
                        />
                        
                        {/* Label - only show when expanded */}
                        {sidebarOpen && (
                          <span className="font-medium transition-all duration-300">
                            {item.label}
                          </span>
                        )}
                      </>
                    )}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User Info & Logout */}
        <div className="p-3 border-t border-amber-700/30">
          {/* User Profile - only show when expanded */}
          {sidebarOpen && (
            <div className="flex items-center mb-3 p-3 rounded-xl bg-amber-700/30 transition-all duration-300">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-md">
                AD
              </div>
              <div className="ml-3">
                <p className="text-amber-100 font-medium text-sm">Admin User</p>
                <p className="text-amber-300 text-xs">Administrator</p>
              </div>
            </div>
          )}

          {/* Logout Button */}
          <button 
            className={`w-full flex items-center px-4 py-3 text-amber-200 hover:bg-red-600/20 hover:text-red-300 rounded-xl transition-all duration-200 group ${
              !sidebarOpen ? 'justify-center' : ''
            }`}
            title={!sidebarOpen ? 'Logout' : ''}
          >
            <LogOut size={20} className={`transition-all duration-200 ${sidebarOpen ? 'mr-3' : 'mr-0'}`} />
            {sidebarOpen && (
              <span className="font-medium">
                Logout
              </span>
            )}
          </button>
        </div>

        {/* Collapsed state indicator - show when collapsed */}
        {!sidebarOpen && (
          <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
            <div className="w-8 h-0.5 bg-amber-600 rounded-full mb-1"></div>
            <div className="w-6 h-0.5 bg-amber-600 rounded-full mx-auto mb-1"></div>
            <div className="w-4 h-0.5 bg-amber-600 rounded-full mx-auto"></div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Header */}
        <header className="bg-white/80 backdrop-blur-sm shadow-lg h-16 flex items-center justify-between px-6 border-b border-amber-200/50">
          <div>
            <h2 className="text-xl font-bold text-amber-900">Dashboard</h2>
            <p className="text-amber-700 text-sm">Welcome back to your coffee shop admin</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-700 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                A
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto bg-gradient-to-br from-amber-50 to-orange-50">
          <div className="max-w-7xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm lg:hidden z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;