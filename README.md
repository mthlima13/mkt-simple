# 🛒 MktSimple - Marketplace Simplificado

O **MktSimple** é uma plataforma de e-commerce moderna e ágil construída com foco na experiência fluida de compra e robustez estrutural no lado do servidor. Ele conecta Vendedores e Compradores através de uma interface esteticamente *premium* (com design contemporâneo) e um backend escalável.

## 🚀 Tecnologias Utilizadas

### Frontend (Next.js)
- **Next.js 15+ (App Router)** para roteamento React moderno.
- **Tailwind CSS v4** para estilização utilitária rápida, uso intensivo de *Glassmorphism* e micro-interações dinâmicas.
- **Zustand** para o gerenciamento de estado global flexível e carrinho de compras persistente via `localStorage`.
- **Lucide React** para iconografia limpa e moderna.

### Backend (Spring Boot + Java 21)
- **Java 21 e Spring Boot 3.4+** para construção ágil da API RESTful de serviços.
- **MongoDB** com `Spring Data MongoDB` para persistência. Uso de agregações e *Text Indexes* para otimização de busca rica em catálogo, além de atualizações atômicas e transacionais (`findAndModify`) que previnem venda sem estoque.
- **Docker Compose** para facilidade conteinerizada na orquestração do Banco de Dados local.

---

## 📸 Demonstração Visual (Imagens)

Abaixo você pode observar a evolução visual e os detalhes da interface construída:

<div align="center">
  <img src="imgs/Captura%20de%20tela%202026-03-18%20162543.png" alt="Catálogo Superior - Header e Hero" width="800"/>
  <br/><br/>
  <img src="imgs/Captura%20de%20tela%202026-03-18%20162555.png" alt="Listagem de Produtos - Grid" width="800"/>
  <br/><br/>
  <img src="imgs/Captura%20de%20tela%202026-03-18%20162610.png" alt="Rodapé e Componentes" width="800"/>
</div>

## 🎥 Demonstração em Vídeo

Confira o fluxo completo do MktSimple rodando e navegável na prática, incluindo a manipulação do painel do carrinho:

<video src="video/Gravando%202026-03-18%20163329.mp4" controls="controls" style="max-width: 100%;">
  Seu navegador não suporta vídeos na leitura nativa desta plataforma. <a href="video/Gravando%202026-03-18%20163329.mp4" target="_blank">Clique aqui para baixar ou assistir o vídeo em MP4.</a>
</video>

---

## 🛠 Funcionalidades e Jornada

### Sessão Comprador (BUYER)
1. **Vitrine Dinâmica:** Visualização fluida do catálogo de produtos ativos.
2. **Busca Instantânea:** Uma barra de pesquisas performática (filtrando via DB ou via API Fallback Mock).
3. **Carrinho Persistente:** O Zustand e seu `middleware` salva o estado dos pedidos localmente para garantir abandono nulo (F5 não perde dados).
4. **Fechamento Ágil:** Painel dinâmico (com resumo monetário) convertendo pedidos completos num *payload* unificado de checkout na mesma tela!

### Sessão Vendedor (SELLER)
1. **Painel Logístico de Operações:** Uma tela de administração (`/admin/orders`) isolada para controle global histórico de suas vendas.
2. **Mudança de Rastreio:** Processamento rápido sem reload do pedido (`PAID` -> `SHIPPED` -> `DELIVERED`), refletindo com badges contextuais coloridos (Amarelo, Laranja, Verde).

---

## 🏃 Como Rodar Este Projeto Localmente

### 1. Iniciar o Banco de Dados Docker
Acesse a pasta `backend` e inicialize o contêiner do MongoDB:
```bash
cd backend
docker-compose up -d mongodb
```

### 2. Iniciar a API Java
Aguarde o MongoDB alocar sua base exposta na porta `27017` e suba o projeto web na porta `8080`:
```bash
./mvnw spring-boot:run
```

### 3. Iniciar o Frontend 
Em um novo terminal Node, dirija-se até seu ambiente React do usuário:
```bash
cd frontend
npm install
npm run dev
```

Abra seu navegador no servidor vitrine `http://localhost:3000`. 
*(Obs: Caso preferira apenas validar o visual (UI) e o Banco de Dados/Java não estejam comunicáveis, a nossa camada de API Client intercepta as Requisições e emite automaticamente **Dados Mocks Místicos** — garantindo navegação absoluta pelo catálogo mesmo offline!)*
