
import React from 'react';
import { Category, User } from '../types';

interface HeaderProps {
  user: User | null;
  onCartToggle: () => void;
  cartCount: number;
  onCategoryChange: (cat: Category | 'All') => void;
  onSearch: (term: string) => void;
  currentCategory: Category | 'All';
  onAdminToggle: () => void;
  onLoginToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  user, onCartToggle, cartCount, onCategoryChange, 
  onSearch, currentCategory, onAdminToggle, onLoginToggle 
}) => {
  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={() => onCategoryChange('All')}>
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white mr-3">
              <i className="fas fa-shopping-bag text-xl"></i>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 hidden sm:block">
              NovaMart
            </span>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md mx-8 hidden md:block">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search products..." 
                className="w-full bg-gray-100 border-none rounded-full py-2 pl-10 pr-4 focus:ring-2 focus:ring-indigo-500 transition-all"
                onChange={(e) => onSearch(e.target.value)}
              />
              <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"></i>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {user?.isAdmin && (
              <button 
                onClick={onAdminToggle}
                className="text-gray-600 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-gray-100"
                title="Admin Dashboard"
              >
                <i className="fas fa-user-shield text-xl"></i>
              </button>
            )}
            
            <button 
              onClick={onLoginToggle}
              className="text-gray-600 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <i className="fas fa-user text-xl"></i>
            </button>

            <button 
              onClick={onCartToggle}
              className="relative text-gray-600 hover:text-indigo-600 transition-colors p-2 rounded-full hover:bg-gray-100"
            >
              <i className="fas fa-shopping-cart text-xl"></i>
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-indigo-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-white">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Category Nav */}
        <div className="flex space-x-6 overflow-x-auto py-2 no-scrollbar">
          <button 
            onClick={() => onCategoryChange('All')}
            className={`text-sm font-medium whitespace-nowrap transition-colors ${currentCategory === 'All' ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
          >
            All Products
          </button>
          {Object.values(Category).map((cat) => (
            <button 
              key={cat}
              onClick={() => onCategoryChange(cat)}
              className={`text-sm font-medium whitespace-nowrap transition-colors ${currentCategory === cat ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-600'}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
