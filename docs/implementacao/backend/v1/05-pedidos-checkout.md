# 5. Fluxo de Pedidos e Checkout

O fluxo do pedido é onde controlamos a transação mais importante do marketplace: deduzir o estoque e salvar a venda com sucesso.

## 5.1. Serviço de Pedidos com Transação Simplificada

Para garantir que não haja venda com estoque esgotado durante processamento simultâneo, aplicamos uma busca e alteração atômica (`findAndModify`) no MongoDB. O `@Transactional` também assegura que, em caso de erro, nenhum documento seja salvo de forma órfã.

```java
package com.antarez.mktsimple.service;

import com.antarez.mktsimple.domain.model.Order;
import com.antarez.mktsimple.domain.model.Product;
import com.antarez.mktsimple.repository.OrderRepository;
import com.antarez.mktsimple.security.UserContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private MongoTemplate mongoTemplate;

    @Transactional
    public Order checkout(Order orderRequest) {
        String buyerId = UserContext.getUserId();
        
        double totalValue = 0.0;

        // Deduz estoque para cada item atomicamente e computa o pedido
        for (Order.OrderItem item : orderRequest.getItems()) {
            
            // Query atômica: buscar produto por ID QUE TENHA ESTOQUE maior/igual a qtd desejada
            Query query = new Query(Criteria.where("_id").is(item.getProductId())
                                            .and("stock").gte(item.getQuantity()));
            
            // Update: subtrair estoque com incremento negativo
            Update update = new Update().inc("stock", -item.getQuantity());

            Product updatedProduct = mongoTemplate.findAndModify(query, update, Product.class);

            if (updatedProduct == null) {
                // Caso não ache e falhe, a anotação @Transactional dá rollback na Collection 'orders'
                throw new RuntimeException("Estoque insuficiente ou produto inválido: " + item.getProductId());
            }

            item.setPrice(updatedProduct.getPrice());
            totalValue += (updatedProduct.getPrice() * item.getQuantity());
            
            // Presumindo um modelo simples onde todos os itens do carrinho são do mesmo vendedor neste fluxo
            if (orderRequest.getSellerId() == null) {
                orderRequest.setSellerId(updatedProduct.getSellerId());
            }
        }

        orderRequest.setBuyerId(buyerId);
        orderRequest.setTotalValue(totalValue);
        orderRequest.setStatus("PAID"); 
        
        return orderRepository.save(orderRequest);
    }
}
```

## 5.2. OrderController (Atualizações de Status)

```java
package com.antarez.mktsimple.controller;

import com.antarez.mktsimple.domain.model.Order;
import com.antarez.mktsimple.repository.OrderRepository;
import com.antarez.mktsimple.service.OrderService;
import com.antarez.mktsimple.security.UserContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;
    
    @Autowired
    private OrderRepository orderRepository;

    @PostMapping
    public Order createOrder(@RequestBody Order orderRequest) {
        return orderService.checkout(orderRequest);
    }

    @PatchMapping("/{id}/status")
    public Order updateStatus(@PathVariable String id, @RequestBody String newStatus) {
        String sellerId = UserContext.getUserId(); // Vendedor manipulando o pedido
        
        Order order = orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pedido não encontrado"));
            
        // Validação p/ garantir que o vendedor só mexe na venda que pertence a ele
        if (!order.getSellerId().equals(sellerId)) {
            throw new RuntimeException("Acesso negado: Este pedido é de outro vendedor.");
        }
        
        order.setStatus(newStatus.replaceAll("\"", ""));
        return orderRepository.save(order);
    }
}
```
