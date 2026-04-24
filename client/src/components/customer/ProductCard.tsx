import React from 'react';
import { Product } from '../../types';
import { ShoppingCart, Eye, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { motion } from 'motion/react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="glass-card overflow-hidden group border-brand-dark/20 flex flex-col h-full bg-[#0a1111]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-3 left-3 bg-brand-primary/90 text-white text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
          {product.category}
        </div>
      </div>
      
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-display font-semibold text-lg line-clamp-1">{product.name}</h3>
          <div className="flex items-center gap-1 text-yellow-500">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-xs font-medium">4.8</span>
          </div>
        </div>
        
        <p className="text-text-secondary text-sm line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>
        
        <div className="flex items-center justify-between mt-auto">
          <div>
            <span className="text-2xl font-bold text-brand-primary">₹{product.price}</span>
            <span className="text-xs text-text-secondary ml-1">/{product.unit}</span>
          </div>
          
          <div className="flex gap-2">
            <Link 
              to={`/product/${product.id}`}
              className="p-2 rounded-lg bg-bg-surface text-text-secondary hover:text-brand-primary transition-colors"
              title="View Details"
            >
              <Eye className="w-5 h-5" />
            </Link>
            <button 
              onClick={() => addToCart(product)}
              className="p-2 rounded-lg bg-brand-primary text-white hover:bg-brand-secondary transition-colors"
              title="Add to Cart"
            >
              <ShoppingCart className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
