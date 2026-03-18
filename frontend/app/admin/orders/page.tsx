'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Order } from '@/types';

export default function SellerOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    localStorage.setItem('fake_user_role', 'SELLER');
    localStorage.setItem('fake_user_id', 'vendedor-central-001');
    
    try {
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
        body: JSON.stringify(newStatus)
      });
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
         <div className="bg-white p-8 rounded shadow-sm text-center text-gray-400 border border-gray-100">
           Sua loja ainda não possui nenhuma venda processada ou ocorreu erro de conexão.
         </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100/80 text-gray-500 uppercase text-xs">
              <tr>
                <th className="p-4 font-bold">Protocolo</th>
                <th className="p-4 font-bold">Total</th>
                <th className="p-4 font-bold">Status Atual</th>
                <th className="p-4 font-bold">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100/80">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-gray-50/50">
                  <td className="p-4 text-sm font-mono text-gray-700">#{o.id}</td>
                  <td className="p-4 font-black tracking-tighter text-indigo-700">R$ {o.totalValue?.toFixed(2)}</td>
                  
                  <td className="p-4 text-xs font-semibold">
                     <span className={`px-3 py-1 rounded-full ${o.status === 'PAID' ? 'bg-indigo-100 text-indigo-800' : o.status === 'SHIPPED' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                       {o.status}
                     </span>
                  </td>
                  
                  <td className="p-4 text-sm">
                    <select 
                      className="border border-gray-300 bg-white rounded-md p-2 outline-none focus:ring-2 focus:border-transparent focus:ring-indigo-400 font-medium cursor-pointer"
                      value={o.status}
                      onChange={(e) => updateStatus(o.id!, e.target.value)}
                    >
                      <option value="PAID">Pago</option>
                      <option value="SHIPPED">Enviado</option>
                      <option value="DELIVERED">Entregue</option>
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
