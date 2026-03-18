## 3. Marketplace Simplificado (Produtos/Serviços)

### Pitch

Uma plataforma onde vendedores podem anunciar seus produtos ou serviços e compradores podem encontrá-los facilmente, com um carrinho de compras prático e gestão transparente de status de pedidos.

### Modelo

```javascript
user { _id, name, email, role: ['buyer', 'seller'], passwordHash, createdAt }
product { _id, sellerId, title, description, price, category, stock, images:[], status: ['active', 'inactive'] }
order { _id, buyerId, sellerId, items:[{productId, quantity, price}], totalValue, status: ['pending', 'paid', 'shipped', 'delivered', 'canceled'], createdAt }
review { _id, orderId, productId, userId, rating, comment, createdAt }
```

---

## Funcionalidades Principais

### 1. Gestão de Usuários (Compradores e Vendedores)

**O que o usuário faz:**

- Cadastra seu perfil escolhendo ser comprador ou vendedor.
- Vendedores gerenciam informações e perfil da loja.
- Compradores gerenciam endereços de entrega e formas de pagamento.

**Valor para o usuário:**
Permite uma experiência especializada dependendo do seu papel na plataforma. Vendedores focam em gerenciar seu negócio, enquanto compradores focam em descobrir e adquirir produtos.

### 2. Catálogo e Busca de Produtos

**O que o usuário faz:**

- Visualiza o catálogo completo de produtos disponíveis.
- Utiliza barra de busca com pesquisa textual para encontrar itens específicos.
- Aplica filtros (categoria, faixa de preço, avaliação) para refinar os resultados.
- Visualiza os detalhes do produto, fotos e avaliações de outros compradores.

**Valor para o usuário:**
Facilita a descoberta dos produtos ou serviços desejados de forma rápida e intuitiva, melhorando a experiência de compra.

### 3. Carrinho de Compras e Fechamento de Pedidos (Checkout)

**O que o usuário faz:**

- Adiciona produtos ao carrinho de compras enquanto navega.
- Revisa os itens, altera quantidades ou remove produtos.
- Finaliza o pedido de forma prática, gerando ordens de compra.

**Valor para o usuário:**
Oferece um processo fluido e sem atritos, permitindo adquirir múltiplos itens de uma vez com total clareza sobre os valores e taxas.

### 4. Gestão de Pedidos e Painel Administrativo

**O que o usuário faz:**

- **Vendedor:** Acessa um painel para ver novos pedidos e atualiza o status de processamento (ex: 'pendente' -> 'enviado').
- **Comprador:** Acompanha o histórico de compras e o status atual de entrega de cada pedido.
- Ao final do fluxo, o comprador pode avaliar o produto.

**Valor para o usuário:**
Garante transparência na transação para ambas as partes. Vendedores têm controle do seu fluxo de vendas e compradores sabem exatamente o andamento do pedido.

---

## Fluxo de Dados (Visão de Produto)

### Publicação de Produto (Vendedor)

```text
[FRONT] → Vendedor preenche formulário (título, preço, descrição, fotos, estoque)
       → Envia dados para o back-end
[BACK]  → Valida os dados (campos obrigatórios, preço > 0)
       → Salva o produto vinculado ao ID do vendedor
[DB]    → Armazena documento 'product' na collection
[BACK]  → Retorna confirmação e ID do produto criado
[FRONT] → Redireciona para a página de detalhes do produto no painel
```

### Busca e Adição ao Carrinho (Comprador)

```text
[FRONT] → Comprador digita um termo na busca e aplica filtros
       → Req GET para buscar produtos (search parameters)
[BACK]  → Executa busca textual (text index) e filtros no BD
[DB]    → Retorna lista de documentos 'product' correspondentes
[BACK]  → Envia lista ao front-end
[FRONT] → Exibe a listagem de produtos
[FRONT] → Comprador clica em "Adicionar ao Carrinho"
       → Atualiza o estado local/global do carrinho na interface
```

### Checkout e Atualização de Status

```text
[FRONT] → Comprador acessa o carrinho e clica em "Finalizar Compra"
       → Envia lista de itens da compra e dados do usuário
[BACK]  → Valida estoque e disponibilidade dos produtos
       → Calcula valor total da compra
       → Cria os registros de 'order'
[DB]    → Salva documento(s) 'order' e debita o estoque em 'product' (transação)
[BACK]  → Retorna confirmação e número do pedido
[FRONT] → Mostra tela de sucesso e detalhes
        ...
[FRONT] → Vendedor visualiza o novo pedido e altera status para 'shipped' (enviado)
[BACK]  → Atualiza status do pedido no BD para 'shipped'
[FRONT] → Comprador agora enxerga o pedido como "Enviado" em sua conta
```

---

## Jornada do Usuário (História Completa)

### Do Vendedor (Carlos)
1. **Cadastro:** Carlos cria uma conta como vendedor na plataforma.
2. **Catálogo:** Ele acessa seu painel e cadastra 5 produtos para sua loja, preenchendo detalhes como estoque, preço e imagens.
3. **Venda:** Horas depois, ele recebe uma notificação de um novo pedido confirmado em sua loja.
4. **Gestão:** Ele prepara o produto, realiza o envio e atualiza o status no seu painel para "Enviado". Ele checa seu painel para ver o total das vendas do dia.

### Da Compradora (Marina)
1. **Descoberta:** Marina acessa a plataforma em busca de um teclado. Ela faz uma pesquisa e filtra os resultados pelo preço desejado.
2. **Decisão:** Ela encontra a loja do Carlos, olha as fotos, verifica a descrição e decide efetuar a compra.
3. **Compra:** Marina adiciona o produto ao carrinho, confere o valor e finaliza seu pedido.
4. **Acompanhamento:** Pelo seu painel, ela acompanha o pedido até ver que foi atualizado para "Enviado" pelo vendedor.
5. **Avaliação:** Ao receber a encomenda, ela entra na conta, marca como "Entregue" e deixa uma avaliação de 5 estrelas para o produto, ajudando outros usuários no futuro.

---

## Endpoints

- `GET /products` (suporta query params `?search=&category=&minPrice=&maxPrice=`)
- `GET /products/:id` (retorna detalhes de um produto e suas avaliações)
- `POST /products` (restringido a usuários com role 'seller')
- `POST /orders` (cria pedido, valida estoque; autenticado como 'buyer')
- `GET /orders` (retorna o histórico do 'buyer' ou as vendas do 'seller', dependendo de quem requisitou)
- `PATCH /orders/:id/status` (autenticado como 'seller' para gerenciar andamento)
- `POST /reviews` (autenticado como 'buyer' para compra com status 'delivered')

---

## Desafios

- **Transações e Consistência:** Garantir a consistência de dados (ex: impedir estoques negativos se dois usuários comprarem o último item no mesmo instante temporal). Uso de transações no MongoDB.
- **Busca Eficiente:** Implementação de busca textual no MongoDB usando *text indexes* para performance.
- **UI Complexas:** Gerenciamento do estado global do carrinho de compras e carrinho persistente sem recarregar a página (React Context, Redux ou Zustand).
- **Validações:** Formulários complexos no cadastro de produto e nas etapas de checkout.

---

## Stretch Goals (Objetivos Extras)

- Recuperação de carrinho abandonado com envios de e-mail automatizados.
- Integração real com gateway de pagamento (ex: Stripe, Mercado Pago) para processar transações na plataforma com repasse (split de pagamentos).
- Chat em tempo real para contato direto do comprador com o vendedor.
