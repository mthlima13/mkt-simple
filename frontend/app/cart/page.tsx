'use client';

import { useCartStore } from '@/store/cartStore';
import { apiFetch } from '@/lib/api';
import { Order } from '@/types';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trash2, ShieldCheck, CreditCard, ShoppingBag } from 'lucide-react';

export default function CartPage() {
  const { items, removeFromCart, getCartTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  const handleCheckout = async () => {
    if (items.length === 0) return;
    setLoading(true);
    try {
      const orderPayload: Order = { items: items.map(item => ({ productId: item.id, quantity: item.quantity })) };
      await apiFetch('/orders', { method: 'POST', body: JSON.stringify(orderPayload) });
      alert('Seu pedido foi processado com sucesso! Pode simular a visualização de entrega no painel do vendedor!');
      clearCart();
      router.push('/');
    } catch (e: any) {
      alert("Falha ao fechar o pedido: " + e.message);
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="bg-slate-50 min-h-screen font-sans pb-20">
      {/* Simple Header */}
      <nav className="bg-white border-b border-slate-200 h-20 flex items-center px-6 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium transition-colors">
            <ArrowLeft className="w-5 h-5" /> Voltar à loja
          </Link>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 mt-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-10 flex items-center gap-4">
          <ShoppingBag className="w-10 h-10 text-indigo-600" /> Seu Carrinho
        </h1>

        {items.length === 0 ? (
          <div className="bg-white p-16 shadow-xl shadow-slate-200/40 border border-slate-100 rounded-3xl text-center">
             <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag className="w-10 h-10 text-indigo-300" />
             </div>
             <p className="text-slate-600 text-xl font-medium mb-8">Sua sacola de compras está vazia.</p>
             <Link href="/" className="inline-flex items-center justify-center bg-indigo-600 text-white px-8 py-4 rounded-xl hover:bg-indigo-700 transition font-bold shadow-lg shadow-indigo-600/20">
               Explorar Produtos
             </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items List */}
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="bg-white p-6 shadow-sm border border-slate-200 rounded-2xl flex items-center gap-6 group hover:border-indigo-300 transition-colors">
                  <div className="w-24 h-24 bg-slate-100 rounded-xl flex-shrink-0 flex items-center justify-center">
                     <ShoppingBag className="w-8 h-8 text-slate-300" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <h3 className="font-bold text-lg text-slate-800 leading-tight">{item.title}</h3>
                    <p className="text-slate-500 text-sm mt-1">{item.category}</p>
                    <div className="mt-4 flex items-center gap-4">
                       <span className="bg-slate-100 text-slate-600 text-xs font-bold px-3 py-1 rounded-md">Qtd: {item.quantity}</span>
                       <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1 text-sm font-medium">
                         <Trash2 className="w-4 h-4" /> Remover
                       </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-black text-slate-900 text-xl block tracking-tight">
                      R$ {(item.price * item.quantity).toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">R$ {item.price.toFixed(2)} cada</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary details */}
            <div className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100 h-fit sticky top-28">
               <h3 className="text-xl font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Resumo da Compra</h3>
               
               <div className="space-y-4 mb-6 text-slate-600">
                  <div className="flex justify-between">
                     <span>Subtotal</span>
                     <span className="font-semibold">R$ {getCartTotal().toLocaleString('pt-BR', {minimumFractionDigits: 2})}</span>
                  </div>
                  <div className="flex justify-between">
                     <span>Frete Expresso</span>
                     <span className="text-green-600 font-bold">Grátis</span>
                  </div>
               </div>
               
               <div className="border-t border-slate-100 pt-6 mb-8">
                  <div className="flex justify-between items-end">
                     <span className="text-slate-500 font-medium pb-1">Total a Pagar</span>
                     <span className="text-4xl font-black text-indigo-600 tracking-tight">
                        R$ {getCartTotal().toLocaleString('pt-BR', {minimumFractionDigits: 2})}
                     </span>
                  </div>
               </div>
               
               <button 
                  onClick={handleCheckout} 
                  disabled={loading}
                  className="bg-slate-900 flex items-center justify-center gap-2 text-white w-full py-4 rounded-xl font-bold hover:bg-indigo-600 disabled:opacity-50 transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 text-lg"
               >
                  {loading ? 'Processando...' : <><CreditCard className="w-5 h-5"/> Finalizar Pedido</>}
               </button>

               <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-500 font-medium bg-slate-50 py-3 rounded-lg border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-green-500" />
                  Ambiente Seguro e Criptografado
               </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
