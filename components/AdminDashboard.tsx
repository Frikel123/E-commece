
import React, { useState } from 'react';
import { Product, Order, Category } from '../types';
import { generateProductDescription } from '../services/geminiService';

interface AdminDashboardProps {
  products: Product[];
  orders: Order[];
  onAddProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateStatus: (id: string, status: Order['status']) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, orders, onAddProduct, onDeleteProduct, onUpdateStatus }) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'add'>('inventory');
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    category: Category.ELECTRONICS,
    stock: 10,
    price: 0,
    rating: 5.0
  });
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDescription = async () => {
    if (!newProduct.name) return alert('Please enter a product name first.');
    setIsGenerating(true);
    const desc = await generateProductDescription(newProduct.name, newProduct.category || '');
    setNewProduct({ ...newProduct, description: desc });
    setIsGenerating(false);
  };

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProduct.name || !newProduct.price || !newProduct.description) return alert('All fields required');
    onAddProduct({
      ...newProduct as Product,
      id: Date.now().toString(),
      image: `https://picsum.photos/seed/${Date.now()}/600/600`
    });
    setActiveTab('inventory');
    setNewProduct({ category: Category.ELECTRONICS, stock: 10, price: 0, rating: 5.0 });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex border-b border-gray-100">
        <button 
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 py-4 font-bold text-sm ${activeTab === 'inventory' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
        >
          Inventory
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`flex-1 py-4 font-bold text-sm ${activeTab === 'orders' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
        >
          Customer Orders
        </button>
        <button 
          onClick={() => setActiveTab('add')}
          className={`flex-1 py-4 font-bold text-sm ${activeTab === 'add' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-500'}`}
        >
          Add Product
        </button>
      </div>

      <div className="p-6">
        {activeTab === 'inventory' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-gray-400 text-xs uppercase tracking-wider border-b border-gray-50">
                  <th className="pb-4 font-semibold">Product</th>
                  <th className="pb-4 font-semibold">Category</th>
                  <th className="pb-4 font-semibold">Stock</th>
                  <th className="pb-4 font-semibold">Price</th>
                  <th className="pb-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {products.map(p => (
                  <tr key={p.id} className="text-sm group">
                    <td className="py-4">
                      <div className="flex items-center">
                        <img src={p.image} className="w-10 h-10 rounded-lg mr-3 object-cover" />
                        <span className="font-semibold text-gray-900">{p.name}</span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-500">{p.category}</td>
                    <td className="py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${p.stock < 5 ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                        {p.stock} units
                      </span>
                    </td>
                    <td className="py-4 font-bold text-gray-900">${p.price.toFixed(2)}</td>
                    <td className="py-4">
                      <button 
                        onClick={() => onDeleteProduct(p.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-center text-gray-500 py-10">No orders placed yet.</p>
            ) : (
              orders.map(o => (
                <div key={o.id} className="border border-gray-100 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-gray-900">Order #{o.id.slice(-6)}</span>
                      <span className="text-xs text-gray-400">{o.date}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">{o.items.length} items • Total: ${o.total.toFixed(2)}</p>
                  </div>
                  <div className="mt-4 md:mt-0 flex items-center space-x-3">
                    <select 
                      value={o.status}
                      onChange={(e) => onUpdateStatus(o.id, e.target.value as Order['status'])}
                      className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                      <option>Cancelled</option>
                    </select>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'add' && (
          <form onSubmit={handleAddSubmit} className="space-y-4 max-w-xl mx-auto">
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Product Name</label>
              <input 
                required
                type="text" 
                value={newProduct.name || ''}
                onChange={e => setNewProduct({...newProduct, name: e.target.value})}
                className="w-full border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none border"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Category</label>
                <select 
                  value={newProduct.category}
                  onChange={e => setNewProduct({...newProduct, category: e.target.value as Category})}
                  className="w-full border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none border"
                >
                  {Object.values(Category).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Price ($)</label>
                <input 
                  required
                  type="number" 
                  step="0.01"
                  value={newProduct.price || ''}
                  onChange={e => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                  className="w-full border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none border"
                />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Description</label>
                <button 
                  type="button"
                  onClick={handleGenerateDescription}
                  disabled={isGenerating}
                  className="text-[10px] font-bold text-indigo-600 flex items-center hover:text-indigo-700"
                >
                  <i className={`fas ${isGenerating ? 'fa-spinner fa-spin' : 'fa-magic'} mr-1`}></i>
                  {isGenerating ? 'Generating...' : 'AI Generate'}
                </button>
              </div>
              <textarea 
                required
                rows={4}
                value={newProduct.description || ''}
                onChange={e => setNewProduct({...newProduct, description: e.target.value})}
                className="w-full border-gray-200 rounded-xl px-4 py-2 focus:ring-2 focus:ring-indigo-500 outline-none border"
              ></textarea>
            </div>
            <button 
              type="submit"
              className="w-full bg-indigo-600 text-white py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
            >
              Add Product to Store
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
