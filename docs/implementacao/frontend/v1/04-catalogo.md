# 4. Construindo o Catálogo de Produtos

Rotina principal visualmente (Home do Marketplace). Lista cards recuperados do backend via `GET /products` e os insere no carrinho da store do Zustand montada no passo anterior.

## 4.1. Componente de Produto (`ProductCard`)

Crie o arquivo `components/product/ProductCard.tsx`:

```tsx
'use client';

import { Product } from '@/types';
import { useCartStore } from '@/store/cartStore';

export default function ProductCard({ product }: { product: Product }) {
  const addToCart = useCartStore(state => state.addToCart);

  return (
    <div className="border border-gray-200 rounded-lg p-4 shadow-sm flex flex-col justify-between bg-white hover:shadow-md transition">
      <div>
        {/* Placeholder simulando uma Imagem */}
        <div className="h-40 bg-gray-100 rounded-md mb-4 flex items-center justify-center text-gray-400">
           Sem Imagem
        </div>
        <h3 className="font-bold text-lg text-gray-800">{product.title}</h3>
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full inline-block mt-2 font-semibold">
          {product.category || 'Sem Categoria'}
        </span>
        <p className="text-gray-500 text-sm mt-3 line-clamp-2">{product.description}</p>
      </div>
      
      <div className="mt-5 flex justify-between items-center border-t border-gray-100 pt-4">
        <span className="text-xl font-black text-green-700">R$ {product.price.toFixed(2)}</span>
        <button 
          onClick={() => addToCart(product)}
          className="bg-black text-white px-4 py-2 text-sm font-semibold rounded-md hover:bg-gray-800 transition"
        >
          Comprar
        </button>
      </div>
    </div>
  );
}
```

## 4.2. Página Principal (`app/page.tsx`)

Mapeando os dados interativamente. Em apps Server-Side nós poderíamos buscar pelo Next diretamente renderizado. Aqui usaremos um Padrão CSR padrão (react tradicional 'use client') porque facilitará passar parâmetros customizados na url simulando a barra de pesquisa exigida no Requisito.

Substitua `app/page.tsx` por:

```tsx
'use client';

import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { Product } from '@/types';
import ProductCard from '@/components/product/ProductCard';
import Link from 'next/link';
import { useCartStore } from '@/store/cartStore';

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const { items } = useCartStore();

  const fetchProducts = async (term: string) => {
    try {
      // Usamos a construção da querystring se o termo não for vazio
      const query = term ? `?search=${encodeURIComponent(term)}` : '';
      const data = await apiFetch(`/products${query}`);
      setProducts(data);
    } catch (e) {
        console.error("Falha ao buscar produtos da API", e);
    }
  };

  useEffect(() => {
    fetchProducts('');
  }, []); // Roda logo no carregamento

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
      
        {/* Header / Navbar Simples */}
        <div className="flex justify-between items-center mb-10 pb-4 border-b">
          <h1 className="text-3xl font-black text-blue-600">MktSimple</h1>
          <div className="flex items-center gap-6">
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Buscar (ex: teclado)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && fetchProducts(search)}
                className="border p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
              />
              <button 
                onClick={() => fetchProducts(search)} 
                className="bg-blue-600 font-semibold text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Buscar
              </button>
            </div>

            <Link href="/cart" className="bg-white border rounded-full px-5 py-2 font-bold shadow-sm flex gap-2">
               🛒 <span>{items.length} itens</span>
            </Link>
          </div>
        </div>

        {/* Listagem */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        
        {products.length === 0 && (
          <div className="mt-16 text-center text-gray-500">
             Nenhum produto publicado ou não encontrado na busca.
          </div>
        )}

      </div>
    </main>
  );
}
```
