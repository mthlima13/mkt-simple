# 6. Painel do Vendedor e Atualização de Vendas

Simulando o sistema em que um Vendedor visualiza suas vendas e manipula as entregas enviando um patch da mudança do estado.

## 6.1 Página de Administração (`app/admin/orders/page.tsx`)

Apenas para efeito da sua demonstração, no momento em que carregamos esta página vamos "forçar/injetar" um id que represente um Vendedor no cabeçalho do Mock `localStorage` para a API entender que o papel e o usuário se alteraram. (*Idealmente isso ocorreria no momento real do envio das telas de Login / Contexto Global User*).

Crie as pastas `app/admin/orders` e dentro adicione `page.tsx`:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Order } from '@/types';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    // [HACK APENAS P/ TESTE] Garantimos que estamos usando uma conta genérica de "Seller" fictícia
    // Em produção a Auth JWT providenciaria esse dado isolado.
    localStorage.setItem('fake_user_role', 'SELLER');
    localStorage.setItem('fake_user_id', 'vendedor-central-001'); // O id do vendedor q publicou
    
    try {
      // O backend retorna pedidos associados a requisição se validado a regra de negócio
      const data = await apiFetch('/orders'); 
      setOrders(data);
    } catch(e) { 
      console.warn("Erro ao buscar histórico", e);
    }
  };

  const updateStatus = async (orderId: string, newStatus: string) => {
    try {
      await apiFetch(`/orders/${orderId}/status`, {
        method: 'PATCH',
        body: JSON.stringify(newStatus) // Body é diretamente a String neste contrato
      });
      // Tudo ok, recarrega lista da tela
      fetchOrders(); 
    } catch (e: any) {
      alert("Acesso Negado ou Erro ao editar status! " + e.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <main className="p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-black mb-8 text-indigo-900 border-b pb-4">Painel Logístico Vendedor</h1>
      
      {orders.length === 0 ? (
         <div className="bg-white p-8 rounded shadow text-center text-gray-400">
           Sua loja ainda não possui nenhuma venda processada.
         </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100/80 text-gray-500 uppercase text-xs">
              <tr>
                <th className="p-4 font-bold">Identificação (Protocolo)</th>
                <th className="p-4 font-bold">Total Fechado</th>
                <th className="p-4 font-bold">Situação Operacional</th>
                <th className="p-4 font-bold">Ação Despacho</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/80">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/50">
                  <td className="p-4 text-sm font-mono text-gray-700">#{o.id}</td>
                  <td className="p-4 font-black tracking-tighter text-indigo-700">R$ {o.totalValue?.toFixed(2)}</td>
                  
                  <td className="p-4 text-xs font-semibold">
                     {/* Badge Lógica de Cores Visualização status  */}
                     <span className={`px-3 py-1 rounded-full ${o.status === 'PAID' ? 'bg-indigo-100 text-indigo-800' : o.status === 'SHIPPED' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                       {o.status}
                     </span>
                  </td>
                  
                  <td className="p-4 text-sm">
                    <select 
                      className="border border-gray-300 bg-white rounded-md p-2 outline-none focus:ring-2 focus:border-transparent focus:ring-indigo-400"
                      value={o.status}
                      onChange={(e) => updateStatus(o.id!, e.target.value)}
                    >
                      <option value="PAID">Marcar "Pago"</option>
                      <option value="SHIPPED">Mover "Para Tranposte"</option>
                      <option value="DELIVERED">Marcar "Entregue ao cliente"</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
```

> Com este fluxo final, encerramos todo o ciclo vital de compras! Uma home onde lista dados do Backend, o Zustand que une entre páginas, a chamada `POST` gerando a transação via Contexto Web e um Seller simulado via localstorage efetuando despacho.
