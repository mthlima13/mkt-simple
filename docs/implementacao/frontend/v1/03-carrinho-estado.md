# 3. Gerenciamento de Estado Global (Carrinho)

O carrinho de compras precisa ser acessado através de várias páginas (catálogo para adicionar produto, navbar para mostrar a quantia e rota `/cart` para manipular e fechar). Utilizaremos estado local + persistência automática do **Zustand**.

## 3.1. Instalando o Zustand

No terminal do frontend (`marketplace-web`), execute:
```bash
npm install zustand
```

## 3.2. Criando a Store do Carrinho (`cartStore.ts`)

Crie o arquivo `store/cartStore.ts`. Usamos o middleware `persist` nativo para garantir que se o usuário fechar a aba e voltar, o carrinho não desapareça.

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '../types';

export interface CartItem extends Product {
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (product) => {
        const items = get().items;
        const exists = items.find(item => item.id === product.id);
        
        // Se o produto já existe no carrinho, só aumenta a quantidade
        if (exists) {
          set({ 
            items: items.map(item => 
              item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
            ) 
          });
        } else {
          // Senão, adicona ele como QTD = 1
          set({ items: [...items, { ...product, quantity: 1 }] });
        }
      },

      removeFromCart: (productId) => set((state) => ({
        items: state.items.filter(item => item.id !== productId)
      })),

      clearCart: () => set({ items: [] }),

      getCartTotal: () => get().items.reduce((total, item) => total + (item.price * item.quantity), 0),
    }),
    {
      name: 'marketplace-cart', // nome da chave no localStorage do browser
    }
  )
);
```

> **Curiosidade:** Usando apenas este arquivo minúsculo, substituímos a enorme barreira que seria montar Boilerplates de Redux! Qualquer componente do App pode chamar `const { items, addToCart } = useCartStore()` diretamente.
