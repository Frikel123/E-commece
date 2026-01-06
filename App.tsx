
import React, { useState, useEffect, useMemo } from 'react';
import Header from './components/Header';
import ProductCard from './components/ProductCard';
import CartDrawer from './components/CartDrawer';
import AdminDashboard from './components/AdminDashboard';
import ShoppingAssistant from './components/ShoppingAssistant';
import { Category, Product, CartItem, Order, User } from './types';
import { INITIAL_PRODUCTS } from './constants';

const App: React.FC = () => {
  // State
  const [user, setUser] = useState<User | null>({
    id: 'u1',
    name: 'Admin User',
    email: 'admin@novamart.com',
    isAdmin: true
  });
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAdminView, setIsAdminView] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewedProduct, setViewedProduct] = useState<Product | null>(null);

  // Derived state
  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Handlers
  const handleAddToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const handleUpdateCartQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const handleRemoveFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      userId: user?.id || 'guest',
      items: [...cart],
      total: cart.reduce((acc, i) => acc + (i.price * i.quantity), 0),
      status: 'Processing',
      date: new Date().toLocaleDateString(),
      trackingNumber: `TX${Math.random().toString(36).substring(7).toUpperCase()}`
    };
    setOrders(prev => [newOrder, ...prev]);
    setCart([]);
    setIsCartOpen(false);
    alert(`Order placed successfully! Tracking ID: ${newOrder.trackingNumber}`);
  };

  const handleAddProduct = (p: Product) => {
    setProducts(prev => [p, ...prev]);
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdateOrderStatus = (id: string, status: Order['status']) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header 
        user={user}
        onCartToggle={() => setIsCartOpen(!isCartOpen)}
        cartCount={cart.reduce((acc, i) => acc + i.quantity, 0)}
        onCategoryChange={setSelectedCategory}
        onSearch={setSearchQuery}
        currentCategory={selectedCategory}
        onAdminToggle={() => setIsAdminView(!isAdminView)}
        onLoginToggle={() => alert('Login system would go here!')}
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        {isAdminView ? (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h1 className="text-3xl font-extrabold text-gray-900">Store Management</h1>
              <button 
                onClick={() => setIsAdminView(false)}
                className="text-indigo-600 font-semibold hover:text-indigo-700"
              >
                Back to Shop
              </button>
            </div>
            <AdminDashboard 
              products={products}
              orders={orders}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
              onUpdateStatus={handleUpdateOrderStatus}
            />
          </div>
        ) : (
          <div className="space-y-10">
            {/* Hero Section */}
            {selectedCategory === 'All' && !searchQuery && (
              <div className="relative rounded-3xl overflow-hidden h-[300px] md:h-[400px]">
                <img 
                  src="https://picsum.photos/seed/hero/1200/400" 
                  className="w-full h-full object-cover" 
                  alt="NovaMart Hero"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent flex items-center p-8 md:p-16">
                  <div className="max-w-md space-y-4">
                    <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase tracking-widest">New Collection</span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white leading-tight">Elevate Your Lifestyle</h2>
                    <p className="text-gray-200 text-lg">Discover the future of shopping with our AI-curated collection of premium products.</p>
                    <button className="bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors shadow-xl">
                      Shop Now
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Products Grid */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-900">
                  {searchQuery ? `Results for "${searchQuery}"` : selectedCategory}
                </h2>
                <p className="text-sm text-gray-500">{filteredProducts.length} items found</p>
              </div>
              
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.map(p => (
                    <ProductCard 
                      key={p.id} 
                      product={p} 
                      onAddToCart={handleAddToCart}
                      onViewDetails={setViewedProduct}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                  <i className="fas fa-box-open text-4xl text-gray-300 mb-4"></i>
                  <h3 className="text-lg font-semibold text-gray-900">No products found</h3>
                  <p className="text-gray-500">Try adjusting your filters or search terms.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white mr-2">
                  <i className="fas fa-shopping-bag"></i>
                </div>
                <span className="text-xl font-bold text-indigo-600">NovaMart</span>
              </div>
              <p className="text-gray-500 text-sm">Providing quality products and smart AI-driven shopping experiences since 2024.</p>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                {Object.values(Category).map(c => <li key={c} className="hover:text-indigo-600 cursor-pointer">{c}</li>)}
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="hover:text-indigo-600 cursor-pointer">Help Center</li>
                <li className="hover:text-indigo-600 cursor-pointer">Track Order</li>
                <li className="hover:text-indigo-600 cursor-pointer">Shipping Policy</li>
                <li className="hover:text-indigo-600 cursor-pointer">Returns</li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-gray-900 mb-4">Connect</h4>
              <div className="flex space-x-4">
                <i className="fab fa-twitter text-gray-400 hover:text-indigo-600 cursor-pointer text-xl"></i>
                <i className="fab fa-instagram text-gray-400 hover:text-indigo-600 cursor-pointer text-xl"></i>
                <i className="fab fa-facebook text-gray-400 hover:text-indigo-600 cursor-pointer text-xl"></i>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
            © 2024 NovaMart AI E-Commerce. All rights reserved.
          </div>
        </div>
      </footer>

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onUpdateQuantity={handleUpdateCartQty}
        onRemove={handleRemoveFromCart}
        onCheckout={handleCheckout}
      />

      <ShoppingAssistant products={products} />

      {/* Product Detail Modal */}
      {viewedProduct && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setViewedProduct(null)}></div>
          <div className="bg-white rounded-3xl w-full max-w-4xl overflow-hidden shadow-2xl relative animate-in zoom-in-95">
            <button onClick={() => setViewedProduct(null)} className="absolute top-4 right-4 z-10 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center hover:bg-gray-100">
              <i className="fas fa-times"></i>
            </button>
            <div className="flex flex-col md:flex-row">
              <div className="md:w-1/2">
                <img src={viewedProduct.image} className="w-full h-full object-cover min-h-[300px]" alt={viewedProduct.name} />
              </div>
              <div className="md:w-1/2 p-8 space-y-6">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">{viewedProduct.category}</span>
                  <h2 className="text-3xl font-bold text-gray-900 mt-1">{viewedProduct.name}</h2>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-2xl font-bold text-gray-900">${viewedProduct.price.toFixed(2)}</span>
                  <div className="bg-yellow-50 text-yellow-600 px-2 py-1 rounded-lg flex items-center text-sm font-bold">
                    <i className="fas fa-star mr-1"></i>
                    {viewedProduct.rating}
                  </div>
                </div>
                <p className="text-gray-500 leading-relaxed">{viewedProduct.description}</p>
                <div className="space-y-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <i className="fas fa-check-circle text-green-500 mr-2"></i>
                    In stock ({viewedProduct.stock} available)
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <i className="fas fa-truck text-indigo-500 mr-2"></i>
                    Free shipping on orders over $50
                  </div>
                  <button 
                    onClick={() => {
                      handleAddToCart(viewedProduct);
                      setViewedProduct(null);
                    }}
                    className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
