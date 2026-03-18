'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';
import { Search, ShoppingCart, Sparkles, Store } from 'lucide-react';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { items } = useCartStore();

  const fetchProducts = async (term: string) => {
    setLoading(true);
    try {
      const query = term ? `?search=${encodeURIComponent(term)}` : '';
      const data = await apiFetch(`/products${query}`);
      setProducts(data || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts('');
  }, []);

  return (
    <main className="min-h-screen bg-slate-50 font-sans pb-20">
      {/* Premium Navigation */}
      <nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/70 border-b border-white/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-2.5 rounded-xl shadow-lg shadow-indigo-200">
              <Store className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-indigo-600 tracking-tight">
              MktSimple
            </h1>
          </div>

          <div className="flex items-center gap-6 flex-1 max-w-lg ml-12">
            <div className="relative w-full group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input 
                type="text" 
                placeholder="Pesquisar estilo, tech, móveis..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchProducts(search)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-full text-sm outline-none transition-all focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-400 shadow-sm"
              />
            </div>
          </div>

          <Link href="/cart" className="relative group ml-8">
            <div className="bg-white border border-slate-200 rounded-full px-6 py-3 font-semibold flex items-center gap-3 transition-all hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-100">
               <ShoppingCart className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
               <span className="text-slate-700">Carrinho</span>
               {items.length > 0 && (
                 <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-rose-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full shadow-lg shadow-rose-200 border-2 border-white animate-in zoom-in">
                   {items.reduce((acc, i) => acc + i.quantity, 0)}
                 </span>
               )}
            </div>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 mt-12 mb-16">
        <div className="bg-gradient-to-br from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-10 md:p-16 relative overflow-hidden shadow-2xl shadow-indigo-900/20 border border-indigo-700/50">
           <div className="absolute top-0 right-0 p-12 opacity-15">
              <Sparkles className="w-64 h-64 text-white" />
           </div>
           <div className="relative z-10 max-w-2xl">
              <span className="inline-block py-1 px-4 rounded-full bg-white/10 border border-white/20 text-indigo-100 text-sm font-semibold mb-6 backdrop-blur-md shadow-sm">
                 ✨ Nova Coleção 2026
              </span>
              <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6 tracking-tight">
                 Eleve seu setup.<br/>Transforme seu espaço.
              </h2>
              <p className="text-indigo-100/80 text-lg md:text-xl mb-8 leading-relaxed font-medium">
                 Descubra produtos premium selecionados pelos melhores vendedores do mercado, com garantia de qualidade e entrega expressa.
              </p>
           </div>
        </div>
      </div>

      {/* Catalog Grid */}
      <div className="max-w-7xl mx-auto px-6">
        <h3 className="text-2xl font-bold text-slate-800 mb-8 flex items-center gap-3">
           Destaques para você
        </h3>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map(i => (
               <div key={i} className="h-96 bg-white rounded-3xl animate-pulse border border-slate-100 shadow-sm"></div>
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {products.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-slate-100 shadow-sm">
             <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-slate-400" />
             </div>
             <h4 className="text-xl font-bold text-slate-800 mb-2">Poxa, nenhum produto encontrado</h4>
             <p className="text-slate-500">Tente buscar por termos diferentes ou navegue pelas categorias.</p>
          </div>
        )}
      </div>
    </main>
  );
}
