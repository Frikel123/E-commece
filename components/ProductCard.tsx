
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (p: Product) => void;
  onViewDetails: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart, onViewDetails }) => {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative aspect-square overflow-hidden cursor-pointer" onClick={() => onViewDetails(product)}>
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>
        {product.stock < 5 && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            Low Stock
          </span>
        )}
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-widest">{product.category}</span>
          <div className="flex items-center text-yellow-400 text-xs">
            <i className="fas fa-star mr-1"></i>
            <span className="text-gray-600 font-medium">{product.rating}</span>
          </div>
        </div>
        <h3 className="text-gray-900 font-semibold text-lg line-clamp-1 mb-1 group-hover:text-indigo-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <span className="text-xl font-bold text-gray-900">${product.price.toFixed(2)}</span>
          <button 
            onClick={() => onAddToCart(product)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center shadow-md shadow-indigo-100"
          >
            <i className="fas fa-plus mr-2"></i>
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
