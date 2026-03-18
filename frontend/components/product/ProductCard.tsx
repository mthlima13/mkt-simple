'use client';

import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';
import { Plus, Package } from 'lucide-react';

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore(state => state.addToCart);

  return (
    <div className="group bg-white border border-slate-200/60 rounded-3xl p-5 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between h-full relative overflow-hidden">
      
      {/* Decorative gradient blob */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 pointer-events-none"></div>

      <div>
        <div className="h-48 bg-slate-50 rounded-2xl mb-5 flex items-center justify-center text-slate-300 relative overflow-hidden group-hover:bg-slate-100 transition-colors border border-slate-100/50">
           <Package className="w-12 h-12" />
           <div className="absolute top-3 left-3">
              <span className="bg-white/80 backdrop-blur-md text-indigo-700 px-3 py-1 rounded-full text-xs font-bold border border-indigo-100 shadow-sm">
                Top Vendas
              </span>
           </div>
        </div>
        
        <div className="space-y-2 relative z-10">
          <span className="text-xs uppercase tracking-wider font-bold text-indigo-500">
            {product.category || 'Geral'}
          </span>
          <h3 className="font-extrabold text-lg text-slate-800 leading-tight group-hover:text-indigo-700 transition-colors">
            {product.title}
          </h3>
          <p className="text-slate-500 text-sm line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>
      </div>
      
      <div className="mt-8 flex justify-between items-end relative z-10">
        <div className="flex flex-col">
          <span className="text-xs text-slate-400 font-medium mb-1">Preço à vista</span>
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
          </span>
        </div>
        <button 
          onClick={() => addToCart(product)}
          className="bg-slate-900 text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all shadow-md hover:shadow-indigo-500/25"
          title="Adicionar ao Carrinho"
        >
          <Plus className="w-6 h-6" />
        </button>
      </div>
    </div>
  );
}
