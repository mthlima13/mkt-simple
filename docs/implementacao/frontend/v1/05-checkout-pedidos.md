# 5. Efetivação do Checkout

A rota de consumo e finalização. Acessamos globalmente os itens salvos pelo comprador na página inicial e disparamos um JSON estruturado para dentro do nosso backend criar o registro e debitar o estoque (`POST /orders`).

## 5.1. Página de Carrinho (`app/cart/page.tsx`)

Crie a pasta `app/cart` e dentro dela `page.tsx`:

```tsx
'use client';

import { useCartStore } from '@/store/cartStore';
import { apiFetch } from '@/lib/api';
import { Order } from '@/types';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeFromCart, getCartTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    
    setLoading(true);
    try {
      // Monta o DTO exatamente como formatado pelo backend Order.java
      const orderPayload: Order = {
        items: items.map(item => ({
          productId: item.id,
          quantity: item.quantity
        }))
      };

      await apiFetch('/orders', {
        method: 'POST',
        body: JSON.stringify(orderPayload)
      });

      alert('Seu pedido foi criado com sucesso!');
      clearCart(); // Limpa estado local do Client
      router.push('/'); // Redireciona para home

    } catch (e: any) {
      alert("Falha ao fechar o pedido (Pode estar sem estoque?): " + e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="text-blue-600 hover:underline">← Voltar ao Catálogo</Link>
          <h1 className="text-3xl font-bold">Checkout: Carrinho</h1>
        </div>

        {items.length === 0 ? (
          <div className="bg-white p-8 shadow-sm rounded-lg text-center">
             <p className="text-gray-500 text-lg mb-4">Seu carrinho está vazio.</p>
             <Link href="/" className="text-blue-600 border border-blue-600 px-4 py-2 rounded-md hover:bg-blue-50 transition">
               Bora comprar?
             </Link>
          </div>
        ) : (
          <div className="bg-white p-6 shadow-sm rounded-xl">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center border-b border-gray-100 py-5">
                <div className="flex flex-col">
                  <h3 className="font-bold text-lg text-gray-800">{item.title}</h3>
                  <p className="text-sm text-gray-500">Unidade: R$ {item.price.toFixed(2)} | Qtd reservada: {item.quantity}</p>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-black text-green-700 text-xl">
                    R$ {(item.price * item.quantity).toFixed(2)}
                  </span>
                  <button 
                    onClick={() => removeFromCart(item.id)} 
                    className="text-red-400 font-semibold text-sm hover:text-red-700"
                  >
                    Remover
                  </button>
                </div>
              </div>
            ))}

            {/* Painel de Finalização */}
            <div className="mt-8 bg-gray-50 p-6 rounded-lg flex flex-col items-end">
               <span className="text-sm text-gray-500 uppercase tracking-widest font-bold mb-1">Total a pagar</span>
               <span className="text-4xl font-black text-gray-800 mb-6">R$ {getCartTotal().toFixed(2)}</span>
               
               <button 
                  onClick={handleCheckout} 
                  disabled={loading}
                  className="bg-green-600 text-white w-full sm:w-auto px-10 py-4 rounded-xl font-bold hover:bg-green-700 disabled:opacity-50 transition"
               >
                  {loading ? 'Processando servidor...' : 'Pagar e Finalizar Pedido'}
               </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
```
