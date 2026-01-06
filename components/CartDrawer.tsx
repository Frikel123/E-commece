
import React from 'react';
import { CartItem } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ 
  isOpen, onClose, items, onUpdateQuantity, onRemove, onCheckout 
}) => {
  const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-40 backdrop-blur-sm transition-opacity" onClick={onClose}></div>
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out">
        <div className="h-full flex flex-col">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              Your Cart 
              <span className="ml-2 text-sm font-normal text-gray-500">({items.length} items)</span>
            </h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-400 hover:text-gray-600 transition-colors">
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center text-gray-300">
                  <i className="fas fa-shopping-cart text-3xl"></i>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Your cart is empty</h3>
                  <p className="text-gray-500 text-sm">Add some items to start shopping!</p>
                </div>
                <button onClick={onClose} className="text-indigo-600 font-semibold hover:text-indigo-700">
                  Browse products →
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex space-x-4">
                    <img src={item.image} alt={item.name} className="w-20 h-20 rounded-xl object-cover" />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-1">{item.name}</h4>
                        <button onClick={() => onRemove(item.id)} className="text-gray-400 hover:text-red-500 transition-colors text-xs">
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                      <p className="text-indigo-600 font-bold mt-1 text-sm">${item.price.toFixed(2)}</p>
                      <div className="flex items-center space-x-3 mt-2">
                        <button 
                          onClick={() => onUpdateQuantity(item.id, -1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
                        >
                          <i className="fas fa-minus text-[10px]"></i>
                        </button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => onUpdateQuantity(item.id, 1)}
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50"
                        >
                          <i className="fas fa-plus text-[10px]"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-6 py-6 border-t border-gray-100 bg-gray-50 space-y-4">
            <div className="flex justify-between text-gray-500 text-sm">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-500 text-sm">
              <span>Shipping</span>
              <span className="text-green-600 font-medium">Calculated at next step</span>
            </div>
            <div className="flex justify-between text-gray-900 text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button 
              onClick={onCheckout}
              disabled={items.length === 0}
              className="w-full bg-indigo-600 text-white py-4 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Secure Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
