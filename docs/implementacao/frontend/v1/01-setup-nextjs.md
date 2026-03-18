# 1. Setup Inicial do Frontend (Next.js)

Este guia cobre a criação inicial do frontend do Marketplace Simplificado utilizando Next.js com App Router.

## 1.1. Gerando o Projeto

Para criar a fundação do nosso projeto, abra o terminal na pasta em que deseja guardar o frontend (ex: na raiz ou dentro de `mkt-simple`) e rode:

```bash
npx create-next-app@latest marketplace-web
```

Ao ser perguntado pelas opções:
- TypeScript? **Sim**
- ESLint? **Sim**
- Tailwind CSS? **Sim**
- `src/` directory? **Não** (ou Sim, como preferir, vamos usar `app/` na raiz aqui)
- App Router? **Sim**
- Customize import alias? **Não**

## 1.2. Organização de Pastas Recomendada

Dentro da estrutura gerada (pasta `marketplace-web`), crie estas pastas para organizar seu ecossistema front-end de forma clara:

```text
/marketplace-web
 ├── /app              # Rotas e páginas (App Router)
 │    ├── /(buyer)     # Grupos de rotas p/ loja (ex: /, /cart, /orders)
 │    └── /(seller)    # Grupos de rotas p/ vendedor (ex: /admin/products)
 ├── /components       # Componentes React reutilizáveis (Botões, Cards, Navbar)
 │    ├── /ui          # Componentes genéricos
 │    └── /product     # Componentes de domínio (ProductCard, CartItem)
 ├── /lib
 │    └── api.ts       # Centralização da chamada pro Backend (Axios ou Fetch)
 ├── /store            # Gerenciamento de estado global (ex: Zustand para o Carrinho)
 └── /types            # Interfaces do TypeScript (Product, Order, User)
```

## 1.3. Ajuste Básico de Estilos (Tailwind)

Seu `app/globals.css` já vem com Tailwind configurado. Remova os esquemas de cores padrão muito complexos nas variáveis CSS `:root` caso queira começar de um fundo limpo branco/cinza.

Limpe o conteúdo de `app/page.tsx` para podermos começar o projeto do zero sem o boilerplate do Next.js:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold">Bem vindo ao Marketplace</h1>
    </main>
  );
}
```

Rode `npm run dev` para validar que está tudo OK em `localhost:3000`.
