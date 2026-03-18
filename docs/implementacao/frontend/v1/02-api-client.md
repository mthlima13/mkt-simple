# 2. Cliente HTTP e Autenticação (Fake)

Como não teremos um fluxo complexo de login por enquanto, mas o back-end exige que exista um cabeçalho `X-User-Id` com o UUID do usuário, vamos criar um cliente padrão usando `fetch` nativo que sempre anexa esse header se houver um UUID "mockado" (simulado) no `localStorage`.

## 2.1. Criando as Tipagens (Models)

Crie o arquivo `types/index.ts` contendo as interfaces de comunicação idênticas às respostas do Java:

```typescript
export interface Product {
  id: string;
  sellerId: string;
  title: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  status: 'ACTIVE' | 'INACTIVE';
}

export interface OrderItem {
  productId: string;
  quantity: number;
  price?: number;
}

export interface Order {
  id?: string;
  buyerId?: string;
  sellerId?: string; // Opcional na criação, o backend descobre
  items: OrderItem[];
  totalValue?: number;
  status?: string;
}
```

## 2.2. Criando o Client Customizado (Fetch API)

Crie o arquivo `lib/api.ts`. Centralizar requisições evita espalhar URLs absolutas e repetição de lógicas de Headers pelo código inteiro.

```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  // Simulando login: se não existir usuário logado localmente, cria um fake "buyer" default.
  // Idealmente, você faria uma tela simples antes com "Entrar como Vendedor" ou "Entrar como Comprador".
  if (typeof window !== 'undefined' && !localStorage.getItem('fake_user_id')) {
     localStorage.setItem('fake_user_id', 'buyer-uuid-1234');
     localStorage.setItem('fake_user_role', 'BUYER');
  }

  // Pega do storage (funcionará apenas em Client-Side Components - hooks 'use client')
  const userId = typeof window !== 'undefined' ? localStorage.getItem('fake_user_id') : 'server-fallback';

  const defaultHeaders = {
    'Content-Type': 'application/json',
    'X-User-Id': userId || '' // MOCK DA AUTENTICAÇÃO DO GATEWAY EXIGIDO PELO BACKEND
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`API Error: ${response.status} - ${errorBody}`);
  }

  // Permite suportar endpoints que não retornam JSON (ex: PATCH vazio)
  const contentType = response.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return response.json();
  }
  
  return response.text();
};
```
